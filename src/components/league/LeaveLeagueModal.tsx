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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[514px] mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-6">
          <h2 className="text-2xl font-bold text-[#070A11] mb-2">
            Leave {isGlobal ? 'Global' : ''} League
          </h2>
          <p className="text-sm text-[#656E81]">
            Are you sure you want to leave the {leagueName}? You&apos;ll lose your current ranking and won&apos;t be eligible for prizes.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
        <button
            onClick={onClose}
            className="w-full h-10 rounded-full font-semibold text-[#656E81] bg-white border border-[#D4D7DD]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLeave}
            className="w-full h-10 rounded-full font-medium text-white bg-[#4AA96C]"
          >
            Leave League
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveLeagueModal;

