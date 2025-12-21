"use client";

import React, { useState, useMemo, useCallback } from "react";
import { X, Search, Plus, Check } from "lucide-react";
import { Player, PlayerPosition, SquadValidation } from "@/types/team";
import toast from "react-hot-toast";
import { Spinner } from "../common/Spinner";
import { getCountryName } from "@/lib/constants/countries";

interface AssignStarting11ModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  budget: number;
  onSave: (selectedPlayers: Player[]) => Promise<void> | void;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  onSearchChange?: (value: string) => void;
  onPositionChange?: (value: string) => void;
  selectedPosition?: string;
  isLoadingList?: boolean;
  isLoadingMore?: boolean;
}

const SQUAD_RULES = {
  squad: {
    GK: 2,
    DEF: 5,
    MID: 5,
    ATT: 3,
  },
  matchday: {
    GK: { min: 0, max: 1 },
    DEF: { min: 3, max: 5 },
    MID: { min: 2, max: 5 },
    ATT: { min: 1, max: 3 },
  },
};

const AssignStarting11Modal: React.FC<AssignStarting11ModalProps> = ({
  isOpen,
  onClose,
  players,
  budget,
  onSave,
  onLoadMore,
  canLoadMore = false,
  isLoadingMore = false,
  onSearchChange,
  onPositionChange,
  selectedPosition = "All",
  isLoadingList = false,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMySquad, setShowMySquad] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const positions: (PlayerPosition | "All")[] = [
    "All",
    "GK",
    "DEF",
    "MID",
    "ATT",
  ];

  const filteredPlayers = useMemo(() => {
    // Only local filter is "My Squad" view; search/position are handled via API
    if (showMySquad) {
      const selectedIds = new Set(selectedPlayers.map((p) => p.id));
      return players.filter((p) => selectedIds.has(p.id));
    }
    return players;
  }, [players, selectedPlayers, showMySquad]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
      if (nearBottom && canLoadMore && !isLoadingMore) {
        onLoadMore?.();
      }
    },
    [canLoadMore, isLoadingMore, onLoadMore]
  );

  const getPositionCount = (position: PlayerPosition) => {
    return selectedPlayers.filter((p) => p.position === position).length;
  };

  const getRemainingBudget = () => {
    const totalSpent = selectedPlayers.reduce((sum, p) => sum + p.price, 0);
    return budget - totalSpent;
  };

  const validateSquad = (): SquadValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const counts = {
      GK: getPositionCount("GK"),
      DEF: getPositionCount("DEF"),
      MID: getPositionCount("MID"),
      ATT: getPositionCount("ATT"),
    };

    const total = selectedPlayers.length;

    // Squad validation (15 players)
    if (total !== 15) {
      errors.push(`Squad must have exactly 15 players (currently ${total})`);
    } else {
      if (counts.GK !== SQUAD_RULES.squad.GK) {
        errors.push(
          `Squad must have exactly ${SQUAD_RULES.squad.GK} goalkeepers (currently ${counts.GK})`
        );
      }
      if (counts.DEF !== SQUAD_RULES.squad.DEF) {
        errors.push(
          `Squad must have exactly ${SQUAD_RULES.squad.DEF} defenders (currently ${counts.DEF})`
        );
      }
      if (counts.MID !== SQUAD_RULES.squad.MID) {
        errors.push(
          `Squad must have exactly ${SQUAD_RULES.squad.MID} midfielders (currently ${counts.MID})`
        );
      }
      if (counts.ATT !== SQUAD_RULES.squad.ATT) {
        errors.push(
          `Squad must have exactly ${SQUAD_RULES.squad.ATT} forwards (currently ${counts.ATT})`
        );
      }
    }

    // Budget validation
    const remaining = getRemainingBudget();
    if (remaining < 0) {
      errors.push(
        `Budget exceeded by $${Math.abs(remaining / 1000000).toFixed(1)}M`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  const handleTogglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.find((p) => p.id === player.id);
    const positionCount = getPositionCount(player.position);
    const total = selectedPlayers.length;

    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      // Check squad limits
      if (total >= 15) {
        toast.error("Squad is full (15 players maximum)");
        return;
      }

      const maxForPosition = SQUAD_RULES.squad[player.position];
      if (positionCount >= maxForPosition) {
        toast.error(
          `Maximum ${maxForPosition} ${player.position} players allowed in squad`
        );
        return;
      }

      // Check budget
      if (getRemainingBudget() < player.price) {
        toast.error("Insufficient budget");
        return;
      }

      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSave = async () => {
    const validation = validateSquad();
    if (!validation.isValid) {
      toast.error(validation.errors.join("\n"));
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(selectedPlayers);
      toast.success("Squad saved successfully!");
      onClose();
    } catch (error) {
      // Error is already handled in handleSaveSquad, but we catch here to prevent unhandled rejection
      console.error("Failed to save squad:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  if (!isOpen) return null;

  const squadCount = selectedPlayers.length;
  const remainingBudget = getRemainingBudget();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Assign starting 11
              </h2>
              <p className="text-sm text-gray-600">
                Select up to 15 players for your squad (11 starting + 4 bench) •
                Budget:{" "}
                <span
                  className={
                    remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {formatPrice(remainingBudget)} remaining
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-4 flex-wrap gap-y-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                placeholder="Search players or teams..."
                className="text-[#070A11] w-full min-w-[200px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedPosition}
              onChange={(e) => onPositionChange?.(e.target.value)}
              className="text-[#070A11] min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos === "All" ? "Position" : pos}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowMySquad(!showMySquad)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMySquad
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              My Squad ({squadCount}/15)
            </button>
          </div>
        </div>

        {/* Player List */}
        <div
          className={`flex-1 px-6 py-4 relative ${
            isLoadingList ? "overflow-hidden" : "overflow-y-auto"
          }`}
          onScroll={handleScroll}
        >
          {/* Loading overlay - covers full container and blocks interaction */}
          {isLoadingList && (
            <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
              <Spinner size={24} className="text-[#4AA96C]" />
            </div>
          )}

          {isLoadingList && filteredPlayers.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-gray-500">
              <Spinner size={24} className="text-[#4AA96C]" />
            </div>
          ) : (
            <>
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No players found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlayers.map((player) => {
                    const isSelected = selectedPlayers.find(
                      (p) => p.id === player.id
                    );
                    const positionCount = getPositionCount(player.position);
                    const maxForPosition = SQUAD_RULES.squad[player.position];
                    const canAdd =
                      !isSelected &&
                      positionCount < maxForPosition &&
                      squadCount < 15;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">
                              {player.name}
                            </h3>
                            {isSelected && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {getCountryName(player.countryId)} •{" "}
                            {formatPrice(player.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {player.position}
                          </span>
                          {player.rating && (
                            <span className="px-3 py-1 bg-red-100 text-[#800000] rounded-full text-xs font-bold">
                              {player.rating}
                            </span>
                          )}
                          <button
                            onClick={() => handleTogglePlayer(player)}
                            disabled={!canAdd && !isSelected}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : canAdd
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isLoadingList && filteredPlayers.length > 0 && (
                <div className="flex justify-center items-center py-3 text-gray-500">
                  <Spinner size={24} className="text-[#4AA96C]" />
                </div>
              )}

              {isLoadingMore && !isLoadingList && (
                <div className="text-center py-3 text-sm text-gray-500">
                  Loading more players...
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-y-4">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-bold">GK</span>: {getPositionCount("GK")}/
                {SQUAD_RULES.squad.GK} • <span className="font-bold">DEF</span>:{" "}
                {getPositionCount("DEF")}/{SQUAD_RULES.squad.DEF} •{" "}
                <span className="font-bold">MID</span>:{" "}
                {getPositionCount("MID")}/{SQUAD_RULES.squad.MID} •{" "}
                <span className="font-bold">ATT</span>:{" "}
                {getPositionCount("ATT")}/{SQUAD_RULES.squad.ATT}
              </p>
            </div>
            <div className="flex justify-center w-full md:w-auto space-x-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className={`min-w-[125px] px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={squadCount !== 15 || isSaving}
                className={`min-w-[125px] px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                  squadCount === 15 && !isSaving
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <Spinner size={16} className="text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStarting11Modal;
