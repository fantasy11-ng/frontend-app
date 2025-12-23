'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlobalRankingsTable from '@/components/ranking/GlobalRankingsTable';
import { Spinner } from '@/components/common/Spinner';
import NoTeamModal from '@/components/common/NoTeamModal';
import { leaderboardApi } from '@/lib/api';
import { GlobalRanking } from '@/types/ranking';

// Mock global rankings data for testing pagination and sorting
const mockGlobalRankings: GlobalRanking[] = [
];

// Set to true to test with mock data
const USE_MOCK_DATA = false;

export default function GlobalLeagueLeaderboardPage() {
  const router = useRouter();
  const [rankings, setRankings] = useState<GlobalRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNoTeamModal, setShowNoTeamModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      // Use mock data for testing
      if (USE_MOCK_DATA) {
        if (isMounted) {
          setRankings(mockGlobalRankings);
          setLoading(false);
        }
        return;
      }
      
      try {
        const { items } = await leaderboardApi.getGlobalLeaderboard({ page: 1, limit: 50 });
        if (isMounted) {
          setRankings(items);
        }
      } catch (err) {
        const errorResponse = err as {
          response?: { data?: { message?: string; error?: { message?: string } } };
          message?: string;
        };
        const message =
          errorResponse?.response?.data?.error?.message ??
          errorResponse?.response?.data?.message ??
          errorResponse?.message ??
          'Failed to load global leaderboard.';
        
        // Check if the error is because user doesn't have a team
        const isNoTeamError = message.toLowerCase().includes('fantasy team not found') ||
          message.toLowerCase().includes('team not found');
        
        if (isMounted) {
          if (isNoTeamError) {
            setShowNoTeamModal(true);
            setError(null);
          } else {
            setError(message);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <NoTeamModal 
        isOpen={showNoTeamModal} 
        onGoBack={() => router.push('/league')}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-6">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => router.push('/league')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#070A11] hover:text-[#4AA96C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to leagues
            </button>
          </div>

          <div className="md:bg-white md:rounded-2xl md:border md:border-[#F1F2F4] md:shadow-sm md:p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-[#070A11]">Global Leaderboard</h1>
              <p className="text-sm text-[#656E81] mt-1">
                Season-long rankings for all teams worldwide.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size={24} className="text-[#4AA96C]" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : rankings.length === 0 ? (
              <p className="text-sm text-[#656E81]">No global leaderboard data available.</p>
            ) : (
              <GlobalRankingsTable rankings={rankings} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

