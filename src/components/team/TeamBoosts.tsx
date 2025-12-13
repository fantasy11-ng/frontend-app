'use client';

import React from 'react';

export interface TeamBoost {
  id: string;
  name: string;
  description: string;
  used: boolean;
}

interface TeamBoostsProps {
  boosts: TeamBoost[];
  onUseBoost: (boostId: string) => void;
  isLoading?: boolean;
}

const TeamBoosts: React.FC<TeamBoostsProps> = ({ boosts, onUseBoost, isLoading = false }) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Team Boosts</h3>
        <p className="text-sm text-gray-600">Use one boost per gameweek</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4AA96C]" />
        </div>
      ) : boosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No boosts available</div>
      ) : (
        boosts.map((boost) => (
          <div
            key={boost.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{boost.name}</h4>
              <p className="text-sm text-gray-600">{boost.description}</p>
            </div>
            <button
              onClick={() => onUseBoost(boost.id)}
              disabled={boost.used}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                boost.used
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {boost.used ? 'Used' : 'Use'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamBoosts;

