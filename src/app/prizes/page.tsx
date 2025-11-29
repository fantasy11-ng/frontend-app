'use client';

import { useState } from 'react';
import PrizesContent from '@/components/prizes/PrizesContent';
import WinnersContent from '@/components/prizes/WinnersContent';

type TabType = 'prizes' | 'winners';
type WinnersTabType = 'globalLeague' | 'predictorGame';

export default function PrizesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('prizes');
  const [activeWinnersTab, setActiveWinnersTab] = useState<WinnersTabType>('globalLeague');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Main Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('prizes')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'prizes'
                  ? 'text-gray-900 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Prizes
            </button>
            <button
              onClick={() => setActiveTab('winners')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'winners'
                  ? 'text-gray-900 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Winners
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'prizes' && <PrizesContent />}
        {activeTab === 'winners' && (
          <WinnersContent 
            activeTab={activeWinnersTab}
            onTabChange={setActiveWinnersTab}
          />
        )}
      </div>
    </div>
  );
}
