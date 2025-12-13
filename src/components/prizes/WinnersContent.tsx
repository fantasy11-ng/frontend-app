'use client';

import WinnersList from './WinnersList';

interface WinnersContentProps {
  activeTab: 'globalLeague' | 'predictorGame';
  onTabChange: (tab: 'globalLeague' | 'predictorGame') => void;
}

interface Winner {
  id: string;
  rank: number;
  name: string;
  team?: string;
  points?: number;
  accuracy?: number;
  prize: string;
}

export default function WinnersContent({ activeTab, onTabChange }: WinnersContentProps) {
  // Mock data for Global League Top 5
  const globalLeagueWinners: Winner[] = [
  ];

  // Mock data for Predictor Game Top 5
  const predictorGameWinners: Winner[] = [

  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div className="mb-8">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => onTabChange('globalLeague')}
            className={`pb-4 px-1 text-sm font-medium transition-colors ${
              activeTab === 'globalLeague'
                ? 'text-gray-900 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Global League Top 5
          </button>
          <button
            onClick={() => onTabChange('predictorGame')}
            className={`pb-4 px-1 text-sm font-medium transition-colors ${
              activeTab === 'predictorGame'
                ? 'text-gray-900 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Predictor Game Top 5
          </button>
        </div>
      </div>

      {/* Winners List */}
      {activeTab === 'globalLeague' && (
        <WinnersList winners={globalLeagueWinners} type="globalLeague" />
      )}
      {activeTab === 'predictorGame' && (
        <WinnersList winners={predictorGameWinners} type="predictorGame" />
      )}
    </div>
  );
}
