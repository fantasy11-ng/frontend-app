'use client';

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { SquadPlayer } from '@/types/team';
import toast from 'react-hot-toast';

interface ReverseSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerOut: SquadPlayer | null; // Starting 11 player to be replaced
  benchPlayers: SquadPlayer[];
  onSubstitute: (playerOut: SquadPlayer, playerIn: SquadPlayer) => void;
  validateSubstitution?: (playerOut: SquadPlayer, playerIn: SquadPlayer, currentStarting11: SquadPlayer[]) => { isValid: boolean; errors: string[] };
  currentStarting11: SquadPlayer[];
}

const ReverseSubstitutionModal: React.FC<ReverseSubstitutionModalProps> = ({
  isOpen,
  onClose,
  playerOut,
  benchPlayers,
  onSubstitute,
  validateSubstitution,
  currentStarting11,
}) => {
  const [selectedPlayerIn, setSelectedPlayerIn] = useState<SquadPlayer | null>(null);

  if (!isOpen || !playerOut) return null;

  // Filter bench players that can replace the starting 11 player
  const canReplace = (playerIn: SquadPlayer): boolean => {
    // Goalkeeper can only be replaced by goalkeeper (must always have exactly 1 GK)
    if (playerOut.position === 'GK') {
      return playerIn.position === 'GK';
    }
    if (playerIn.position === 'GK') {
      // Can't replace non-GK with GK (must always have exactly 1 GK)
      return false;
    }

    // If validation function is provided, use it
    if (validateSubstitution) {
      const validation = validateSubstitution(playerOut, playerIn, currentStarting11);
      return validation.isValid;
    }

    // Default: same position can always replace
    return playerIn.position === playerOut.position;
  };

  const availableBenchPlayers = benchPlayers
    .filter(canReplace)
    .sort((a, b) => {
      // GK always first
      if (a.position === 'GK' && b.position !== 'GK') return -1;
      if (a.position !== 'GK' && b.position === 'GK') return 1;
      return 0; // Maintain original order for non-GK players
    });

  const handleSubstitute = () => {
    if (!selectedPlayerIn) {
      toast.error('Please select a bench player to substitute in');
      return;
    }

    onSubstitute(playerOut, selectedPlayerIn);
    setSelectedPlayerIn(null);
    onClose();
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Substitute Player</h2>
              <p className="text-sm text-gray-600">
                Select a bench player to replace{' '}
                <span className="font-semibold">{playerOut.name}</span> in the starting 11
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

        {/* Player Out Info */}
        <div className="px-6 py-4 bg-red-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Substituting Out:</p>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{playerOut.name}</h3>
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                  {playerOut.position}
                </span>
                <span className="text-sm text-gray-600">
                  {playerOut.country} • {formatPrice(playerOut.price)}
                </span>
                {playerOut.role === 'captain' && (
                  <span className="text-yellow-500 text-xs">©</span>
                )}
                {playerOut.role === 'vice-captain' && (
                  <span className="text-gray-500 text-xs">VC</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Available Bench Players List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {availableBenchPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No bench players available to substitute in.</p>
              <p className="text-sm mb-2">
                This substitution would violate formation rules. Ensure you maintain:
              </p>
              <ul className="text-xs space-y-1 text-left inline-block">
                <li>• Exactly 1 goalkeeper</li>
                <li>• 3-5 defenders</li>
                <li>• 2-5 midfielders</li>
                <li>• 1-3 forwards</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select a bench player to substitute in:
              </p>
              {availableBenchPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayerIn(player)}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlayerIn?.id === player.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{player.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {player.country} • {formatPrice(player.price)} • {player.position}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {player.position}
                    </span>
                    {selectedPlayerIn?.id === player.id && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {selectedPlayerIn && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{playerOut.name}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium text-green-600">{selectedPlayerIn.name}</span>
                </div>
              </div>
            )}
            <div className="flex space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubstitute}
                disabled={!selectedPlayerIn}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                  selectedPlayerIn
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseSubstitutionModal;

