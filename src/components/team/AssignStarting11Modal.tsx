'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { Player, PlayerPosition, SquadValidation } from '@/types/team';

interface AssignStarting11ModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  budget: number;
  onSave: (selectedPlayers: Player[]) => void;
}

const SQUAD_RULES = {
  squad: {
    GK: 2,
    DEF: 5,
    MID: 5,
    FWD: 3,
  },
  matchday: {
    GK: { min: 0, max: 1 },
    DEF: { min: 3, max: 5 },
    MID: { min: 2, max: 5 },
    FWD: { min: 1, max: 3 },
  },
};

const AssignStarting11Modal: React.FC<AssignStarting11ModalProps> = ({
  isOpen,
  onClose,
  players,
  budget,
  onSave,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [showMySquad, setShowMySquad] = useState(false);

  const positions: (PlayerPosition | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD'];

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.club?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
      const isNotSelected = !selectedPlayers.find((p) => p.id === player.id);

      return matchesSearch && matchesPosition && (!showMySquad || !isNotSelected);
    });
  }, [players, searchQuery, selectedPosition, selectedPlayers, showMySquad]);

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
      GK: getPositionCount('GK'),
      DEF: getPositionCount('DEF'),
      MID: getPositionCount('MID'),
      FWD: getPositionCount('FWD'),
    };

    const total = selectedPlayers.length;

    // Squad validation (15 players)
    if (total !== 15) {
      errors.push(`Squad must have exactly 15 players (currently ${total})`);
    } else {
      if (counts.GK !== SQUAD_RULES.squad.GK) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.squad.GK} goalkeepers (currently ${counts.GK})`);
      }
      if (counts.DEF !== SQUAD_RULES.squad.DEF) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.squad.DEF} defenders (currently ${counts.DEF})`);
      }
      if (counts.MID !== SQUAD_RULES.squad.MID) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.squad.MID} midfielders (currently ${counts.MID})`);
      }
      if (counts.FWD !== SQUAD_RULES.squad.FWD) {
        errors.push(`Squad must have exactly ${SQUAD_RULES.squad.FWD} forwards (currently ${counts.FWD})`);
      }
    }

    // Budget validation
    const remaining = getRemainingBudget();
    if (remaining < 0) {
      errors.push(`Budget exceeded by $${Math.abs(remaining / 1000000).toFixed(1)}M`);
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
        alert('Squad is full (15 players maximum)');
        return;
      }

      const maxForPosition = SQUAD_RULES.squad[player.position];
      if (positionCount >= maxForPosition) {
        alert(`Maximum ${maxForPosition} ${player.position} players allowed in squad`);
        return;
      }

      // Check budget
      if (getRemainingBudget() < player.price) {
        alert('Insufficient budget');
        return;
      }

      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSave = () => {
    const validation = validateSquad();
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    onSave(selectedPlayers);
    onClose();
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign starting 11</h2>
              <p className="text-sm text-gray-600">
                Select up to 15 players for your squad (11 starting + 4 bench) • Budget:{' '}
                <span className={remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
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
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search players or teams..."
                className="text-[#070A11] w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="text-[#070A11] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos === 'All' ? 'Position' : pos}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowMySquad(!showMySquad)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMySquad
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Squad ({squadCount}/15)
            </button>
          </div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No players found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayers.find((p) => p.id === player.id);
                const positionCount = getPositionCount(player.position);
                const maxForPosition = SQUAD_RULES.squad[player.position];
                const canAdd = !isSelected && positionCount < maxForPosition && squadCount < 15;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{player.name}</h3>
                        {isSelected && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {player.country} • {formatPrice(player.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {player.position}
                      </span>
                      {player.rating && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          {player.rating}
                        </span>
                      )}
                      <button
                        onClick={() => handleTogglePlayer(player)}
                        disabled={!canAdd && !isSelected}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : canAdd
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>
                Squad: {squadCount}/15 • GK: {getPositionCount('GK')}/{SQUAD_RULES.squad.GK} • DEF:{' '}
                {getPositionCount('DEF')}/{SQUAD_RULES.squad.DEF} • MID: {getPositionCount('MID')}/
                {SQUAD_RULES.squad.MID} • FWD: {getPositionCount('FWD')}/{SQUAD_RULES.squad.FWD}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={squadCount !== 15}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                  squadCount === 15
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Approve starting 11
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStarting11Modal;

