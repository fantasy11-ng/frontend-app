'use client';

import React from 'react';
import { X } from 'lucide-react';

interface LeaveLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
  leagueType?: 'private' | 'global';
}

const LeaveLeagueModal: React.FC<LeaveLeagueModalProps> = ({
  isOpen,
  onClose,
  onConfirmLeave,
  leagueType = 'global',
}) => {
  if (!isOpen) return null;

  const isGlobal = leagueType === 'global';
  const leagueName = isGlobal ? 'Fantasy11 Global League' : 'this league';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#656E81CC] bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Leave {isGlobal ? 'Global' : ''} League
          </h2>
          <p className="text-sm text-gray-600">
            Are you sure you want to leave the {leagueName}? You&apos;ll lose your current ranking and won&apos;t be eligible for prizes.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onConfirmLeave}
            className="w-full py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
          >
            Leave League
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveLeagueModal;

