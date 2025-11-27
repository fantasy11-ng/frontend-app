'use client';

import React from 'react';
import Image from 'next/image';

interface FootballPitchProps {
  players?: Array<{
    id: string;
    name: string;
    position: string;
    x: number;
    y: number;
  }>;
}

const FootballPitch: React.FC<FootballPitchProps> = ({ players = [] }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ aspectRatio: '16/9', height: '704px', width: '546px' }}>
      <Image
        src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265434/Pitch_a8soyt.png"
        alt="Football pitch"
        fill
        className="object-cover"
      />
      
      {/* Players overlay */}
      {players.length > 0 ? (
        <div className="absolute inset-0">
          {players.map((player) => (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${player.x}%`,
                top: `${player.y}%`,
              }}
            >
              <div className="w-10 h-10 bg-white rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-800 shadow-lg">
                {player.position}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
          <p className="text-lg md:text-xl font-semibold mb-2">No players selected.</p>
          <p className="text-base md:text-lg">Add players to see them on the pitch</p>
        </div>
      )}
    </div>
  );
};

export default FootballPitch;

