'use client';

import { Gift } from 'lucide-react';
import PrizeCard from './PrizeCard';
import PastWinners from './PastWinners';

export default function PrizesContent() {
  const globalLeaguePrizes = [
    {
      id: '1',
      place: 1,
      title: 'Second Place Champion',
      cashPrize: '₦750,000',
      rewards: [
        'AFCON 2025 Premium Tickets',
        'Signed Football',
        'Medal'
      ],
      color: 'silver' as const,
      icon: Gift
    },
    {
      id: '2',
      place: 2,
      title: 'Ultimate Fantasy11 Champion',
      cashPrize: '₦1,000,000',
      rewards: [
        'AFCON 2025 VIP Experience',
        'Signed Jersey Collection',
        'Trophy & Medal'
      ],
      color: 'gold' as const,
      icon: Gift
    },
    {
      id: '3',
      place: 3,
      title: 'Third Place Champion',
      cashPrize: '₦500,000',
      rewards: [
        'AFCON 2025 Standard Tickets',
        'Team Merchandise',
        'Medal'
      ],
      color: 'bronze' as const,
      icon: Gift
    }
  ];

  const predictorPrizes = [
    {
      id: 'p1',
      place: 1,
      title: 'Perfect Predictor',
      cashPrize: 'N1,000,000',
      rewards: [
        'AFCON 2025 VIP Experience',
        'Signed Jersey Collection',
        'Trophy & Medal'
      ],
      color: 'blue' as const,
      icon: Gift
    },
    {
      id: 'p2',
      place: 2,
      title: 'Second Place Champion',
      cashPrize: 'N1,000,000',
      rewards: [
        'AFCON 2025 Premium Tickets',
        'Signed Football',
        'Medal'
      ],
      color: 'orange' as const,
      icon: Gift
    },
    {
      id: 'p3',
      place: 3,
      title: 'Third Place Champion',
      cashPrize: 'N1,000,000',
      rewards: [
        'AFCON 2025 Standard Tickets',
        'Team Merchandise',
        'Medal'
      ],
      color: 'blue' as const,
      icon: Gift
    },
    {
      id: 'p4',
      place: 3,
      title: 'Third Place Champion',
      cashPrize: 'N1,000,000',
      rewards: [
        'AFCON 2025 Standard Tickets',
        'Team Merchandise',
        'Medal'
      ],
      color: 'purple' as const,
      icon: Gift
    },
    {
      id: 'p5',
      place: 3,
      title: 'Third Place Champion',
      cashPrize: 'N1,000,000',
      rewards: [
        'AFCON 2025 Standard Tickets',
        'Team Merchandise',
        'Medal'
      ],
      color: 'orange' as const,
      icon: Gift
    }
  ];

  return (
    <div className="space-y-12">
      {/* Fantasy11 Global League Prizes */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Fantasy11 Global League Prizes
        </h2>
        <p className="text-gray-600 mb-8">
          Compete against managers worldwide for these incredible rewards.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {globalLeaguePrizes.map((prize) => (
            <PrizeCard key={prize.id} prize={prize} />
          ))}
        </div>
      </section>

      {/* AFCON 2025 Predictor Prizes */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AFCON 2025 Predictor Prizes
        </h2>
        <p className="text-gray-600 mb-8">
          Predict tournament outcomes for a chance to win the N25,000,000 grand prize
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predictorPrizes.map((prize) => (
            <PrizeCard key={prize.id} prize={prize} />
          ))}
        </div>
      </section>

      {/* Past Winners */}
      <PastWinners />
    </div>
  );
}
