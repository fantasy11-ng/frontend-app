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

  if (winners.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg py-10">
        Not Available Yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {winners.map((winner) => (
        <div
          key={winner.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4">
            {/* Left: Rank Indicator and Winner Info */}
            <div className="flex items-center space-x-4">
              {/* Rank Badge */}
              <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                {winner.rank === 1 ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white text-xl font-bold">{winner.rank}</span>
                )}
              </div>

              {/* Winner Details */}
              <div>
                <h3 className="text-sm text-[#070A11] mb-1">
                  {winner.name}
                </h3>
                {type === 'globalLeague' ? (
                  <p className="text-xs text-[#656E81]">
                    {winner.team} – {winner.points} points
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {winner.accuracy}% accuracy – {winner.points} points
                  </p>
                )}
              </div>
            </div>

            {/* Right: Prize Badge */}
            <div className="bg-[#F5EBEB] text-[#800000] px-4 py-2 rounded-full text-sm font-medium">
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
