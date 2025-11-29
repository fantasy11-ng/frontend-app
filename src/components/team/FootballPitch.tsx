'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SquadPlayer, PlayerRole } from '@/types/team';
import { MoreVertical } from 'lucide-react';

interface FootballPitchProps {
  starting11?: SquadPlayer[];
  bench?: SquadPlayer[];
  onPlayerClick?: (player: SquadPlayer) => void;
  onPlayerRoleMenu?: (player: SquadPlayer, event: React.MouseEvent) => void;
}

// Y coordinates: 0% = top (attacking end), 100% = bottom (goalkeeper end)

const FootballPitch: React.FC<FootballPitchProps> = ({
  starting11 = [],
  bench = [],
  onPlayerClick,
  onPlayerRoleMenu,
}) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  const getFormationPositions = () => {
    const result: Array<{ player: SquadPlayer; x: number; y: number }> = [];

    // Group players by position
    const playersByPosition = {
      GK: starting11.filter((p) => p.position === 'GK'),
      DEF: starting11.filter((p) => p.position === 'DEF'),
      MID: starting11.filter((p) => p.position === 'MID'),
      FWD: starting11.filter((p) => p.position === 'FWD'),
    };

    // Helper function to evenly distribute players horizontally
    const distributePlayers = (count: number, minX: number = 10, maxX: number = 90): number[] => {
      if (count === 0) return [];
      if (count === 1) return [50]; // Center if only one player
      
      // Ensure minimum spacing between players (accounting for player element width ~8%)
      const minSpacing = 10; // Minimum 10% between player centers
      const availableWidth = maxX - minX;
      const requiredWidth = (count - 1) * minSpacing;
      
      // If we need more space, adjust margins
      let adjustedMinX = minX;
      let adjustedMaxX = maxX;
      if (requiredWidth > availableWidth) {
        const extraNeeded = requiredWidth - availableWidth;
        adjustedMinX = Math.max(5, minX - extraNeeded / 2);
        adjustedMaxX = Math.min(95, maxX + extraNeeded / 2);
      }
      
      const spacing = (adjustedMaxX - adjustedMinX) / (count - 1);
      return Array.from({ length: count }, (_, i) => adjustedMinX + spacing * i);
    };

    // Assign positions with even spacing
    // Goalkeeper - always centered at bottom (y: 5% from bottom)
    playersByPosition.GK.forEach((player) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? 50,
        y: player.formationPosition?.y ?? 5,
      });
    });

    // Defenders - evenly distributed (y: 20% from top)
    const defXPositions = distributePlayers(playersByPosition.DEF.length, 12, 88);
    playersByPosition.DEF.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? defXPositions[index],
        y: player.formationPosition?.y ?? 20,
      });
    });

    // Midfielders - evenly distributed (y: 45% from top)
    const midXPositions = distributePlayers(playersByPosition.MID.length, 12, 88);
    playersByPosition.MID.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? midXPositions[index],
        y: player.formationPosition?.y ?? 45,
      });
    });

    // Forwards - evenly distributed (y: 70% from top)
    const fwdXPositions = distributePlayers(playersByPosition.FWD.length, 15, 85);
    playersByPosition.FWD.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? fwdXPositions[index],
        y: player.formationPosition?.y ?? 70,
      });
    });

    return result;
  };

  const getRoleIcon = (role?: PlayerRole) => {
    if (role === 'captain') return '©';
    if (role === 'vice-captain') return 'VC';
    return null;
  };

  const getPlayerDisplayName = (player: SquadPlayer) => {
    const nameParts = player.name.split(' ');
    return nameParts.length > 1 ? nameParts[nameParts.length - 1] : player.name;
  };

  const playerPositions = getFormationPositions();

  return (
    <div className="w-full space-y-6">
      {/* Pitch */}
      <div className="w-full rounded-lg overflow-hidden relative bg-green-600" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
        <Image
          src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265434/Pitch_a8soyt.png"
          alt="Football pitch"
          fill
          className="object-cover"
        />
        
        {/* Players overlay */}
        {playerPositions.length > 0 ? (
          <div className="absolute inset-0">
            {playerPositions.map(({ player, x, y }, index) => (
              <div
                key={player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 10 + index, // Ensure proper layering
                }}
                onClick={() => onPlayerClick?.(player)}
                onMouseEnter={() => setHoveredPlayer(player.id)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden">
                    {/* Flag background */}
                    {player.countryFlag && (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        {player.countryFlag}
                      </div>
                    )}
                    {/* Player icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">👤</span>
                      </div>
                    </div>
                  </div>
                  {/* Player name and position */}
                  <div className="mt-2 text-center">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      <div className="font-semibold">{getPlayerDisplayName(player)}</div>
                      <div className="text-[10px]">{player.position}</div>
                    </div>
                    {player.role && (
                      <div className="mt-1 text-xs font-bold text-yellow-500">
                        {getRoleIcon(player.role)}
                      </div>
                    )}
                  </div>
                  {/* Role menu button */}
                  {hoveredPlayer === player.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayerRoleMenu?.(player, e);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
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

      {/* Bench */}
      {bench.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Bench ({bench.length})</h4>
          <div className="flex flex-wrap gap-3">
            {bench.map((player) => (
              <div
                key={player.id}
                onClick={() => onPlayerClick?.(player)}
                className="relative cursor-pointer group"
              >
                <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-600 flex items-center justify-center shadow-md relative overflow-hidden">
                  {player.countryFlag && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      {player.countryFlag}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-gray-600">👤</span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-center">
                  <div className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                    <div className="font-semibold truncate max-w-[60px]">{getPlayerDisplayName(player)}</div>
                    <div className="text-[8px]">{player.position}</div>
                  </div>
                </div>
                {hoveredPlayer === player.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayerRoleMenu?.(player, e);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                  >
                    <MoreVertical className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballPitch;

