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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">League</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center">
              <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Championship Trophy" width={382} height={208} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Join the Championship!
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Enter your team into Fantasy11&apos;s Global League and compete with millions of managers for the ultimate AFCON 2025 prize.
          </p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Prize Pool:</span>
                <span className="font-semibold text-gray-900">{details.totalPrizePool}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Managers:</span>
                <span className="font-semibold text-green-600">{details.activeManagers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Winner Prize:</span>
                <span className="font-semibold text-gray-900">{details.winnerPrize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-semibold text-green-600">{details.entryFee}</span>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={onEnterChampionship}
              className="px-8 py-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
            >
              Enter Championship
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Fair Play Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Real-time Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Live Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipPage;

