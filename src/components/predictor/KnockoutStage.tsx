'use client';

import { useState } from 'react';
import { Lightbulb, Trophy } from 'lucide-react';

interface KnockoutStageProps {
  stage: 'round16' | 'quarter' | 'semi';
  predictions: { [matchId: string]: string }; // winner team name
  onUpdate: (predictions: { [matchId: string]: string }) => void;
  onSave: () => void;
  onNextStage: () => void;
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

// Define matches for each stage
const stageMatches = {
  round16: [
    { id: 'r16-1', home: 'Nigeria', away: 'Burundi' },
    { id: 'r16-2', home: 'Libya', away: 'Togo' },
    { id: 'r16-3', home: 'Sudan', away: 'Zimbabwe' },
    { id: 'r16-4', home: 'Gabon', away: 'Liberia' },
    { id: 'r16-5', home: 'Malawi', away: 'Angola' },
    { id: 'r16-6', home: 'Eritrea', away: 'Chad' },
    { id: 'r16-7', home: 'Gambia', away: 'Niger' },
    { id: 'r16-8', home: 'Cape Verde', away: 'Egypt' }
  ],
  quarter: [
    { id: 'qf-1', home: 'Nigeria', away: 'Cape Verde' },
    { id: 'qf-2', home: 'Libya', away: 'Togo' },
    { id: 'qf-3', home: 'Sudan', away: 'Zimbabwe' },
    { id: 'qf-4', home: 'Gabon', away: 'Liberia' }
  ],
  semi: [
    { id: 'sf-1', home: 'Nigeria', away: 'Cape Verde' },
    { id: 'sf-2', home: 'Libya', away: 'Togo' }
  ]
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

export default function KnockoutStage({ stage, predictions, onUpdate, onSave, onNextStage }: KnockoutStageProps) {
  const [selectedWinners, setSelectedWinners] = useState<{ [matchId: string]: string }>(predictions);

  const handleTeamSelect = (matchId: string, teamName: string) => {
    const newSelections = { ...selectedWinners, [matchId]: teamName };
    setSelectedWinners(newSelections);
    onUpdate(newSelections);
  };

  const matches = stageMatches[stage];
  const completedMatches = Object.keys(selectedWinners).filter(matchId => selectedWinners[matchId]).length;
  const totalMatches = matches.length;

  const isStageComplete = completedMatches === totalMatches;

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
          <button
            onClick={onSave}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Predictions
          </button>
          {isStageComplete && stage !== 'semi' && (
            <button
              onClick={onNextStage}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next Stage &gt;
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
        {matches.map((match) => {
          const selectedWinner = selectedWinners[match.id];
          
          return (
            <div key={match.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Match {matches.indexOf(match) + 1}
                </h3>
                {selectedWinner && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>

              <div className="space-y-4">
                {/* Home Team */}
                <div
                  onClick={() => handleTeamSelect(match.id, match.home)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWinner === match.home
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{teamFlags[match.home]}</span>
                    <span className="font-medium text-gray-900">{match.home}</span>
                  </div>
                </div>

                {/* VS */}
                <div className="text-center text-gray-500 font-medium">vs</div>

                {/* Away Team */}
                <div
                  onClick={() => handleTeamSelect(match.id, match.away)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWinner === match.away
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{teamFlags[match.away]}</span>
                    <span className="font-medium text-gray-900">{match.away}</span>
                  </div>
                </div>
              </div>

              {/* Selected Winner */}
              {selectedWinner && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-green-600 mr-2" />
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
