'use client';

import { Crown } from 'lucide-react';

interface Winner {
  id: string;
  rank: number;
  name: string;
  team?: string;
  points?: number;
  accuracy?: number;
  prize: string;
}

interface WinnersListProps {
  winners: Winner[];
  type: 'globalLeague' | 'predictorGame';
}

export default function WinnersList({ winners, type }: WinnersListProps) {
  return (
    <div className="space-y-4">
      {winners.map((winner) => (
        <div
          key={winner.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            {/* Left: Rank Indicator and Winner Info */}
            <div className="flex items-center space-x-4">
              {/* Rank Badge */}
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                {winner.rank === 1 ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white text-xl font-bold">{winner.rank}</span>
                )}
              </div>

              {/* Winner Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {winner.name}
                </h3>
                {type === 'globalLeague' ? (
                  <p className="text-sm text-gray-500">
                    {winner.team} – {winner.points} points
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {winner.accuracy}% accuracy – {winner.points} points
                  </p>
                )}
              </div>
            </div>

            {/* Right: Prize Badge */}
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
              {winner.rank === 1 && '1st Place'}
              {winner.rank === 2 && '2nd Place'}
              {winner.rank === 3 && '3rd Place'}
              {winner.rank === 4 && '4th Place'}
              {winner.rank === 5 && '5th Place'}
              {' – '}
              {winner.prize}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
