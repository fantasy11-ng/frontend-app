'use client';

import { Gift, LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface PrizeCardProps {
  prize: {
    id: string;
    place: number;
    title: string;
    cashPrize: string;
    rewards: string[];
    color: 'gold' | 'silver' | 'bronze' | 'blue' | 'purple' | 'orange';
    icon: LucideIcon;
  };
}

const colorClasses = {
  gold: {
    bg: 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50',
    text: 'text-yellow-900',
    prizeText: 'text-yellow-900',
    icon: 'text-yellow-700'
  },
  silver: {
    bg: 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50',
    text: 'text-gray-900',
    prizeText: 'text-gray-900',
    icon: 'text-gray-700'
  },
  bronze: {
    bg: 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50',
    text: 'text-amber-900',
    prizeText: 'text-amber-900',
    icon: 'text-amber-700'
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50',
    text: 'text-blue-900',
    prizeText: 'text-blue-900',
    icon: 'text-blue-700'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50',
    text: 'text-purple-900',
    prizeText: 'text-purple-900',
    icon: 'text-purple-700'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50',
    text: 'text-orange-900',
    prizeText: 'text-orange-900',
    icon: 'text-orange-700'
  }
};

export default function PrizeCard({ prize }: PrizeCardProps) {
  const colors = colorClasses[prize.color];

  return (
    <div className={`${colors.bg} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden`}>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className={`${colors.icon} opacity-80`}>
          {prize.color === 'gold' ? (
            <Image src="/Gold.png" alt="Gold Trophy" width={417} height={227} className="" />
          ) : prize.color === 'silver' ? (
            <Image src="/Silver.png" alt="Silver Trophy" width={417} height={227}  className="" />
          ) : prize.color === 'bronze' ? (
            <Image src="/Bronze.png" alt="Bronze Trophy" width={417} height={227}  className="" />
          ) : (
            <Gift className="w-16 h-16" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
        {prize.title}
      </h3>

      {/* Cash Prize */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Cash Prize</p>
        <p className={`text-3xl font-bold ${colors.prizeText}`}>
          {prize.cashPrize}
        </p>
      </div>

      {/* Rewards */}
      <ul className="space-y-2">
        {prize.rewards.map((reward, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <span className="mr-2">•</span>
            <span>{reward}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
