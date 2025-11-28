'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { PlayerRole } from '@/types/team';

interface PlayerRoleMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onSendToBench?: () => void;
  onAssignRole?: (role: PlayerRole) => void;
}

const PlayerRoleMenu: React.FC<PlayerRoleMenuProps> = ({
  isOpen,
  position,
  onClose,
  onSendToBench,
  onAssignRole,
}) => {
  if (!isOpen) return null;

  const handleRoleSelect = (role: PlayerRole) => {
    if (onAssignRole) {
      onAssignRole(role);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Menu */}
      <div
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="p-2">
          {onSendToBench && (
            <>
              <button
                onClick={() => {
                  onSendToBench();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Send to Bench
              </button>
              <div className="border-t border-gray-200 my-1" />
            </>
          )}
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">ASSIGN ROLE</p>
          <button
            onClick={() => handleRoleSelect('captain')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
          >
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>Set as Captain</span>
          </button>
          <button
            onClick={() => handleRoleSelect('vice-captain')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Set as Vice Captain
          </button>
          <button
            onClick={() => handleRoleSelect('free-kick-taker')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Set as Free Kick Taker
          </button>
          <button
            onClick={() => handleRoleSelect('penalty-taker')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Set as Penalty Kick Taker
          </button>
        </div>
      </div>
    </>
  );
};

export default PlayerRoleMenu;

