'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, login, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Fantasy11 - African Cup of Nations
            </h1>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  logout();
                } else {
                  login({ name: 'John Doe', initials: 'JD' });
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isAuthenticated ? 'Logout' : 'Login'} Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Fantasy11
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Platform Features
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Create and manage your fantasy team</li>
                <li>• Join leagues and compete with friends</li>
                <li>• Track player statistics and rankings</li>
                <li>• Make predictions for match outcomes</li>
                <li>• Win prizes and rewards</li>
                <li>• Stay updated with latest news</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Current Status
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Authentication Status:</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  Toggle the demo button above to see how the navbar adapts to different user states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
