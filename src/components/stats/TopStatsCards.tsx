'use client';

import { Target, Users } from 'lucide-react';
import Image from 'next/image';
import { TopStat } from '@/types/stats';

interface TopStatsCardsProps {
  stats: TopStat[];
}

export default function TopStatsCards({ stats }: TopStatsCardsProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'points':
        return <Image src="/Gold.png" alt="Trophy" width={24} height={24} className="w-6 h-6" />;
      case 'goals':
        return <Target className="w-6 h-6 text-red-700" />;
      case 'assists':
        return <Users className="w-6 h-6 text-red-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              {getIcon(stat.icon)}
              <h3 className="text-base font-semibold text-gray-900 ml-2">
                {stat.title}
              </h3>
            </div>
            
            <p className="text-sm text-red-700 font-medium mb-1">
              {stat.country}
            </p>
            
            <p className="text-base font-semibold text-gray-900 mb-4">
              {stat.playerName}
            </p>
            
            <p className="text-4xl font-bold text-red-700">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

