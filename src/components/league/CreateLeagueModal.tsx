'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLeague: (leagueName: string) => Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({
  isOpen,
  onClose,
  onCreateLeague,
  isSubmitting,
  errorMessage,
}) => {
  const [leagueName, setLeagueName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (leagueName.trim()) {
      await onCreateLeague(leagueName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#656E81CC] bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[450px] md:max-w-[514px] mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-semibold text-[#070A11] mb-1">Create New League</h2>
          <p className="text-sm text-[#656E81]">
            Set up your private fantasy league and get an invitation code to share with friends
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-4">
          {/* League Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League Name</label>
            <input
              type="text"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              placeholder="Enter league name"
              className="text-[#070A11] w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Invitation Code */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Invitation Code:
            </label>
            <div className="relative">
              <input
                type="text"
                value={invitationCode}
                readOnly
                className="text-[#070A11] w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center font-mono"
              />
            </div>
            <p className="text-xs text-[#656E81] mt-2">
              Share this code with your friends to join your league
            </p>
          </div> */}

          {/* Error */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-full font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!leagueName.trim() || isSubmitting}
              className={`flex-1 h-10 text-xs px-2 sm:text-base rounded-full font-semibold text-white transition-colors ${
                leagueName.trim() && !isSubmitting
                  ? 'bg-[#4AA96C] hover:bg-[#3c8b58]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create & Join League'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeagueModal;

