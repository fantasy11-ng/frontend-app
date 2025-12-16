'use client';

import React, { useState, useMemo } from 'react';
import { Search, User } from 'lucide-react';
import { Player, PlayerPosition, SquadPlayer } from '@/types/team';

interface SquadManagementProps {
  players: (Player | SquadPlayer)[];
  onPlayerClick?: (player: Player | SquadPlayer) => void;
  onMoveToStarting11?: (player: Player | SquadPlayer) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedPosition?: string;
  onPositionChange?: (position: string) => void;
  selectedCountry?: string;
  onCountryChange?: (country: string) => void;
}

const SquadManagement: React.FC<SquadManagementProps> = ({
  players,
  onPlayerClick,
  onMoveToStarting11,
  searchQuery: controlledSearchQuery,
  onSearchChange,
  selectedPosition: controlledPosition,
  onPositionChange,
  selectedCountry: controlledCountry,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalPosition, setInternalPosition] = useState<string>('All');
  const [internalCountry] = useState<string>('All');

  const searchQuery = controlledSearchQuery !== undefined ? controlledSearchQuery : internalSearchQuery;
  const selectedPosition = controlledPosition !== undefined ? controlledPosition : internalPosition;
  const selectedCountry = controlledCountry !== undefined ? controlledCountry : internalCountry;

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  };

  const handlePositionChange = (position: string) => {
    if (onPositionChange) {
      onPositionChange(position);
    } else {
      setInternalPosition(position);
    }
  };


  const positions: (PlayerPosition | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD'];



  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.club?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
      const matchesCountry = selectedCountry === 'All' || player.country === selectedCountry;

      return matchesSearch && matchesPosition && matchesCountry;
    });
  }, [players, searchQuery, selectedPosition, selectedCountry]);

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Squad Management</h3>
      <p className="text-sm text-gray-600 mb-4">Manage your starting 11 and assign roles</p>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search players or teams..."
          className="text-[#070A11] w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3 mb-4">
        <select
          value={selectedPosition}
          onChange={(e) => handlePositionChange(e.target.value)}
          className="text-[#070A11] flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos === 'All' ? 'Position' : pos}
            </option>
          ))}
        </select>
        {/* <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="text-[#070A11] flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country === 'All' ? 'Country' : country}
            </option>
          ))}
        </select> */}
      </div>

      {/* Player List */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No players selected.</p>
          <p>Add players to see them here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => onPlayerClick?.(player)}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                player.inStarting11
                  ? 'border-green-500 bg-green-50'
                  : player.onBench
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{player.name}</h4>
                  {player.role === 'captain' && (
                    <span className="text-yellow-500 text-xs">©</span>
                  )}
                  {player.role === 'vice-captain' && (
                    <span className="text-gray-500 text-xs">VC</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {player.country} • {formatPrice(player.price)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {player.position}
                </span>
                {player.inStarting11 && (
                  <User className="w-5 h-5 text-green-500" />
                )}
                {player.onBench && !player.inStarting11 && onMoveToStarting11 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveToStarting11(player);
                    }}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    title="Move to starting 11"
                  >
                    Substitute In
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SquadManagement;

