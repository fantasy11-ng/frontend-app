'use client';

import React from 'react';
import Image from 'next/image';

interface EmptyTeamStateProps {
  onCreateTeam: () => void;
}

const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ onCreateTeam }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-8">
            <Image 
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" 
              alt="Trophy" 
              width={200} 
              height={200} 
              className="w-48 h-48 md:w-64 md:h-64 object-contain" 
            />
          </div>

          {/* Welcome Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#070A11] text-center mb-1">
            Welcome to Fantasy11
          </h2>

          {/* Description */}
          <p className="text-center text-[#656E81] mb-8 text-sm">
            Create your team to start competing in AFCON 2025
          </p>

          {/* Football Pitch Graphic */}
          <div className="mb-8 max-w-2xl text-center justify-center flex mx-auto">
            <div className="relative rounded-lg overflow-hidden" style={{ height: '704px', width: '546px' }}>
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265434/Pitch_a8soyt.png"
                alt="Empty football pitch"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
                <p className="text-lg md:text-xl font-semibold mb-2">Your Pitch is empty.</p>
                <p className="text-base md:text-lg">Create a team to get started</p>
              </div>
            </div>
          </div>

          {/* Create Team Button */}
          <div className="flex justify-center">
            <button
              onClick={onCreateTeam}
              className="w-full max-w-[580px] px-8 h-10 bg-[#4AA96C] text-white rounded-full font-semibold text-base"
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyTeamState;

