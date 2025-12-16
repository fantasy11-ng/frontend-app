'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Search, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Player } from '@/types/team';
import { Spinner } from '../common/Spinner';

interface TransfersProps {
  squadPlayers: Player[];
  availablePlayers: Player[];
  budget: number;
  pendingOut?: Player | null;
  onClearPendingOut?: () => void;
  onTransferIn: (player: Player) => void;
  onTransferOut: (player: Player) => void;
  transfersUsed?: number;
  transferLimit?: number;
  isLoadingAvailable?: boolean;
  onLoadMoreAvailable?: () => void;
  onSearchAvailable?: (term: string) => void;
  canLoadMoreAvailable?: boolean;
  isTransferring?: boolean;
  pendingQueue?: Array<{ out: Player; in?: Player }>;
  onConfirmQueue?: () => void;
}

const Transfers: React.FC<TransfersProps> = ({
  squadPlayers,
  availablePlayers,
  budget,
  pendingOut,
  onClearPendingOut,
  onTransferIn,
  onTransferOut,
  transfersUsed = 0,
  transferLimit = 4,
  isLoadingAvailable = false,
  onLoadMoreAvailable,
  onSearchAvailable,
  canLoadMoreAvailable = false,
  isTransferring = false,
  pendingQueue = [],
  onConfirmQueue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedCountry] = useState<string>('All');

  const handleAvailableScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const threshold = 80;
      const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < threshold;
      if (!nearBottom) return;

      if (onLoadMoreAvailable && !isLoadingAvailable && canLoadMoreAvailable) {
        onLoadMoreAvailable();
      }
    },
    [onLoadMoreAvailable, isLoadingAvailable, canLoadMoreAvailable]
  );

  const limitReached = transfersUsed >= transferLimit;

  const positions: (Player['position'] | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD'];


  const filteredSquadPlayers = useMemo(() => {
    return squadPlayers.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
      const matchesCountry = selectedCountry === 'All' || player.country === selectedCountry;

      return matchesSearch && matchesPosition && matchesCountry;
    });
  }, [squadPlayers, searchQuery, selectedPosition, selectedCountry]);

  const filteredAvailablePlayers = useMemo(() => {
    return availablePlayers.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
      const matchesCountry = selectedCountry === 'All' || player.country === selectedCountry;

      return matchesSearch && matchesPosition && matchesCountry;
    });
  }, [availablePlayers, searchQuery, selectedPosition, selectedCountry]);

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  const getRemainingBudget = () => {
    const totalSpent = squadPlayers.reduce((sum, p) => sum + p.price, 0);
    return budget - totalSpent;
  };

  return (
    <div className="space-y-6">
      {/* Budget & Pending */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:justify-start sm:gap-3">
            <span className="text-gray-600">Remaining Budget:</span>
            <span className={`text-lg font-semibold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPrice(getRemainingBudget())}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {pendingOut ? (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                <span className="text-xs text-gray-800">
                  Pending out: {pendingOut.name} ({pendingOut.position})
                </span>
                <button
                  onClick={onClearPendingOut}
                  className="text-gray-500 hover:text-gray-700"
                  title="Clear pending transfer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Select a squad player to transfer out</span>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">Transfers left this gameweek:</span>
              <span className={`font-semibold ${limitReached ? 'text-red-600' : 'text-green-600'}`}>
                {Math.max(transferLimit - transfersUsed, 0)} / {transferLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchAvailable?.(e.target.value);
              }}
              placeholder="Search players or teams..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos === 'All' ? 'Position' : pos}
                </option>
              ))}
            </select>
            {/* <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country === 'All' ? 'Country' : country}
                </option>
              ))}
            </select> */}
          </div>
        </div>
      </div>


      {/* Transfer Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Squad */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Squad</h3>
          {filteredSquadPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No players in squad</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSquadPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{player.name}</h4>
                    <p className="text-sm text-gray-600">
                      {player.country} • {formatPrice(player.price)} • {player.position}
                    </p>
                  </div>
                  <button
                    onClick={() => onTransferOut(player)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Mark for transfer out"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Players */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Available Players</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {isTransferring && (
                <span className="inline-flex items-center gap-1 text-[#4AA96C]">
                  <Spinner size={14} className="text-[#4AA96C]" />
                  Updating...
                </span>
              )}
              {isLoadingAvailable && <span>Loading...</span>}
            </div>
          </div>
          {filteredAvailablePlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No players available</p>
            </div>
          ) : (
            <div
              className="space-y-2 max-h-96 overflow-y-auto"
              onScroll={handleAvailableScroll}
            >
              {filteredAvailablePlayers.map((player) => {
                const canAfford = getRemainingBudget() + (pendingOut?.price || 0) >= player.price;
                const positionAllowed = pendingOut ? pendingOut.position === player.position : true;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      canAfford && positionAllowed && !limitReached
                        ? 'border-gray-200 hover:bg-gray-50'
                        : 'border-red-200 bg-red-50 opacity-60'
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-600">
                        {player.country} • {formatPrice(player.price)} • {player.position}
                      </p>
                    </div>
                    <button
                      onClick={() => onTransferIn(player)}
                      disabled={!canAfford || !positionAllowed || !pendingOut || limitReached || isTransferring}
                      className={`p-2 rounded-lg transition-colors ${
                        canAfford && positionAllowed && pendingOut && !limitReached
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title={
                        limitReached
                          ? 'Transfer limit reached'
                          : !pendingOut
                            ? 'Select a player to transfer out first'
                            : !positionAllowed
                              ? 'Must match position of player out'
                              : isTransferring
                                ? 'Transfer in progress'
                                : 'Insufficient budget'
                      }
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
              {onLoadMoreAvailable && canLoadMoreAvailable && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={onLoadMoreAvailable}
                    disabled={isLoadingAvailable}
                    className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {isLoadingAvailable ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pending batch summary */}
      {pendingQueue && pendingQueue.length > 0 && onConfirmQueue && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Pending batch transfers: {pendingQueue.length} (max {transferLimit - transfersUsed} remaining)
          </div>
          <button
            onClick={onConfirmQueue}
            className="px-4 py-2 rounded-full bg-[#4AA96C] text-white text-sm font-semibold hover:bg-[#3c8b58] transition-colors"
          >
            Confirm Transfers
          </button>
        </div>
      )}
    </div>
  );
};

export default Transfers;

