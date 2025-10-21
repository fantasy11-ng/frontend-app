/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { FinalsStage, GroupStage, KnockoutStage } from '@/components/predictor';


export type PredictionStage = 'group' | 'round16' | 'quarter' | 'semi' | 'finals';

interface TournamentPredictions {
  groupStage: {
    [groupName: string]: string[]; // ordered list of team names [1st..4th]
  };
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
  const [currentStage, setCurrentStage] = useState<PredictionStage>('group');
  const [predictions, setPredictions] = useState<TournamentPredictions>({
    groupStage: {},
    round16: {},
    quarterFinals: {},
    semiFinals: {},
    finals: {
      thirdPlace: '',
      champion: ''
    }
  });

  // Calculate progress
  const getGroupStageProgress = () => {
    const totalGroups = 6;
    const completedGroups = Object.values(predictions.groupStage).filter(group => group.length === 4).length;
    return { completed: completedGroups, total: totalGroups };
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
    const knockoutProgress = getKnockoutStageProgress();
    const totalTasks = groupProgress.total + knockoutProgress.total;
    const completedTasks = groupProgress.completed + knockoutProgress.completed;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const handleSavePredictions = async () => {
    try {
      // TODO: Implement API call to save predictions
      console.log('Saving predictions:', predictions);
    } catch (error) {
      console.error('Error saving predictions:', error);
      alert('Failed to save predictions. Please try again.');
    }
  };

  const handleNextStage = () => {
    const stages: PredictionStage[] = ['group', 'round16', 'quarter', 'semi', 'finals'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const isStageCompleted = (stage: PredictionStage) => {
    switch (stage) {
      case 'group':
        return Object.values(predictions.groupStage).filter(group => group.length === 4).length === 6;
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
            <GroupStage 
              predictions={predictions.groupStage}
              onUpdate={(groupPredictions: any) => setPredictions(prev => ({
                ...prev,
                groupStage: groupPredictions
              }))}
              onSave={handleSavePredictions}
              onNextStage={handleNextStage}
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
              onSave={handleSavePredictions}
              onNextStage={handleNextStage}
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
              onSave={handleSavePredictions}
              onNextStage={handleNextStage}
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
              onSave={handleSavePredictions}
              onNextStage={handleNextStage}
            />
          )}
          
          {currentStage === 'finals' && (
            <FinalsStage 
              predictions={predictions.finals}
              onUpdate={(finalsPredictions: any) => setPredictions(prev => ({
                ...prev,
                finals: finalsPredictions
              }))}
              onSave={handleSavePredictions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
