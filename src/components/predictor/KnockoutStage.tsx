'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useBracketSeed, useBracketPredictions } from '@/lib/api';
import type { RoundCode } from '@/types/predictorStage';
import Image from 'next/image';

interface KnockoutStageProps {
  stage: 'round16' | 'quarter' | 'semi';
  predictions: { [matchId: string]: string }; // winner team name (legacy) or externalFixtureId
  onUpdate: (predictions: { [matchId: string]: string }) => void;
  onNextStage: () => void | Promise<void>; // Also responsible for submitting predictions
  isSubmitting?: boolean;
}

// Map stage to round code
const getRoundCode = (stage: 'round16' | 'quarter' | 'semi'): RoundCode => {
  switch (stage) {
    case 'round16':
      return 'r16';
    case 'quarter':
      return 'qf';
    case 'semi':
      return 'sf';
  }
};

const stageLabels = {
  round16: 'Round of 16 Predictions',
  quarter: 'Quarter Finals Predictions',
  semi: 'Semi Finals Predictions'
};

const stageInstructions = {
  round16: 'Pick the winner of each match to advance to the Quarter Finals',
  quarter: 'Pick the winner of each match to advance to the Semi Finals',
  semi: 'Pick the 2 teams that will reach the Final + 3rd Place playoff'
};

export default function KnockoutStage({ stage, predictions, onUpdate, onNextStage, isSubmitting = false }: KnockoutStageProps) {
  const roundCode = getRoundCode(stage);
  const { data: bracketSeed = [], isLoading: seedLoading, error: seedError } = useBracketSeed(roundCode, true);
  const { data: savedPredictions = [] } = useBracketPredictions(roundCode, true);
  
  // Store predictions by externalFixtureId
  const [selectedWinners, setSelectedWinners] = useState<{ [externalFixtureId: string]: string }>(() => {
    // Initialize from props, converting any legacy matchId keys to externalFixtureId
    const initial: { [externalFixtureId: string]: string } = {};
    if (bracketSeed.length > 0) {
      bracketSeed.forEach((fixture) => {
        // Try to find prediction by externalFixtureId first
        const fixtureIdKey = fixture.externalFixtureId.toString();
        if (predictions[fixtureIdKey]) {
          initial[fixtureIdKey] = predictions[fixtureIdKey];
        }
      });
    }
    return initial;
  });

  // Update selected winners when bracket seed or saved predictions load
  useEffect(() => {
    if (bracketSeed.length > 0) {
      const initial: { [externalFixtureId: string]: string } = {};
      
      // First, try to use saved predictions from API
      if (savedPredictions.length > 0) {
        savedPredictions.forEach((savedPred) => {
          const fixture = bracketSeed.length > 0 && bracketSeed.find(f => f.externalFixtureId === savedPred.externalFixtureId);
          if (fixture) {
            const winnerTeam = fixture.homeTeam.id === savedPred.predictedWinnerTeamId 
              ? fixture.homeTeam 
              : fixture.awayTeam;
            if (winnerTeam) {
              initial[savedPred.externalFixtureId.toString()] = winnerTeam.name;
            }
          }
        });
      }
      
      // Fallback to props predictions if no saved predictions
      if (Object.keys(initial).length === 0) {
        bracketSeed.forEach((fixture) => {
          const fixtureIdKey = fixture.externalFixtureId.toString();
          if (predictions[fixtureIdKey]) {
            initial[fixtureIdKey] = predictions[fixtureIdKey];
          }
        });
      }
      
      if (Object.keys(initial).length > 0) {
        setSelectedWinners(initial);
        // Update parent state if we loaded from API
        if (savedPredictions.length > 0) {
          onUpdate(initial);
        }
      }
    }
  }, [bracketSeed, savedPredictions, predictions, onUpdate]);

  const handleTeamSelect = (externalFixtureId: number, teamName: string) => {
    const fixtureIdKey = externalFixtureId.toString();
    const newSelections = { ...selectedWinners, [fixtureIdKey]: teamName };
    setSelectedWinners(newSelections);
    onUpdate(newSelections);
  };

  const completedMatches = Object.keys(selectedWinners).filter(id => selectedWinners[id]).length;
  const totalMatches = bracketSeed.length;

  const isStageComplete = completedMatches === totalMatches && totalMatches > 0;

  if (seedLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-500" />
        <p className="text-gray-500">Loading matches...</p>
      </div>
    );
  }

  if (seedError || bracketSeed.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading matches. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {stageLabels[stage]}
          </h2>
          <p className="text-gray-600">
            {stageInstructions[stage]}
          </p>
        </div>
        <div className="flex space-x-3">
          {isStageComplete && (
            <button
              onClick={onNextStage}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Next Stage'}
            </button>
          )}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-orange-600 mr-2" />
          <p className="text-orange-800 text-sm">
            <strong>Tip:</strong> Complete all stages to unlock the full tournament prediction. Each stage unlocks after completing the previous one.
          </p>
        </div>
      </div>

      {/* Matches Grid */}
      <div className={`grid gap-6 ${
        stage === 'semi' ? 'grid-cols-1 md:grid-cols-2' : 
        stage === 'quarter' ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {bracketSeed.length > 0 && bracketSeed.map((fixture, index) => {
          const fixtureIdKey = fixture.externalFixtureId.toString();
          const selectedWinner = selectedWinners[fixtureIdKey];
          
          return (
            <div key={fixture.externalFixtureId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Match {index + 1}
                </h3>
                {selectedWinner && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>

              <div className="space-y-4">
                {/* Home Team */}
                <div
                  onClick={() => handleTeamSelect(fixture.externalFixtureId, fixture.homeTeam.name)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWinner === fixture.homeTeam.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    {fixture.homeTeam.logo ? (
                      <div className="w-8 h-8 mr-3 flex-shrink-0">
                        <Image
                          src={fixture.homeTeam.logo}
                          alt={fixture.homeTeam.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {fixture.homeTeam.short || fixture.homeTeam.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{fixture.homeTeam.name}</span>
                  </div>
                </div>

                {/* VS */}
                <div className="text-center text-gray-500 font-medium">vs</div>

                {/* Away Team */}
                <div
                  onClick={() => handleTeamSelect(fixture.externalFixtureId, fixture.awayTeam.name)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWinner === fixture.awayTeam.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    {fixture.awayTeam.logo ? (
                      <div className="w-8 h-8 mr-3 flex-shrink-0">
                        <Image
                          src={fixture.awayTeam.logo}
                          alt={fixture.awayTeam.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {fixture.awayTeam.short || fixture.awayTeam.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{fixture.awayTeam.name}</span>
                  </div>
                </div>
              </div>

              {/* Selected Winner */}
              {selectedWinner && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Image src="/Gold.png" alt="Gold Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                    <span className="text-green-800 font-medium">
                      Winner: {selectedWinner}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Matches Predicted: {completedMatches}/{totalMatches}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((completedMatches / totalMatches) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
