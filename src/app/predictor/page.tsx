/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Check } from "lucide-react";
import { useGroups, useStages, useStagePredictions } from "@/lib/api";
import { predictorApi } from "@/lib/api";
import { FinalsStage, GroupStage, KnockoutStage, ThirdBestTeams } from '@/components/predictor';
import toast from 'react-hot-toast';
import type { RoundCode } from '@/types/predictorStage';


export type PredictionStage = 'group' | 'thirdBest' | 'round16' | 'quarter' | 'semi' | 'finals';

interface TournamentPredictions {
  groupStage: {
    [groupName: string]: string[]; // ordered list of team names [1st..4th]
  };
  thirdBestTeams: string[]; // 4 teams selected from 3rd place finishers
  round16: {
    [matchId: string]: string; // winner team name
  };
  quarterFinals: {
    [matchId: string]: string; // winner team name
  };
  semiFinals: {
    [matchId: string]: string; // winner team name
  };
  finals: {
    thirdPlace: string; // winner team name
    champion: string; // winner team name
  };
}

export default function PredictorPage() {
  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useGroups();
  const { data: stages = [], isLoading: stagesLoading, error: stagesError } = useStages();

  // Find the stage ID for the group stage from /stages endpoint
  const groupStageId = useMemo(() => {
    const groupStage = stages.find(
      (stage) =>
        stage.code === "group-stage" ||
        stage.name.toLowerCase() === "group stage"
    );
    return groupStage?.id;
  }, [stages]);

  const { data: groupStagePredictions } = useStagePredictions(
    groupStageId ?? 0,
    !!groupStageId
  );
  const [currentStage, setCurrentStage] = useState<PredictionStage>('group');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictions, setPredictions] = useState<TournamentPredictions>({
    groupStage: {},
    thirdBestTeams: [],
    round16: {},
    quarterFinals: {},
    semiFinals: {},
    finals: {
      thirdPlace: '',
      champion: ''
    }
  });

  // When we have both groups and saved predictions for the group stage,
  // initialize the local predictions state so the UI reflects saved data.
  useEffect(() => {
    if (!groups.length || !groupStagePredictions?.length) return;

    const groupIdToNameMap = new Map<number, string>();
    groups.forEach((group) => {
      groupIdToNameMap.set(group.id, group.name);
    });

    const nextGroupStage: TournamentPredictions["groupStage"] = {};

    groupStagePredictions.forEach((prediction) => {
      const groupName = groupIdToNameMap.get(prediction.groupId);
      if (!groupName) return;

      const orderedTeams = [...prediction.teams]
        .sort((a, b) => a.index - b.index)
        .map((t) => t.name);

      if (orderedTeams.length === 4) {
        nextGroupStage[groupName] = orderedTeams;
      }
    });

    if (Object.keys(nextGroupStage).length > 0) {
      setPredictions((prev) => ({
        ...prev,
        groupStage: {
          // keep any existing predictions, override with API-loaded ones
          ...prev.groupStage,
          ...nextGroupStage,
        },
      }));
    }
  }, [groups, groupStagePredictions]);

  // Calculate progress
  const getGroupStageProgress = () => {
    const totalGroups = groups.length;
    const completedGroups = Object.values(predictions.groupStage).filter(group => group.length === 4).length;
    return { completed: completedGroups, total: totalGroups };
  };

  const getThirdBestProgress = () => {
    return { completed: predictions.thirdBestTeams.length, total: 4 };
  };

  const getKnockoutStageProgress = () => {
    const totalMatches = 16;
    const completedMatches = Object.keys(predictions.round16).length + 
                           Object.keys(predictions.quarterFinals).length + 
                           Object.keys(predictions.semiFinals).length + 
                           (predictions.finals.thirdPlace ? 1 : 0) + 
                           (predictions.finals.champion ? 1 : 0);
    return { completed: completedMatches, total: totalMatches };
  };

  const getOverallProgress = () => {
    const groupProgress = getGroupStageProgress();
    const thirdBestProgress = getThirdBestProgress();
    const knockoutProgress = getKnockoutStageProgress();
    const totalTasks = groupProgress.total + thirdBestProgress.total + knockoutProgress.total;
    const completedTasks = groupProgress.completed + thirdBestProgress.completed + knockoutProgress.completed;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const handleSavePredictions = async () => {
    try {
      // TODO: Implement API call to save predictions
      console.log('Saving predictions:', predictions);
    } catch (error: any) {
      console.error('Error saving predictions:', error);
      toast.error(error);
    }
  };

  // Map stage to round code for bracket API
  const getRoundCode = (stage: PredictionStage): RoundCode | null => {
    switch (stage) {
      case 'round16':
        return 'r16';
      case 'quarter':
        return 'qf';
      case 'semi':
        return 'sf';
      case 'finals':
        return 'final';
      default:
        return null;
    }
  };

  const handleNextStage = async () => {
    const roundCode = getRoundCode(currentStage);
    
    // If this is a bracket stage (r16, qf, sf), submit predictions first
    // Note: finals stage handles its own submission via onSave
    if (roundCode && currentStage !== 'finals') {
      setIsSubmitting(true);
      try {
        // Get bracket seed to map team names to IDs and get externalFixtureIds
        const bracketSeed = await predictorApi.getBracketSeed(roundCode);
        
        // Get current predictions for this stage
        const stagePredictions = 
          currentStage === 'round16' ? predictions.round16 :
          currentStage === 'quarter' ? predictions.quarterFinals :
          currentStage === 'semi' ? predictions.semiFinals :
          {};

        // Build predictions array for bracket API
        const bracketPredictions = bracketSeed.map((fixture) => {
          // For other stages, predictions are stored as { externalFixtureId: teamName }
          const matchPredictions = stagePredictions as { [externalFixtureId: string]: string };
          const fixtureIdKey = fixture.externalFixtureId.toString();
          const selectedWinner = matchPredictions[fixtureIdKey];
          
          let predictedWinnerTeamId: number | null = null;
          
          if (selectedWinner) {
            // Match selected winner name to team ID
            if (selectedWinner === fixture.homeTeam.name) {
              predictedWinnerTeamId = fixture.homeTeam.id;
            } else if (selectedWinner === fixture.awayTeam.name) {
              predictedWinnerTeamId = fixture.awayTeam.id;
            }
          }

          if (!predictedWinnerTeamId) {
            throw new Error(`No prediction found for fixture ${fixture.externalFixtureId}`);
          }

          return {
            externalFixtureId: fixture.externalFixtureId,
            predictedWinnerTeamId,
          };
        });

        // Submit predictions
        await predictorApi.saveBracketPredictions(roundCode, {
          predictions: bracketPredictions,
        });

        toast.success(`${currentStage === 'round16' ? 'Round of 16' : currentStage === 'quarter' ? 'Quarter Finals' : 'Semi Finals'} predictions submitted successfully!`);
      } catch (error: any) {
        console.error('Error submitting bracket predictions:', error);
        toast.error(error?.response?.data?.message || 'Failed to submit predictions. Please try again.');
        setIsSubmitting(false);
        return; // Don't advance to next stage if submission fails
      } finally {
        setIsSubmitting(false);
      }
    }

    // Move to next stage
    const stages: PredictionStage[] = ['group', 'thirdBest', 'round16', 'quarter', 'semi', 'finals'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const isStageCompleted = (stage: PredictionStage) => {
    switch (stage) {
      case 'group':
        return Object.values(predictions.groupStage).filter(group => group.length === 4).length === groups.length;
      case 'thirdBest':
        return predictions.thirdBestTeams.length === 4;
      case 'round16':
        return Object.keys(predictions.round16).length === 8;
      case 'quarter':
        return Object.keys(predictions.quarterFinals).length === 4;
      case 'semi':
        return Object.keys(predictions.semiFinals).length === 2;
      case 'finals':
        return predictions.finals.thirdPlace !== '' && predictions.finals.champion !== '';
      default:
        return false;
    }
  };

  const groupProgress = getGroupStageProgress();
  const knockoutProgress = getKnockoutStageProgress();
  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tournament Predictor
            </h1>
            <div className="text-right">
              <div className="text-red-600 font-medium">{overallProgress}% Complete</div>
              {/* TODO: Add the actual ending date and time of the tournament */}
              <div className="text-gray-500 text-sm">December 21, 2024 at 18:00 GMT</div>
            </div>
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Group Stage Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Group Stage</h3>
              </div>
              <div className="text-sm text-gray-600 mb-2">Groups Completed</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {groupProgress.completed}/{groupProgress.total}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(groupProgress.completed / groupProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Knockout Stage Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Knockout Stage</h3>
              </div>
              <div className="text-sm text-gray-600 mb-2">Matches Predicted</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {knockoutProgress.completed}/{knockoutProgress.total}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(knockoutProgress.completed / knockoutProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              </div>
              <div className="text-sm text-gray-600 mb-2">Total Complete</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {overallProgress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'group', label: 'Group Stage' },
              { id: 'thirdBest', label: '3rd Best Teams' },
              { id: 'round16', label: 'Round of 16' },
              { id: 'quarter', label: 'Quarter Finals' },
              { id: 'semi', label: 'Semi Finals' },
              { id: 'finals', label: 'Finals' }
            ].map((stage) => {
              const isActive = currentStage === stage.id;
              const isCompleted = isStageCompleted(stage.id as PredictionStage);
              
              return (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(stage.id as PredictionStage)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : isCompleted
                      ? 'border-gray-200 text-green-600 hover:border-gray-300'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {isCompleted && !isActive && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {currentStage === 'group' && (
            (groupsLoading || stagesLoading) ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading groups...</p>
              </div>
            ) : (groupsError || stagesError || !groupStageId) ? (
              <div className="p-6 text-center">
                <p className="text-red-500">Error loading groups/stages. Please try again.</p>
              </div>
            ) : (
              <GroupStage 
                groups={groups}
                predictions={predictions.groupStage}
                stageId={groupStageId}
                onUpdate={(groupPredictions: any) => setPredictions(prev => ({
                  ...prev,
                  groupStage: groupPredictions
                }))}
                onSave={handleSavePredictions}
                onNextStage={handleNextStage}
              />
            )
          )}
          
          {currentStage === 'thirdBest' && (
            <ThirdBestTeams 
              predictions={predictions.thirdBestTeams}
              groupStage={predictions.groupStage}
              groups={groups}
              onUpdate={(thirdBestTeams: string[]) => setPredictions(prev => ({
                ...prev,
                thirdBestTeams: thirdBestTeams
              }))}
              onSave={handleSavePredictions}
              onNextStage={handleNextStage}
              isSubmitting={isSubmitting}
            />
          )}
          
          {currentStage === 'round16' && (
            <KnockoutStage 
              stage="round16"
              predictions={predictions.round16}
              onUpdate={(matchPredictions: any) => setPredictions(prev => ({
                ...prev,
                round16: matchPredictions
              }))}
              onNextStage={handleNextStage}
              isSubmitting={isSubmitting}
            />
          )}
          
          {currentStage === 'quarter' && (
            <KnockoutStage 
              stage="quarter"
              predictions={predictions.quarterFinals}
              onUpdate={(matchPredictions: any) => setPredictions(prev => ({
                ...prev,
                quarterFinals: matchPredictions
              }))}
              onNextStage={handleNextStage}
              isSubmitting={isSubmitting}
            />
          )}
          
          {currentStage === 'semi' && (
            <KnockoutStage 
              stage="semi"
              predictions={predictions.semiFinals}
              onUpdate={(matchPredictions: any) => setPredictions(prev => ({
                ...prev,
                semiFinals: matchPredictions
              }))}
              onNextStage={handleNextStage}
              isSubmitting={isSubmitting}
            />
          )}
          
          {currentStage === 'finals' && (
            <FinalsStage 
              predictions={predictions.finals}
              onUpdate={(finalsPredictions: any) => setPredictions(prev => ({
                ...prev,
                finals: finalsPredictions
              }))}
              onSave={async () => {
                // Submit third-place and final predictions separately
                setIsSubmitting(true);
                try {
                  const finalsPreds = predictions.finals;
                  
                  // Submit third-place prediction
                  if (finalsPreds.thirdPlace) {
                    const thirdPlaceSeed = await predictorApi.getThirdPlaceMatchSeed();
                    if (thirdPlaceSeed.length > 0) {
                      const thirdPlaceFixture = thirdPlaceSeed[0];
                      const predictedWinnerTeamId = 
                        finalsPreds.thirdPlace === thirdPlaceFixture.homeTeam.name
                          ? thirdPlaceFixture.homeTeam.id
                          : thirdPlaceFixture.awayTeam.id;
                      
                      await predictorApi.saveThirdPlaceMatchPrediction({
                        predictions: [{
                          externalFixtureId: thirdPlaceFixture.externalFixtureId,
                          predictedWinnerTeamId,
                        }],
                      });
                    }
                  }
                  
                  // Submit final prediction
                  if (finalsPreds.champion) {
                    const finalSeed = await predictorApi.getBracketSeed('final');
                    if (finalSeed.length > 0) {
                      const finalFixture = finalSeed[0];
                      const predictedWinnerTeamId = 
                        finalsPreds.champion === finalFixture.homeTeam.name
                          ? finalFixture.homeTeam.id
                          : finalFixture.awayTeam.id;
                      
                      await predictorApi.saveBracketPredictions('final', {
                        predictions: [{
                          externalFixtureId: finalFixture.externalFixtureId,
                          predictedWinnerTeamId,
                        }],
                      });
                    }
                  }
                  
                  toast.success('Finals predictions submitted successfully!');
                } catch (error: any) {
                  console.error('Error submitting finals predictions:', error);
                  toast.error(error?.response?.data?.message || 'Failed to submit predictions. Please try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
