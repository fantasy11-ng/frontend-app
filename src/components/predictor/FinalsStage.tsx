'use client';

import { useState } from 'react';
import { Lightbulb, Trophy } from 'lucide-react';

interface FinalsPredictions {
  thirdPlace: string; // winner team name
  champion: string; // winner team name
}

interface FinalsStageProps {
  predictions: FinalsPredictions;
  onUpdate: (predictions: FinalsPredictions) => void;
  onSave: () => void;
}

// Team flags
const teamFlags: { [key: string]: string } = {
  'Nigeria': '🇳🇬', 'Burundi': '🇧🇮', 'Senegal': '🇸🇳', 'Algeria': '🇩🇿',
  'Libya': '🇱🇾', 'Togo': '🇹🇬', 'Kenya': '🇰🇪', 'Botswana': '🇧🇼',
  'Sudan': '🇸🇩', 'Zimbabwe': '🇿🇼', 'Ethiopia': '🇪🇹', 'Somalia': '🇸🇴',
  'Gabon': '🇬🇦', 'Liberia': '🇱🇷', 'Burkina Faso': '🇧🇫', 'Seychelles': '🇸🇨',
  'Malawi': '🇲🇼', 'Angola': '🇦🇴', 'Eswatini': '🇸🇿', 'Zambia': '🇿🇲',
  'Eritrea': '🇪🇷', 'Chad': '🇹🇩', 'Gambia': '🇬🇲', 'Niger': '🇳🇪',
  'Cape Verde': '🇨🇻', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Cameroon': '🇨🇲',
  'Ghana': '🇬🇭', 'Ivory Coast': '🇨🇮', 'Tunisia': '🇹🇳', 'Mali': '🇲🇱'
};

// Final matches based on semi-final results
const finalMatches = {
  thirdPlace: {
    home: 'Libya',
    away: 'Cape Verde'
  },
  final: {
    home: 'Nigeria',
    away: 'Togo'
  }
};

export default function FinalsStage({ predictions, onUpdate, onSave }: FinalsStageProps) {
  const [selectedPredictions, setSelectedPredictions] = useState<FinalsPredictions>(predictions);

  const handleTeamSelect = (match: 'thirdPlace' | 'champion', teamName: string) => {
    const newPredictions = { ...selectedPredictions, [match]: teamName };
    setSelectedPredictions(newPredictions);
    onUpdate(newPredictions);
  };

  const isComplete = selectedPredictions.thirdPlace && selectedPredictions.champion;

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
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Predictions
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
              onClick={() => handleTeamSelect('thirdPlace', finalMatches.thirdPlace.home)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.thirdPlace === finalMatches.thirdPlace.home
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{teamFlags[finalMatches.thirdPlace.home]}</span>
                <span className="font-medium text-gray-900">{finalMatches.thirdPlace.home}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-center text-gray-500 font-medium">vs</div>

            {/* Away Team */}
            <div
              onClick={() => handleTeamSelect('thirdPlace', finalMatches.thirdPlace.away)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.thirdPlace === finalMatches.thirdPlace.away
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{teamFlags[finalMatches.thirdPlace.away]}</span>
                <span className="font-medium text-gray-900">{finalMatches.thirdPlace.away}</span>
              </div>
            </div>
          </div>

          {/* Selected Winner */}
          {selectedPredictions.thirdPlace && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 text-green-600 mr-2" />
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
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
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
              onClick={() => handleTeamSelect('champion', finalMatches.final.home)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.champion === finalMatches.final.home
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{teamFlags[finalMatches.final.home]}</span>
                <span className="font-medium text-gray-900">{finalMatches.final.home}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-center text-gray-500 font-medium">vs</div>

            {/* Away Team */}
            <div
              onClick={() => handleTeamSelect('champion', finalMatches.final.away)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPredictions.champion === finalMatches.final.away
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{teamFlags[finalMatches.final.away]}</span>
                <span className="font-medium text-gray-900">{finalMatches.final.away}</span>
              </div>
            </div>
          </div>

          {/* Selected Winner */}
          {selectedPredictions.champion && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 text-green-600 mr-2" />
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
            <Trophy className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Tournament Prediction Complete!
              </h3>
              <p className="text-green-700">
                You have successfully predicted the entire AFCON 2025 tournament. Click "Save Predictions" to submit your picks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
