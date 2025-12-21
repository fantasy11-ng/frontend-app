"use client";

import React, { useState } from "react";
import { X, ChevronDown, Crown } from "lucide-react";
import { Player, PlayerRole } from "@/types/team";
import { getCountryName } from "@/lib/constants/countries";
import Image from "next/image";

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onSendToBench?: () => void;
  onAssignRole?: (role: PlayerRole) => void;
  onAssignPenalty?: () => void;
  onAssignFreeKick?: () => void;
  isOnBench?: boolean;
  currentRole?: PlayerRole;
  isPenaltyTaker?: boolean;
  isFreeKickTaker?: boolean;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
  isOpen,
  onClose,
  player,
  onSendToBench,
  onAssignRole,
  onAssignPenalty,
  onAssignFreeKick,
  isOnBench = false,
  currentRole,
  isPenaltyTaker,
  isFreeKickTaker,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  if (!isOpen || !player) return null;

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  const handleRoleSelect = (role: PlayerRole) => {
    if (onAssignRole) {
      onAssignRole(role);
    }
    setShowRoleDropdown(false);
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      GK: "Goalkeeper",
      DEF: "Defender",
      MID: "Midfielder",
      ATT: "Attacker",
    };
    return labels[position] || position;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Pattern Background */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg p-6">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
              }}
            ></div>
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-white text-sm">{player.country}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {player.name}
              </h2>
              <p className="text-green-400 text-sm">
                {player.countryId
                  ? getCountryName(player.countryId)
                  : player.country || "N/A"}{" "}
                • {getPositionLabel(player.position)}
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <div>
                  <Image
                    src={player?.image || ""}
                    alt={player.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Attributes */}
        {/* <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Age</p>
              <p className="text-sm font-semibold text-gray-900">{player.age || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Height</p>
              <p className="text-sm font-semibold text-gray-900">{player.height || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Weight</p>
              <p className="text-sm font-semibold text-gray-900">{player.weight || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Index</p>
              <p className="text-sm font-semibold text-gray-900">{player.index || 'N/A'}</p>
            </div>
          </div>
        </div> */}

        {/* Statistics */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(player.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Points</p>
              <p className="text-sm font-semibold text-gray-900">
                {player.points || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Goals</p>
              <p className="text-sm font-semibold text-gray-900">
                {player.goals || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Assists</p>
              <p className="text-sm font-semibold text-gray-900">
                {player.assists || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cards</p>
              <p className="text-sm font-semibold text-gray-900">
                {player.cards || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 space-y-3">
          {!isOnBench && onSendToBench && (
            <button
              onClick={onSendToBench}
              className="w-full py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Send to bench
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Assign role</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showRoleDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showRoleDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    ASSIGN ROLE
                  </p>
                  {currentRole !== "captain" && currentRole !== "vice-captain" && (
                    <button
                      onClick={() => handleRoleSelect("captain")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span>Set as Captain</span>
                    </button>
                  )}
                  {currentRole !== "captain" && currentRole !== "vice-captain" && (
                    <button
                      onClick={() => handleRoleSelect("vice-captain")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Set as Vice Captain
                    </button>
                  )}
                  {onAssignFreeKick && !isFreeKickTaker && (
                    <button
                      onClick={() => {
                        onAssignFreeKick();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Assign as Free Kick Taker
                    </button>
                  )}
                  {onAssignPenalty && !isPenaltyTaker && (
                    <button
                      onClick={() => {
                        onAssignPenalty();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Assign as Penalty Taker
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsModal;
