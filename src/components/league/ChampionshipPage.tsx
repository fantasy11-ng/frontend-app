'use client';

import React from 'react';
import Image from 'next/image';
import { ChampionshipDetails } from '@/types/league';

interface ChampionshipPageProps {
  details: ChampionshipDetails;
  onEnterChampionship: () => void;
}

const ChampionshipPage: React.FC<ChampionshipPageProps> = ({
  details,
  onEnterChampionship,
}) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">League</h1>
        </div>

        {/* Main Content */}
        <div className="rounded-lg p-8 md:p-12">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center">
              <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Championship Trophy" width={382} height={208} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-[40px] font-bold text-[#070A11] text-center mb-2">
            Join the Championship!
          </h2>

          {/* Description */}
          <p className="text-center text-sm text-[#656E81] mb-8 max-w-[432px] mx-auto">
            Enter your team into Fantasy11&apos;s Global League and compete with millions of managers for the ultimate AFCON 2025 prize.
          </p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-2 max-w-[580px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[#070A11]">Total Prize Pool:</span>
                <span className="text-[#070A11]">{details.totalPrizePool}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#070A11]">Active Managers:</span>
                <span className="text-[#070A11]">{details.activeManagers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#070A11]">Winner Prize:</span>
                <span className="text-[#070A11]">{details.winnerPrize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#070A11]">Entry Fee:</span>
                <span className="text-[#4AA96C]">{details.entryFee}</span>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={onEnterChampionship}
              className="w-full max-w-[540px] h-10 mx-auto py-1 bg-[#4AA96C] text-white rounded-full font-semibold text-base hover:bg-[#4AA96C] transition-colors"
            >
              Enter Championship
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-1">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1765272686/Calendar_2_k5ktql.png" alt="Fair Play Guaranteed" width={20} height={20} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm text-[#070A11]">Fair Play Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
              <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1765272686/Calendar_2_k5ktql.png" alt="Fair Play Guaranteed" width={20} height={20} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm text-[#070A11]">Real-time Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
              <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1765272686/Calendar_2_k5ktql.png" alt="Fair Play Guaranteed" width={20} height={20} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm text-[#070A11]">Live Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipPage;

