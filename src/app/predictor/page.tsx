/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, Suspense, useRef } from "react";
import { Calendar, Check } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useGroups, useStages, useStagePredictions, useBracketSeed, useBracketPredictions, useThirdPlaceMatchSeed, useThirdPlaceMatchPrediction, useThirdPlacedQualifiers } from "@/lib/api";
import { predictorApi } from "@/lib/api";
import { FinalsStage, GroupStage, KnockoutStage, ThirdBestTeams } from '@/components/predictor';
import toast from 'react-hot-toast';
import type { RoundCode, BracketPrediction } from '@/types/predictorStage';


export type PredictionStage = 'group' | 'thirdBest' | 'round16' | 'quarter' | 'semi' | 'finals';

const determineWinnerName = (
  fixture:
    | { homeTeam: { id: number; name: string }; awayTeam: { id: number; name: string } }
    | undefined,
  savedPred: BracketPrediction,
) => {
  if (savedPred.predictedWinner?.name) {
    return savedPred.predictedWinner.name;
  }

  if (fixture && savedPred.predictedWinnerTeamId) {
    if (fixture.homeTeam.id === savedPred.predictedWinnerTeamId) {
      return fixture.homeTeam.name;
    }
    if (fixture.awayTeam.id === savedPred.predictedWinnerTeamId) {
      return fixture.awayTeam.name;
    }
  }

  return null;
};

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

function PredictorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
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

  // Get initial stage from URL params or default to 'group'
  const getInitialStage = (): PredictionStage => {
    const stageParam = searchParams.get('stage');
    const validStages: PredictionStage[] = ['group', 'thirdBest', 'round16', 'quarter', 'semi', 'finals'];
    if (stageParam && validStages.includes(stageParam as PredictionStage)) {
      return stageParam as PredictionStage;
    }
    return 'group';
  };

  const [currentStage, setCurrentStage] = useState<PredictionStage>(getInitialStage);
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

  // Track loaded finals predictions to prevent infinite loops
  const loadedFinalsRef = useRef<{ thirdPlace: string; champion: string } | null>(null);
  // Track if we're updating stage to prevent feedback loops
  const isUpdatingStageRef = useRef(false);

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

  // Fetch saved predictions for all stages to check completion status
  // This allows us to determine which stages are unlocked
  const { data: savedThirdBestTeams = [] } = useThirdPlacedQualifiers(true);
  const { data: savedRound16Predictions = [] } = useBracketPredictions('r16', true);
  const { data: savedQuarterPredictions = [] } = useBracketPredictions('qf', true);
  const { data: savedSemiPredictions = [] } = useBracketPredictions('sf', true);
  const { data: savedThirdPlaceMatch = [] } = useThirdPlaceMatchPrediction(true);
  const { data: savedFinalPredictions = [] } = useBracketPredictions('final', true);

  // Only fetch bracket data for the stage the user is currently on
  const isRound16Stage = currentStage === 'round16';
  const isQuarterStage = currentStage === 'quarter';
  const isSemiStage = currentStage === 'semi';
  const isFinalsStage = currentStage === 'finals';

  const { data: round16Seed = [] } = useBracketSeed('r16', isRound16Stage);
  const { data: round16Predictions = [] } = useBracketPredictions('r16', isRound16Stage);
  
  const { data: quarterSeed = [] } = useBracketSeed('qf', isQuarterStage);
  const { data: quarterPredictions = [] } = useBracketPredictions('qf', isQuarterStage);
  
  const { data: semiSeed = [] } = useBracketSeed('sf', isSemiStage);
  const { data: semiPredictions = [] } = useBracketPredictions('sf', isSemiStage);

  // Load round16 predictions into state - only when on that stage
  useEffect(() => {
    if (!isRound16Stage) return;
    if (round16Seed.length > 0 && round16Predictions.length > 0) {
      const loaded: { [externalFixtureId: string]: string } = {};
      round16Predictions.forEach((savedPred) => {
        const fixture = round16Seed.find(f => f.externalFixtureId === savedPred.externalFixtureId);
        if (fixture) {
          const winnerName = determineWinnerName(fixture, savedPred);
          if (winnerName) {
            loaded[savedPred.externalFixtureId.toString()] = winnerName;
          }
        }
      });
      if (Object.keys(loaded).length > 0) {
        setPredictions(prev => ({ ...prev, round16: loaded }));
      }
    }
  }, [isRound16Stage, round16Seed, round16Predictions]);

  // Load quarter predictions into state - only when on that stage
  useEffect(() => {
    if (!isQuarterStage) return;
    if (quarterSeed.length > 0 && quarterPredictions.length > 0) {
      const loaded: { [externalFixtureId: string]: string } = {};
      quarterPredictions.forEach((savedPred) => {
        const fixture = quarterSeed.find(f => f.externalFixtureId === savedPred.externalFixtureId);
        if (fixture) {
          const winnerName = determineWinnerName(fixture, savedPred);
          if (winnerName) {
            loaded[savedPred.externalFixtureId.toString()] = winnerName;
          }
        }
      });
      if (Object.keys(loaded).length > 0) {
        setPredictions(prev => ({ ...prev, quarterFinals: loaded }));
      }
    }
  }, [isQuarterStage, quarterSeed, quarterPredictions]);

  // Load semi predictions into state - only when on that stage
  useEffect(() => {
    if (!isSemiStage) return;
    if (semiSeed.length > 0 && semiPredictions.length > 0) {
      const loaded: { [externalFixtureId: string]: string } = {};
      semiPredictions.forEach((savedPred) => {
        const fixture = semiSeed.find(f => f.externalFixtureId === savedPred.externalFixtureId);
        if (fixture) {
          const winnerName = determineWinnerName(fixture, savedPred);
          if (winnerName) {
            loaded[savedPred.externalFixtureId.toString()] = winnerName;
          }
        }
      });
      if (Object.keys(loaded).length > 0) {
        setPredictions(prev => ({ ...prev, semiFinals: loaded }));
      }
    }
  }, [isSemiStage, semiSeed, semiPredictions]);

  // Load finals predictions (third-place and final) - only fetch when on finals stage
  const { data: thirdPlaceSeed = [] } = useThirdPlaceMatchSeed(isFinalsStage);
  const { data: thirdPlacePredictions = [] } = useThirdPlaceMatchPrediction(isFinalsStage);
  const { data: finalSeedForFinals = [] } = useBracketSeed('final', isFinalsStage);
  const { data: finalPredictionsForFinals = [] } = useBracketPredictions('final', isFinalsStage);

  // Extract prediction values using useMemo to create stable dependencies
  const thirdPlaceWinner = useMemo(() => {
    if (thirdPlaceSeed.length > 0 && thirdPlacePredictions.length > 0) {
      const thirdPlaceFixture = thirdPlaceSeed[0];
      const savedPred = thirdPlacePredictions[0];
      return determineWinnerName(thirdPlaceFixture, savedPred);
    }
    return null;
  }, [thirdPlaceSeed, thirdPlacePredictions]);

  const finalWinner = useMemo(() => {
    if (finalSeedForFinals.length > 0 && finalPredictionsForFinals.length > 0) {
      const finalFixture = finalSeedForFinals[0];
      const savedPred = finalPredictionsForFinals[0];
      return determineWinnerName(finalFixture, savedPred);
    }
    return null;
  }, [finalSeedForFinals, finalPredictionsForFinals]);

  // Load finals predictions into state - only when on finals stage
  useEffect(() => {
    if (!isFinalsStage) {
      loadedFinalsRef.current = null; // Reset when leaving finals stage
      return;
    }

    // Only update if we have new prediction values that differ from what we've loaded
    const shouldUpdateThirdPlace = thirdPlaceWinner !== null && 
      thirdPlaceWinner !== loadedFinalsRef.current?.thirdPlace;
    const shouldUpdateChampion = finalWinner !== null && 
      finalWinner !== loadedFinalsRef.current?.champion;

    if (shouldUpdateThirdPlace || shouldUpdateChampion) {
      setPredictions(prev => {
        const newThirdPlace = shouldUpdateThirdPlace ? thirdPlaceWinner! : prev.finals.thirdPlace;
        const newChampion = shouldUpdateChampion ? finalWinner! : prev.finals.champion;

        // Update ref with new values
        loadedFinalsRef.current = {
          thirdPlace: newThirdPlace,
          champion: newChampion
        };

        return {
          ...prev,
          finals: {
            thirdPlace: newThirdPlace,
            champion: newChampion
          }
        };
      });
    }
  }, [isFinalsStage, thirdPlaceWinner, finalWinner]);

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

  // Update URL when stage changes
  const updateStage = (newStage: PredictionStage) => {
    // Prevent navigation to locked stages
    if (!isStageAccessible(newStage)) {
      toast.error('Please complete the previous stage before proceeding.');
      return;
    }
    
    // Prevent feedback loops
    if (isUpdatingStageRef.current) {
      return;
    }
    
    isUpdatingStageRef.current = true;
    
    // Update state first for immediate UI update
    setCurrentStage(newStage);
    
    // Update URL without causing a page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('stage', newStage);
    router.replace(`/predictor?${params.toString()}`, { scroll: false });
    
    // Reset flag after a short delay to allow URL update to complete
    setTimeout(() => {
      isUpdatingStageRef.current = false;
    }, 100);
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
        // Filter out fixtures where predictions aren't complete (e.g., one team is TBD)
        const validFixtures = bracketSeed.filter(fixture => 
          fixture.homeTeam.id && fixture.awayTeam.id
        );
        
        const bracketPredictions = validFixtures.map((fixture) => {
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
            throw new Error(`No prediction found for fixture ${fixture.externalFixtureId} (${fixture.homeTeam.name} vs ${fixture.awayTeam.name})`);
          }

          return {
            externalFixtureId: fixture.externalFixtureId,
            predictedWinnerTeamId,
          };
        });
        
        if (bracketPredictions.length === 0) {
          throw new Error('No valid predictions to submit. Please make sure all matches have predictions.');
        }

        // Submit predictions
        await predictorApi.saveBracketPredictions(roundCode, {
          predictions: bracketPredictions,
        });

        // Invalidate and refetch saved predictions to sync state
        await queryClient.invalidateQueries({ queryKey: ['predictor', 'bracket', roundCode, 'me'] });

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
      updateStage(stages[currentIndex + 1]);
    }
  };

  const isStageCompleted = (stage: PredictionStage) => {
    switch (stage) {
      case 'group':
        // Check both local state and saved API predictions
        const localGroupCompleted = Object.values(predictions.groupStage).filter(group => group.length === 4).length === groups.length;
        const savedGroupCompleted = groupStagePredictions && groupStagePredictions.length > 0 && 
          groupStagePredictions.every(pred => pred.teams.length === 4);
        return localGroupCompleted || savedGroupCompleted;
      case 'thirdBest':
        // Check both local state and saved API predictions
        const localThirdBestCompleted = predictions.thirdBestTeams.length === 4;
        const savedThirdBestCompleted = savedThirdBestTeams.length === 4;
        return localThirdBestCompleted || savedThirdBestCompleted;
      case 'round16':
        // Check both local state and saved API predictions
        const localRound16Keys = Object.keys(predictions.round16).filter(key => predictions.round16[key]);
        const localRound16Completed = localRound16Keys.length >= 8;
        const savedRound16Completed = savedRound16Predictions.length >= 8;
        return localRound16Completed || savedRound16Completed;
      case 'quarter':
        // Check both local state and saved API predictions
        const localQuarterKeys = Object.keys(predictions.quarterFinals).filter(key => predictions.quarterFinals[key]);
        const localQuarterCompleted = localQuarterKeys.length >= 4;
        const savedQuarterCompleted = savedQuarterPredictions.length >= 4;
        return localQuarterCompleted || savedQuarterCompleted;
      case 'semi':
        // Check both local state and saved API predictions
        const localSemiKeys = Object.keys(predictions.semiFinals).filter(key => predictions.semiFinals[key]);
        const localSemiCompleted = localSemiKeys.length >= 2;
        const savedSemiCompleted = savedSemiPredictions.length >= 2;
        return localSemiCompleted || savedSemiCompleted;
      case 'finals':
        // Check both local state and saved API predictions
        const localFinalsCompleted = predictions.finals.thirdPlace !== '' && predictions.finals.champion !== '';
        const savedFinalsCompleted = savedThirdPlaceMatch.length > 0 && savedFinalPredictions.length > 0;
        return localFinalsCompleted || savedFinalsCompleted;
      default:
        return false;
    }
  };

  // Check if a stage is accessible (all previous stages must be completed)
  const isStageAccessible = (stage: PredictionStage): boolean => {
    const stages: PredictionStage[] = ['group', 'thirdBest', 'round16', 'quarter', 'semi', 'finals'];
    const stageIndex = stages.indexOf(stage);
    
    // First stage is always accessible
    if (stageIndex === 0) {
      return true;
    }
    
    // Check if all previous stages are completed
    for (let i = 0; i < stageIndex; i++) {
      if (!isStageCompleted(stages[i])) {
        return false;
      }
    }
    
    return true;
  };

  // Sync stage with URL params when they change externally (e.g., browser back/forward)
  // This effect only handles external URL changes, not internal updates via updateStage
  useEffect(() => {
    // Skip if we're in the middle of updating stage to prevent feedback loops
    if (isUpdatingStageRef.current) {
      return;
    }
    
    const stageParam = searchParams.get('stage');
    const validStages: PredictionStage[] = ['group', 'thirdBest', 'round16', 'quarter', 'semi', 'finals'];
    
    if (stageParam && validStages.includes(stageParam as PredictionStage)) {
      const newStage = stageParam as PredictionStage;
      
      // Only update if the stage actually changed
      if (currentStage === newStage) {
        return;
      }
      
      // Check if the stage is accessible before allowing navigation
      if (!isStageAccessible(newStage)) {
        // Redirect to the first incomplete stage or group stage
        const stages: PredictionStage[] = ['group', 'thirdBest', 'round16', 'quarter', 'semi', 'finals'];
        let firstIncompleteStage: PredictionStage = 'group';
        
        for (const stage of stages) {
          if (!isStageCompleted(stage)) {
            firstIncompleteStage = stage;
            break;
          }
        }
        
        // Only redirect if we're not already on the correct stage
        if (currentStage !== firstIncompleteStage) {
          isUpdatingStageRef.current = true;
          const params = new URLSearchParams(searchParams.toString());
          params.set('stage', firstIncompleteStage);
          router.replace(`/predictor?${params.toString()}`, { scroll: false });
          setCurrentStage(firstIncompleteStage);
          toast.error('Please complete previous stages before accessing this stage.');
          setTimeout(() => {
            isUpdatingStageRef.current = false;
          }, 100);
        }
        return;
      }
      
      // Update stage if it's different and accessible
      setCurrentStage(newStage);
    } else if (!stageParam) {
      // If no stage param, set it in URL to 'group' (only if not already on group)
      if (currentStage !== 'group') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('stage', 'group');
        router.replace(`/predictor?${params.toString()}`, { scroll: false });
      }
    }
    // Only depend on searchParams and currentStage to prevent unnecessary re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
              <div className="text-gray-500 text-sm">January 18, 2026 at 18:00 GMT</div>
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
              const isAccessible = isStageAccessible(stage.id as PredictionStage);
              
              return (
                <button
                  key={stage.id}
                  onClick={() => updateStage(stage.id as PredictionStage)}
                  disabled={!isAccessible}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
                    isActive
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : isCompleted
                      ? 'border-gray-200 text-green-600 hover:border-gray-300'
                      : isAccessible
                      ? 'border-gray-200 text-gray-500 hover:border-gray-300'
                      : 'border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                  }`}
                  title={!isAccessible ? 'Complete previous stages to unlock this stage' : ''}
                >
                  {isCompleted && !isActive && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {stage.label}
                  {!isAccessible && !isActive && (
                    <span className="ml-2 text-xs">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Content */}
        <div className="bg-white rounded-lg shadow-sm border transition-opacity duration-200">
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
              isSubmitting={isSubmitting}
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
                        externalFixtureId: thirdPlaceFixture.externalFixtureId,
                        predictedWinnerTeamId,
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

export default function PredictorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading predictor...</p>
        </div>
      </div>
    }>
      <PredictorPageContent />
    </Suspense>
  );
}
