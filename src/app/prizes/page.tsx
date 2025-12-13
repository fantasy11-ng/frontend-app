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
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
        {/* Main Tabs */}
        <div className="mb-8 w-fit">
          <div className="flex space-x-8 border-gray-200">
            <button
              onClick={() => setActiveTab('prizes')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'prizes'
                  ? 'text-[#070A11] border-b-[3px] border-[#4AA96C]'
                  : 'text-[#656E81]'
              }`}
            >
              Prizes
            </button>
            <button
              onClick={() => setActiveTab('winners')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'winners'
                  ? 'text-[#070A11] border-b-[3px] border-[#4AA96C]'
                  : 'text-[#656E81]'
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