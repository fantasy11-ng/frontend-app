'use client';

import React from 'react';
import { X, Plus, Lock } from 'lucide-react';
import Image from 'next/image';

interface ChooseLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: 'create' | 'join' | 'championship' | null;
  onSelectOption: (option: 'create' | 'join' | 'championship') => void;
  onContinue: () => void;
}

const ChooseLeagueModal: React.FC<ChooseLeagueModalProps> = ({
  isOpen,
  onClose,
  selectedOption,
  onSelectOption,
  onContinue,
}) => {
  if (!isOpen) return null;

  const JoinIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );

  const options = [
    {
      id: 'create' as const,
      icon: Plus,
      title: 'Create New League',
      description: 'Start your own fantasy league and invite friends',
    },
    {
      id: 'join' as const,
      icon: Lock,
      customIcon: JoinIcon,
      title: 'Join Existing League',
      description: 'Enter a league using an invitation code',
    },
    {
      id: 'championship' as const,
      icon: null,
      title: 'Global Championship',
      description: 'Complete against thousands of managers worldwide',
    },
  ];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your League</h2>
          <p className="text-sm text-gray-600">
            Create a new league or join an existing one with friends
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-green-500' : 'bg-gray-100'
                    }`}>
                      {option.id === 'join' && 'customIcon' in option && option.customIcon ? (
                        <div className={isSelected ? 'text-white' : 'text-green-500'}>
                          <option.customIcon />
                        </div>
                      ) : option.id === 'championship' ? (
                        <Image src="/images/Gold.png" alt="Trophy" width={24} height={24} className="w-6 h-6" />
                      ) : Icon ? (
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-green-500'}`} />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onContinue}
            disabled={!selectedOption}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              selectedOption
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseLeagueModal;

