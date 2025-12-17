'use client';

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { SquadPlayer } from '@/types/team';
import toast from 'react-hot-toast';

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchPlayer: SquadPlayer | null;
  starting11: SquadPlayer[];
  onSubstitute: (playerOut: SquadPlayer, playerIn: SquadPlayer) => void;
  validateSubstitution?: (playerOut: SquadPlayer, playerIn: SquadPlayer, currentStarting11: SquadPlayer[]) => { isValid: boolean; errors: string[] };
}

const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  benchPlayer,
  starting11,
  onSubstitute,
  validateSubstitution,
}) => {
  const [selectedPlayerOut, setSelectedPlayerOut] = useState<SquadPlayer | null>(null);

  if (!isOpen || !benchPlayer) return null;

  // Filter starting 11 players that can be replaced with this bench player
  // Uses formation rules to determine valid substitutions
  const canReplace = (playerOut: SquadPlayer): boolean => {
    // Goalkeeper can only replace goalkeeper (must always have exactly 1 GK)
    if (benchPlayer.position === 'GK') {
      return playerOut.position === 'GK';
    }
    if (playerOut.position === 'GK') {
      // Can't replace GK with non-GK (must always have exactly 1 GK)
      return false;
    }

    // If validation function is provided, use it
    if (validateSubstitution) {
      const validation = validateSubstitution(playerOut, benchPlayer, starting11);
      return validation.isValid;
    }

    // Default: same position can always replace
    return playerOut.position === benchPlayer.position;
  };

  const replaceablePlayers = starting11.filter(canReplace);

  const handleSubstitute = () => {
    if (!selectedPlayerOut) {
      toast.error('Please select a player to replace');
      return;
    }

    onSubstitute(selectedPlayerOut, benchPlayer);
    setSelectedPlayerOut(null);
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
                Select a player from starting 11 to replace with{' '}
                <span className="font-semibold">{benchPlayer.name}</span>
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

        {/* Bench Player Info */}
        <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Substituting In:</p>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{benchPlayer.name}</h3>
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  {benchPlayer.position}
                </span>
                <span className="text-sm text-gray-600">
                  {benchPlayer.country} • {formatPrice(benchPlayer.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Replaceable Players List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {replaceablePlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No players available to replace.</p>
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
                Select a player to replace:
              </p>
              {replaceablePlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayerOut(player)}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlayerOut?.id === player.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{player.name}</h4>
                      {player.role === 'captain' && (
                        <span className="text-yellow-500 text-xs">©</span>
                      )}
                      {player.role === 'vice-captain' && (
                        <span className="text-gray-500 text-xs">VC</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {player.country} • {formatPrice(player.price)} • {player.position}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {player.position}
                    </span>
                    {selectedPlayerOut?.id === player.id && (
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
          <div className="flex items-center justify-between">
            {selectedPlayerOut && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{selectedPlayerOut.name}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium text-green-600">{benchPlayer.name}</span>
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
                disabled={!selectedPlayerOut}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                  selectedPlayerOut
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Confirm Substitution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionModal;

