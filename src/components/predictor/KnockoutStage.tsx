'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Check, Crown } from 'lucide-react';
import { useBracketSeedWithQualified, useBracketPredictions } from '@/lib/api';
import type { RoundCode, BracketPrediction, BracketSeedFixture } from '@/types/predictorStage';
import Image from 'next/image';
import { Spinner } from '../common/Spinner';

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

const getWinnerNameFromPrediction = (fixture: BracketSeedFixture, savedPred: BracketPrediction) => {
  if (savedPred.predictedWinner?.name) {
    return savedPred.predictedWinner.name;
  }

  if (savedPred.predictedWinnerTeamId) {
    if (fixture.homeTeam.id === savedPred.predictedWinnerTeamId) {
      return fixture.homeTeam.name;
    }
    if (fixture.awayTeam.id === savedPred.predictedWinnerTeamId) {
      return fixture.awayTeam.name;
    }
  }

  return null;
};

export default function KnockoutStage({ stage, predictions, onUpdate, onNextStage, isSubmitting = false }: KnockoutStageProps) {
  const roundCode = getRoundCode(stage);
  const { data: bracketSeedData, isLoading: seedLoading, error: seedError } = useBracketSeedWithQualified(roundCode, true);
  const { data: savedPredictions = [] } = useBracketPredictions(roundCode, true);
  const bracketSeed = useMemo(() => bracketSeedData?.fixtures ?? [], [bracketSeedData?.fixtures]);
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  const syncParentSelections = useCallback((nextSelections: { [externalFixtureId: string]: string }) => {
    onUpdateRef.current(nextSelections);
  }, []);
  
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

  const savedSelections = useMemo(() => {
    if (bracketSeed.length === 0 || savedPredictions.length === 0) {
      return {};
    }
    const selections: Record<string, string> = {};
    savedPredictions.forEach((savedPred) => {
      const fixture = bracketSeed.find((f) => f.externalFixtureId === savedPred.externalFixtureId);
      if (fixture) {
        const winnerName = getWinnerNameFromPrediction(fixture, savedPred);
        if (winnerName) {
          selections[savedPred.externalFixtureId.toString()] = winnerName;
        }
      }
    });
    return selections;
  }, [bracketSeed, savedPredictions]);

  const mergedSelections = useMemo(
    () => ({
      ...savedSelections,
      ...predictions,
      ...selectedWinners,
    }),
    [savedSelections, predictions, selectedWinners],
  );

  // Track the last roundCode we initialized for to detect stage changes
  const [lastInitializedRoundCode, setLastInitializedRoundCode] = useState<RoundCode | null>(null);
  const initializedWithEmptyPropsRef = useRef<boolean>(false);

  // Reset when stage/roundCode changes
  useEffect(() => {
    if (lastInitializedRoundCode !== null && lastInitializedRoundCode !== roundCode) {
      setLastInitializedRoundCode(null);
      setSelectedWinners({});
      initializedWithEmptyPropsRef.current = false;
    }
  }, [roundCode, lastInitializedRoundCode]);

  // Load saved predictions from API whenever they're available
  useEffect(() => {
    // Don't load if we're switching to a different stage
    if (lastInitializedRoundCode !== null && lastInitializedRoundCode !== roundCode) return;
    
    // Need both seed and predictions to load
    if (bracketSeed.length === 0) return;
    if (savedPredictions.length === 0) return;

    const loaded: { [externalFixtureId: string]: string } = {};
    
    savedPredictions.forEach((savedPred) => {
      const fixture = bracketSeed.find(f => f.externalFixtureId === savedPred.externalFixtureId);
      if (fixture) {
        const winnerName = getWinnerNameFromPrediction(fixture, savedPred);
        if (winnerName) {
          loaded[savedPred.externalFixtureId.toString()] = winnerName;
        }
      }
    });

    // Always update if we have loaded predictions (even if we already have some in state)
    if (Object.keys(loaded).length > 0) {
      // Replace state with saved predictions from API (they are the source of truth)
      setSelectedWinners(prev => {
        // Check if we need to update (if loaded predictions differ from current state)
        const needsUpdate = Object.keys(loaded).some(key => prev[key] !== loaded[key]) ||
                           Object.keys(loaded).length !== Object.keys(prev).length;
        return needsUpdate ? loaded : prev;
      });
      
      // Always call onUpdate to sync with parent
      syncParentSelections(loaded);
      
      if (lastInitializedRoundCode !== roundCode) {
        setLastInitializedRoundCode(roundCode);
      }
      initializedWithEmptyPropsRef.current = false;
    }
  }, [bracketSeed, savedPredictions, roundCode, lastInitializedRoundCode, syncParentSelections]);

  // Initialize from props predictions if no saved predictions available
  useEffect(() => {
    if (bracketSeed.length === 0) return;
    if (lastInitializedRoundCode === roundCode) return; // Already initialized
    if (savedPredictions.length > 0) return; // Saved predictions will be handled by the effect above

    const needsInitialization = lastInitializedRoundCode !== roundCode;
    const propsBecamePopulated = lastInitializedRoundCode === roundCode && 
                                  initializedWithEmptyPropsRef.current &&
                                  Object.keys(predictions).length > 0;

    if (needsInitialization || propsBecamePopulated) {
      const initial: { [externalFixtureId: string]: string } = {};
      
      bracketSeed.forEach((fixture) => {
        const fixtureIdKey = fixture.externalFixtureId.toString();
        if (predictions[fixtureIdKey]) {
          initial[fixtureIdKey] = predictions[fixtureIdKey];
        }
      });
      
      initializedWithEmptyPropsRef.current = Object.keys(initial).length === 0;
      setSelectedWinners(initial);
      
      if (Object.keys(initial).length > 0) {
        syncParentSelections(initial);
        initializedWithEmptyPropsRef.current = false;
      }
      
      if (needsInitialization) {
        setLastInitializedRoundCode(roundCode);
      }
    }
  }, [bracketSeed, predictions, roundCode, lastInitializedRoundCode, savedPredictions.length, syncParentSelections]);

  // Sync with props predictions if they change externally (but don't override user selections)
  // Only sync if we've already initialized for this roundCode
  useEffect(() => {
    if (bracketSeed.length > 0 && lastInitializedRoundCode === roundCode) {
      // Update if props have new predictions that aren't in our local state
      // This handles the case where props are populated after initial render
      setSelectedWinners(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        bracketSeed.forEach((fixture) => {
          const fixtureIdKey = fixture.externalFixtureId.toString();
          // If props have a prediction for this fixture and we don't have one yet, use the props value
          if (predictions[fixtureIdKey] && !prev[fixtureIdKey]) {
            updated[fixtureIdKey] = predictions[fixtureIdKey];
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }
  }, [predictions, bracketSeed, roundCode, lastInitializedRoundCode]);

  const handleTeamSelect = (externalFixtureId: number, teamName: string) => {
    const fixtureIdKey = externalFixtureId.toString();
    const newSelections = { ...selectedWinners, [fixtureIdKey]: teamName };
    setSelectedWinners(newSelections);
    const nextSelections = { ...savedSelections, ...predictions, ...newSelections };
    syncParentSelections(nextSelections);
  };

  // Filter out matches where teams aren't determined yet (e.g., one team is null/TBD)
  const validMatches = bracketSeed.filter(fixture => 
    fixture.homeTeam.id && fixture.awayTeam.id
  );
  
  const completedMatches = validMatches.filter(fixture => {
    const key = fixture.externalFixtureId.toString();
    return !!mergedSelections[key];
  }).length;
  const totalMatches = validMatches.length;

  const isStageComplete = completedMatches === totalMatches && totalMatches > 0;

  if (seedLoading) {
    return (
      <div className="p-6 text-center">
        <Spinner size={24} className="text-[#4AA96C]" />
      </div>
    );
  }

  if (seedError || (bracketSeed.length === 0 && !seedLoading)) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading matches. Please try again.</p>
      </div>
    );
  }
  
  if (!seedLoading && validMatches.length === 0 && bracketSeed.length > 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No matches available yet. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-medium text-[#070A11]">
            {stageLabels[stage]}
          </h2>
          <p className="text-[#656E81] text-sm">
            {stageInstructions[stage]}
          </p>
        </div>
        <div className="flex space-x-3">
          {isStageComplete && (
            <button
              onClick={onNextStage}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold text-sm"
            >
              {isSubmitting ? (
                <Spinner size={24} className="text-[#4AA96C]" />
              ) : (
                'Next Stage'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-[#FFEDD9] border border-[#FE5E41] rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-[#FE5E41] mr-2" />
          <p className="text-[#FE5E41] text-sm">
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
        {validMatches.length > 0 && validMatches.map((fixture, index) => {
          const fixtureIdKey = fixture.externalFixtureId.toString();
          const selectedWinner = mergedSelections[fixtureIdKey];
          
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
                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      {selectedWinner === fixture.homeTeam.name && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
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
                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      {selectedWinner === fixture.awayTeam.name && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Winner */}
              {selectedWinner && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Gold Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
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

