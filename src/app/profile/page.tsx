'use client';

import { useState } from 'react';
import ProfileTab from '@/components/profile/ProfileTab';
import SecurityTab from '@/components/profile/SecurityTab';

type TabType = 'profile' | 'security';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-gray-900 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-gray-900 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
