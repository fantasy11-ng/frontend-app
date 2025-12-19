'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

interface NoTeamModalProps {
  isOpen: boolean;
  onGoBack?: () => void;
}

const NoTeamModal: React.FC<NoTeamModalProps> = ({ isOpen, onGoBack }) => {
  const router = useRouter();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
  };

  const handleCreateTeam = () => {
    router.push('/my-team');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A11]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] mx-4 overflow-hidden">
        {/* Icon Section */}
        <div className="bg-gradient-to-br from-[#4AA96C]/10 to-[#4AA96C]/5 px-6 pt-8 pb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#4AA96C]/15 flex items-center justify-center">
            <Users className="w-10 h-10 text-[#4AA96C]" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 text-center">
          <h2 className="text-xl font-semibold text-[#070A11] mb-2">
            No Team Found
          </h2>
          <p className="text-sm text-[#656E81] mb-6 leading-relaxed">
            You haven&apos;t created a fantasy team yet. Create your team to participate in leagues, view rankings, and compete with other managers.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 min-h-11 rounded-full font-semibold text-[#656E81] bg-white border border-[#D4D7DD] hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleCreateTeam}
              className="flex-1 min-h-11 rounded-full font-semibold text-white bg-[#4AA96C] hover:bg-[#3c8b58] transition-colors"
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoTeamModal;

