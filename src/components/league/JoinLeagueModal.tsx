'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LeagueDetails {
  name: string;
  members: string;
  admin: string;
}

interface JoinLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinLeague: (code: string) => Promise<void> | void;
  leagueDetails?: LeagueDetails | null;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const JoinLeagueModal: React.FC<JoinLeagueModalProps> = ({
  isOpen,
  onClose,
  onJoinLeague,
  isSubmitting = false,
  errorMessage,
}) => {
  const [invitationCode, setInvitationCode] = useState('');



  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (invitationCode.trim()) {
      await onJoinLeague(invitationCode);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Existing League</h2>
          <p className="text-sm text-gray-600">
            Enter the invitation code provided by your league administrator
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-4">
          {/* Invitation Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitation Code
            </label>
            <input
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              placeholder="FL11-XXXXXXX"
              className="text-[#070A11] w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono"
            />
          </div>



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
              className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!invitationCode.trim() || isSubmitting}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors ${
                invitationCode.trim() && !isSubmitting
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Joining...' : 'Join League'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinLeagueModal;

