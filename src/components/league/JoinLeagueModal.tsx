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
  onJoinLeague: (code: string) => void;
  leagueDetails?: LeagueDetails | null;
}

const JoinLeagueModal: React.FC<JoinLeagueModalProps> = ({
  isOpen,
  onClose,
  onJoinLeague,
  leagueDetails: initialLeagueDetails,
}) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetails | null>(initialLeagueDetails || null);

  // Simulate fetching league details when code is entered
  React.useEffect(() => {
    if (invitationCode.length >= 10) {
      // Simulate API call - in real app, this would be an actual API call
      // For demo, show details if code matches a pattern
      if (invitationCode.startsWith('FL11-')) {
        setLeagueDetails({
          name: 'Lion Champs',
          members: '12/50',
          admin: 'Ahmed Hassan',
        });
      } else {
        setLeagueDetails(null);
      }
    } else {
      setLeagueDetails(null);
    }
  }, [invitationCode]);

  React.useEffect(() => {
    if (initialLeagueDetails) {
      setLeagueDetails(initialLeagueDetails);
    }
  }, [initialLeagueDetails]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setInvitationCode('');
      setLeagueDetails(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (invitationCode.trim()) {
      onJoinLeague(invitationCode);
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono"
            />
          </div>

          {/* League Details */}
          {leagueDetails && (
            <div className="pt-2">
              <h3 className="font-semibold text-gray-900 mb-3">League Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">League Name:</span>
                  <span className="font-medium text-gray-900">{leagueDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium text-gray-900">{leagueDetails.members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin:</span>
                  <span className="font-medium text-gray-900">{leagueDetails.admin}</span>
                </div>
              </div>
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
              disabled={!invitationCode.trim()}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors ${
                invitationCode.trim()
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Join League
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinLeagueModal;

