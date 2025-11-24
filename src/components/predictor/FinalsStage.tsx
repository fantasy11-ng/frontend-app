'use client';

import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useBracketSeed, useThirdPlaceMatchSeed, useBracketPredictions, useThirdPlaceMatchPrediction } from '@/lib/api';
import type { BracketPrediction, BracketSeedFixture } from '@/types/predictorStage';
import Image from 'next/image';

interface FinalsPredictions {
  thirdPlace: string; // winner team name
  champion: string; // winner team name
}

interface FinalsStageProps {
  predictions: FinalsPredictions;
  onUpdate: (predictions: FinalsPredictions) => void;
  onSave: () => void;
}

const determineWinnerName = (fixture: BracketSeedFixture | undefined, savedPred: BracketPrediction) => {
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

export default function FinalsStage({ predictions, onUpdate, onSave }: FinalsStageProps) {
  const { data: thirdPlaceSeed = [], isLoading: thirdPlaceLoading, error: thirdPlaceError } = useThirdPlaceMatchSeed(true);
  const { data: finalSeed = [], isLoading: finalLoading, error: finalError } = useBracketSeed('final', true);
  const { data: thirdPlaceSavedPredictions = [] } = useThirdPlaceMatchPrediction(true);
  const { data: finalSavedPredictions = [] } = useBracketPredictions('final', true);
  const [selectedPredictions, setSelectedPredictions] = useState<FinalsPredictions>(predictions);
  const hasInitializedRef = useRef(false);

  // Find third place and final fixtures from their respective seeds
  // Filter valid matches (where both teams are determined)
  const validThirdPlaceMatches = thirdPlaceSeed.filter(fixture => 
    fixture.homeTeam && fixture.homeTeam.id && fixture.awayTeam && fixture.awayTeam.id
  );
  const validFinalMatches = finalSeed.filter(fixture => 
    fixture.homeTeam && fixture.homeTeam.id && fixture.awayTeam && fixture.awayTeam.id
  );
  
  // Get third place fixture - prefer one matching saved prediction, otherwise use first available
  const thirdPlaceFixture = validThirdPlaceMatches.length > 0 
    ? (validThirdPlaceMatches.find(f => 
        predictions.thirdPlace && (
          f.homeTeam.name === predictions.thirdPlace || 
          f.awayTeam.name === predictions.thirdPlace
        )
      ) || validThirdPlaceMatches[0])
    : null;
  
  // Get final fixture - prefer one matching saved prediction, otherwise use first available
  const finalFixture = validFinalMatches.length > 0 
    ? (validFinalMatches.find(f => 
        predictions.champion && (
          f.homeTeam.name === predictions.champion || 
          f.awayTeam.name === predictions.champion
        )
      ) || validFinalMatches[0])
    : null;

  // Load saved predictions from API whenever they're available
  useEffect(() => {
    // Start with current state to preserve existing selections
    const loaded: FinalsPredictions = { 
      thirdPlace: selectedPredictions.thirdPlace || '', 
      champion: selectedPredictions.champion || '' 
    };
    let hasUpdates = false;

    // Filter valid matches inline to avoid dependency issues
    const validThirdPlace = thirdPlaceSeed.filter(fixture => 
      fixture.homeTeam && fixture.homeTeam.id && fixture.awayTeam && fixture.awayTeam.id
    );
    const validFinal = finalSeed.filter(fixture => 
      fixture.homeTeam && fixture.homeTeam.id && fixture.awayTeam && fixture.awayTeam.id
    );

    // Load third-place match prediction
    // Try to load from saved predictions if we have both seed and prediction data
    if (validThirdPlace.length > 0 && thirdPlaceSavedPredictions.length > 0) {
      const thirdPlaceFixture = validThirdPlace[0];
      const savedPred = thirdPlaceSavedPredictions[0];
      const winnerName = determineWinnerName(thirdPlaceFixture ?? undefined, savedPred);
      if (winnerName && loaded.thirdPlace !== winnerName) {
        loaded.thirdPlace = winnerName;
        hasUpdates = true;
      }
    }

    // Load final match prediction
    if (validFinal.length > 0 && finalSavedPredictions.length > 0) {
      const finalFixture = validFinal[0];
      const savedPred = finalSavedPredictions[0];
      const winnerName = determineWinnerName(finalFixture ?? undefined, savedPred);
      if (winnerName && loaded.champion !== winnerName) {
        loaded.champion = winnerName;
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      setSelectedPredictions(loaded);
      onUpdate(loaded);
      hasInitializedRef.current = true;
    } else if (!hasInitializedRef.current) {
      // Only initialize from props if we haven't initialized yet and no saved predictions
      if (predictions.thirdPlace || predictions.champion) {
        setSelectedPredictions(predictions);
        hasInitializedRef.current = true;
      } else if (thirdPlaceSavedPredictions.length > 0 || finalSavedPredictions.length > 0) {
        // If we have saved predictions but can't load them yet (no seed data), mark as initialized
        hasInitializedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    thirdPlaceSeed.length, 
    finalSeed.length, 
    thirdPlaceSavedPredictions.length, 
    finalSavedPredictions.length
  ]);

  // Sync selectedPredictions with predictions prop when it changes (after initialization)
  useEffect(() => {
    if (hasInitializedRef.current) {
      // Only update if there are actual differences to prevent unnecessary re-renders
      if (predictions.thirdPlace !== selectedPredictions.thirdPlace || 
          predictions.champion !== selectedPredictions.champion) {
        setSelectedPredictions(predictions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictions.thirdPlace, predictions.champion]);

  const seedLoading = thirdPlaceLoading || finalLoading;
  const seedError = thirdPlaceError || finalError;

  if (seedLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-500" />
        <p className="text-gray-500">Loading finals matches...</p>
      </div>
    );
  }

  // Show error only if there's an actual error, not just missing fixtures
  if (seedError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading finals matches. Please try again.</p>
        {seedError && <p className="text-sm text-gray-500 mt-2">{String(seedError)}</p>}
      </div>
    );
  }

  // Show message if final match isn't available yet (but no error)
  if (!finalFixture && !seedLoading && !finalError) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Final match is not available yet. Please check back later.</p>
      </div>
    );
  }

  // If we don't have final fixture, don't render (already handled above)
  if (!finalFixture) {
    return null;
  }

  // Use bracket seed fixtures
  const finalMatch = finalFixture;
  // Third place match - show if available, but don't require it
  const thirdPlaceMatch = thirdPlaceFixture;

  const handleTeamSelect = (match: 'thirdPlace' | 'champion', teamName: string) => {
    const newPredictions = { ...selectedPredictions, [match]: teamName };
    setSelectedPredictions(newPredictions);
    onUpdate(newPredictions);
  };

  const isThirdPlaceComplete = !!selectedPredictions.thirdPlace;
  const isChampionComplete = !!selectedPredictions.champion;
  const isComplete = isThirdPlaceComplete && isChampionComplete;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Finals Predictions
          </h2>
          <p className="text-gray-600">
            Make your final predictions for the AFCON 2025 tournament!
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Predictions
          </button>
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

      {/* Finals Matches */}
      <div className={`grid gap-8 ${(thirdPlaceMatch || selectedPredictions.thirdPlace || thirdPlaceSeed.length > 0) ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 3rd Place Playoff - Always show on finals page */}
        {thirdPlaceMatch ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              3rd Place playoff
            </h3>
            {selectedPredictions.thirdPlace && (
              <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">Pick the winner of the 3rd place match</p>

          <div className="space-y-4">
            {/* Home Team */}
            <div
              onClick={() => handleTeamSelect('thirdPlace', thirdPlaceMatch.homeTeam.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.thirdPlace === thirdPlaceMatch.homeTeam.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {thirdPlaceMatch.homeTeam.logo ? (
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <Image
                      src={thirdPlaceMatch.homeTeam.logo}
                      alt={thirdPlaceMatch.homeTeam.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {thirdPlaceMatch.homeTeam.short || thirdPlaceMatch.homeTeam.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-gray-900">{thirdPlaceMatch.homeTeam.name}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-center text-gray-500 font-medium">vs</div>

            {/* Away Team */}
            <div
              onClick={() => handleTeamSelect('thirdPlace', thirdPlaceMatch.awayTeam.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.thirdPlace === thirdPlaceMatch.awayTeam.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {thirdPlaceMatch.awayTeam.logo ? (
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <Image
                      src={thirdPlaceMatch.awayTeam.logo}
                      alt={thirdPlaceMatch.awayTeam.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {thirdPlaceMatch.awayTeam.short || thirdPlaceMatch.awayTeam.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-gray-900">{thirdPlaceMatch.awayTeam.name}</span>
              </div>
            </div>
          </div>

          {/* Selected Winner */}
          {selectedPredictions.thirdPlace && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Image src="/images/bronze.png" alt="Bronze Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                <span className="text-green-800 font-medium">
                  Winner: {selectedPredictions.thirdPlace}
                </span>
              </div>
            </div>
          )}
        </div>
        ) : selectedPredictions.thirdPlace ? (
          // Show saved prediction even if match isn't available yet
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                3rd Place playoff
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
            </div>
            <p className="text-gray-600 mb-6">Pick the winner of the 3rd place match</p>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Image src="/images/bronze.png" alt="Bronze Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                <span className="text-green-800 font-medium">
                  Your Prediction: {selectedPredictions.thirdPlace}
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">Match details will be available after semi-finals</p>
          </div>
        ) : thirdPlaceSeed.length > 0 ? (
          // Show placeholder if third place seed exists but no valid match yet
          <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                3rd Place playoff
              </h3>
            </div>
            <p className="text-gray-500">Third place match will be available after semi-finals</p>
          </div>
        ) : (
          // Always show third-place section on finals page
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                3rd Place playoff
              </h3>
              {selectedPredictions.thirdPlace && (
                <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
              )}
            </div>
            <p className="text-gray-600 mb-6">Pick the winner of the 3rd place match</p>
            {selectedPredictions.thirdPlace ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Image src="/images/bronze.png" alt="Bronze Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                  <span className="text-green-800 font-medium">
                    Your Prediction: {selectedPredictions.thirdPlace}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Third place match will be available after semi-finals</p>
            )}
          </div>
        )}

        {/* AFCON 2025 Final */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Image src="/images/gold.png" alt="Gold Trophy" width={32} height={32} className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              AFCON 2025 Final
            </h3>
            {selectedPredictions.champion && (
              <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">Pick the AFCON 2025 Champion!</p>

          <div className="space-y-4">
            {/* Home Team */}
            <div
              onClick={() => handleTeamSelect('champion', finalMatch.homeTeam.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.champion === finalMatch.homeTeam.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {finalMatch.homeTeam.logo ? (
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <Image
                      src={finalMatch.homeTeam.logo}
                      alt={finalMatch.homeTeam.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {finalMatch.homeTeam.short || finalMatch.homeTeam.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-gray-900">{finalMatch.homeTeam.name}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-center text-gray-500 font-medium">vs</div>

            {/* Away Team */}
            <div
              onClick={() => handleTeamSelect('champion', finalMatch.awayTeam.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.champion === finalMatch.awayTeam.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {finalMatch.awayTeam.logo ? (
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <Image
                      src={finalMatch.awayTeam.logo}
                      alt={finalMatch.awayTeam.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {finalMatch.awayTeam.short || finalMatch.awayTeam.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-gray-900">{finalMatch.awayTeam.name}</span>
              </div>
            </div>
          </div>

          {/* Selected Winner */}
          {selectedPredictions.champion && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Image src="/images/gold.png" alt="Gold Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                <span className="text-green-800 font-medium">
                  Winner: {selectedPredictions.champion}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Status */}
      {isComplete && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Image src="/images/gold.png" alt="Gold Trophy" width={24} height={24} className="w-6 h-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Tournament Prediction Complete!
              </h3>
              <p className="text-green-700">
                You have successfully predicted the entire AFCON 2025 tournament. Click &quot;Save Predictions&quot; to submit your picks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
