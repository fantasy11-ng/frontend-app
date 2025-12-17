"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SquadPlayer, PlayerRole } from "@/types/team";
import { MoreVertical } from "lucide-react";

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
      GK: starting11.filter((p) => p.position === "GK"),
      DEF: starting11.filter((p) => p.position === "DEF"),
      MID: starting11.filter((p) => p.position === "MID"),
      ATT: starting11.filter((p) => p.position === "ATT"),
    };

    // Helper function to evenly distribute players horizontally
    const distributePlayers = (
      count: number,
      minX: number = 10,
      maxX: number = 90
    ): number[] => {
      if (count === 0) return [];
      if (count === 1) return [50]; // Center if only one player
      if (count === 2) return [30, 70]; // 30% and 70% from left and right

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
      return Array.from(
        { length: count },
        (_, i) => adjustedMinX + spacing * i
      );
    };

    // Assign positions with even spacing
    // Goalkeeper - always centered at bottom (y: 5% from bottom)
    playersByPosition.GK.forEach((player) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? 50,
        y: player.formationPosition?.y ?? 3,
      });
    });

    // Defenders - evenly distributed (y: 20% from top)
    const defXPositions = distributePlayers(
      playersByPosition.DEF.length,
      12,
      88
    );
    playersByPosition.DEF.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? defXPositions[index],
        y: player.formationPosition?.y ?? 26,
      });
    });

    // Midfielders - evenly distributed (y: 45% from top)
    const midXPositions = distributePlayers(
      playersByPosition.MID.length,
      12,
      88
    );
    playersByPosition.MID.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? midXPositions[index],
        y: player.formationPosition?.y ?? 48,
      });
    });

    // Forwards - evenly distributed (y: 70% from top)
    const fwdXPositions = distributePlayers(
      playersByPosition.ATT.length,
      15,
      85
    );
    playersByPosition.ATT.forEach((player, index) => {
      result.push({
        player,
        x: player.formationPosition?.x ?? fwdXPositions[index],
        y: player.formationPosition?.y ?? 72,
      });
    });

    return result;
  };

  const getRoleIcon = (role?: PlayerRole) => {
    if (role === "captain") return "C";
    if (role === "vice-captain") return "VC";
    return null;
  };

  const renderRoleBadges = (player: SquadPlayer) => {
    const badges: Array<{ label: string; bg: string; text?: string }> = [];

    const roleIcon = getRoleIcon(player.role);
    if (roleIcon)
      badges.push({ label: roleIcon, bg: "bg-[#800000]", text: "text-white" });
    if (player.isFreeKickTaker)
      badges.push({ label: "FK", bg: "bg-[#800000]", text: "text-white" });
    if (player.isPenaltyTaker)
      badges.push({ label: "PK", bg: "bg-[#800000]", text: "text-white" });

    if (!badges.length) return null;

    return (
      <div className="absolute -top-2 -right-2 flex gap-1 z-10">
        {badges.map((badge, idx) => (
          <div
            key={`${badge.label}-${idx}`}
            className={`w-6 h-6 rounded-full ${badge.bg} flex items-center justify-center shadow-md`}
          >
            <span
              className={`text-[10px] font-semibold ${
                badge.text ?? "text-gray-900"
              }`}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const getPlayerDisplayName = (player: SquadPlayer) => {
    const nameParts = player.name.split(" ");
    return nameParts.length > 1 ? nameParts[nameParts.length - 1] : player.name;
  };

  const playerPositions = getFormationPositions();

  return (
    <div className="w-full space-y-0">
      {/* Pitch */}
      <div
        className="w-full overflow-hidden relative bg-green-600"
        style={{ aspectRatio: "16/9", minHeight: "600px", minWidth: "100%" }}
      >
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
                className="absolute transform -translate-x-1/2 cursor-pointer group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 10 + index, // Ensure proper layering
                }}
                onClick={() => onPlayerClick?.(player)}
                onMouseEnter={() => setHoveredPlayer(player.id)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                <div className="relative flex flex-col items-center">
                  {/* Country flag icon - positioned above card, slightly to the left */}
                  <div className="absolute -top-2 z-10">
                    <div className="w-10 h-10 flex items-center justify-center shadow-md relative overflow-hidden">
                      {player.image && (
                        <div className="flex items-center justify-center w-full h-full text-xs">
                          <Image
                            src={player.image}
                            alt={player.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Player card with two sections */}
                  <div className="relative mt-10">
                    {/* Upper section - dark gray/black with player name */}
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-t-lg min-w-[65px]">
                      <div
                        className="text-xs whitespace-nowrap text-center"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        {player.name}
                      </div>
                    </div>
                    {/* Lower section - light green with position */}
                    <div className="bg-green-200 text-black px-3 py-1.5 rounded-b-lg">
                      <div
                        className="font text-xs whitespace-nowrap text-center"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        {player.position}
                      </div>
                    </div>

                    {renderRoleBadges(player)}
                  </div>

                  {/* Role menu button */}
                  {hoveredPlayer === player.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayerRoleMenu?.(player, e);
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 z-20"
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
            <p className="text-lg md:text-xl font-semibold mb-2">
              No players selected.
            </p>
            <p className="text-base md:text-lg">
              Add players to see them on the pitch
            </p>
          </div>
        )}
      </div>

      {/* Bench */}
      {bench.length > 0 && (
        <div className="bg-gray-800 p-4">
          <h4 className="text-white mb-3">Bench ({bench.length})</h4>
          <div className="flex flex-wrap justify-between gap-3 mx-4">
            {[...bench]
              .sort((a, b) => {
                // GK always first
                if (a.position === "GK" && b.position !== "GK") return -1;
                if (a.position !== "GK" && b.position === "GK") return 1;
                return 0; // Maintain original order for non-GK players
              })
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() => onPlayerClick?.(player)}
                  className="relative cursor-pointer group flex flex-col items-center"
                >
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-600 flex items-center justify-center shadow-md relative overflow-hidden">
                    {
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    }
                  </div>
                  <div className="mt-1 text-center">
                    <div className="bg-black text-white text-[12px] px-1.5 py-0.5 rounded whitespace-nowrap">
                      <div className="truncate max-w-[60px] lg:max-w-[80px]">
                        {player.name}
                      </div>
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
