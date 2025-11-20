'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useBracketSeed, useThirdPlaceMatchSeed } from '@/lib/api';
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

export default function FinalsStage({ predictions, onUpdate, onSave }: FinalsStageProps) {
  const { data: thirdPlaceSeed = [], isLoading: thirdPlaceLoading, error: thirdPlaceError } = useThirdPlaceMatchSeed(true);
  const { data: finalSeed = [], isLoading: finalLoading, error: finalError } = useBracketSeed('final', true);
  const [selectedPredictions, setSelectedPredictions] = useState<FinalsPredictions>(predictions);

  // Find third place and final fixtures from their respective seeds
  const thirdPlaceFixture = thirdPlaceSeed.length > 0 && thirdPlaceSeed.find(f => 
    f.homeTeam.name === predictions.thirdPlace || 
    f.awayTeam.name === predictions.thirdPlace
  ) || (thirdPlaceSeed.length > 0 ? thirdPlaceSeed[0] : null);
  
  const finalFixture = finalSeed.length > 0 && finalSeed.find(f => 
    f.homeTeam.name === predictions.champion || 
    f.awayTeam.name === predictions.champion
  ) || (finalSeed.length > 0 ? finalSeed[0] : null);

  // Update predictions when bracket seed loads
  useEffect(() => {
    if (thirdPlaceSeed.length > 0 && finalSeed.length > 0 && (!selectedPredictions.thirdPlace || !selectedPredictions.champion)) {
      // Don't auto-select, just ensure we have the fixtures available
    }
  }, [thirdPlaceSeed, finalSeed, thirdPlaceFixture, finalFixture, selectedPredictions.thirdPlace, selectedPredictions.champion]);

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

  if (seedError || !thirdPlaceFixture || !finalFixture) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading finals matches. Please try again.</p>
      </div>
    );
  }

  // Use bracket seed fixtures
  const thirdPlaceMatch = thirdPlaceFixture;
  const finalMatch = finalFixture;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3rd Place Playoff */}
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
                <Image src="/Bronze.png" alt="Bronze Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
                <span className="text-green-800 font-medium">
                  Winner: {selectedPredictions.thirdPlace}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* AFCON 2025 Final */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Image src="/Gold.png" alt="Gold Trophy" width={32} height={32} className="w-8 h-8 mr-3" />
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
                <Image src="/Gold.png" alt="Gold Trophy" width={16} height={16} className="w-4 h-4 mr-2" />
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
            <Image src="/Gold.png" alt="Gold Trophy" width={24} height={24} className="w-6 h-6 mr-3" />
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
