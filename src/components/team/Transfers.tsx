'use client';

import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Player } from '@/types/team';

interface TransfersProps {
  squadPlayers: Player[];
  availablePlayers: Player[];
  budget: number;
  onTransferIn: (player: Player) => void;
  onTransferOut: (player: Player) => void;
}

const Transfers: React.FC<TransfersProps> = ({
  squadPlayers,
  availablePlayers,
  budget,
  onTransferIn,
  onTransferOut,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const positions: (Player['position'] | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD'];

  const countries = useMemo(() => {
    const allCountries = [
      ...squadPlayers.map((p) => p.country),
      ...availablePlayers.map((p) => p.country),
    ].filter(Boolean);
    const uniqueCountries = Array.from(new Set(allCountries));
    return ['All', ...uniqueCountries.sort()];
  }, [squadPlayers, availablePlayers]);

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
      {/* Budget Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Remaining Budget:</span>
          <span className={`text-lg font-semibold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPrice(getRemainingBudget())}
          </span>
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country === 'All' ? 'Country' : country}
                </option>
              ))}
            </select>
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
                    title="Transfer out"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Players</h3>
          {filteredAvailablePlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No players available</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAvailablePlayers.map((player) => {
                const canAfford = getRemainingBudget() + (squadPlayers.find((p) => p.id === player.id)?.price || 0) >= player.price;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      canAfford
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
                      disabled={!canAfford}
                      className={`p-2 rounded-lg transition-colors ${
                        canAfford
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title={canAfford ? 'Transfer in' : 'Insufficient budget'}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfers;

