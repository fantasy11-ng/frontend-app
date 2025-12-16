'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlobalRankingsTable from '@/components/ranking/GlobalRankingsTable';
import AthleteRankingsTable from '@/components/ranking/AthleteRankingsTable';
import { GlobalRanking, AthleteRanking } from '@/types/ranking';
import { leaderboardApi } from '@/lib/api';
import { Spinner } from '@/components/common/Spinner';

const mockAthleteRankings: AthleteRanking[] = [
  {
    id: '1',
    rank: 1,
    player: 'Mohammed Salah',
    country: 'Egypt',
    points: 127,
    cleansheet: 7,
    goals: 7,
    assists: 4,
    cards: 1,
  },
  {
    id: '2',
    rank: 2,
    player: 'Sadio Mané',
    country: 'Senegal',
    points: 114,
    cleansheet: 6,
    goals: 6,
    assists: 5,
    cards: 0,
  },
  {
    id: '3',
    rank: 3,
    player: 'Riyad Mahrez',
    country: 'Algeria',
    points: 109,
    cleansheet: 4,
    goals: 4,
    assists: 6,
    cards: 2,
  },
  {
    id: '4',
    rank: 4,
    player: 'Victor Osimhen',
    country: 'Nigeria',
    points: 91,
    cleansheet: 8,
    goals: 8,
    assists: 2,
    cards: 1,
  },
  {
    id: '5',
    rank: 5,
    player: 'Achraf Hakimi',
    country: 'Morocco',
    points: 84,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
  {
    id: '6',
    rank: 6,
    player: 'Amadou Diallo',
    country: 'Morocco',
    points: 78,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
  {
    id: '7',
    rank: 7,
    player: 'Hakim Ziyech',
    country: 'Morocco',
    points: 69,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
  {
    id: '8',
    rank: 8,
    player: 'Samuel Chukwueze',
    country: 'Morocco',
    points: 72,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
  {
    id: '9',
    rank: 9,
    player: 'Mohammed Kudus',
    country: 'Morocco',
    points: 65,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
  {
    id: '10',
    rank: 10,
    player: 'Ilias Chair',
    country: 'Morocco',
    points: 87,
    cleansheet: 2,
    goals: 2,
    assists: 4,
    cards: 3,
  },
];

type TabType = 'global' | 'athlete';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [globalRankings, setGlobalRankings] = useState<GlobalRanking[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const ready = true;

  useEffect(() => {
    let isMounted = true;

    const fetchGlobalLeaderboard = async () => {
      setLoadingGlobal(true);
      setGlobalError(null);
      try {
        const { items } = await leaderboardApi.getGlobalLeaderboard({ page: 1, limit: 50 });
        if (isMounted) {
          setGlobalRankings(items);
        }
      } catch (error) {
        const message =
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ??
          (error as { message?: string })?.message ??
          'Failed to load global leaderboard.';
        if (isMounted) {
          setGlobalError(message);
        }
      } finally {
        if (isMounted) {
          setLoadingGlobal(false);
        }
      }
    };

    fetchGlobalLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {ready ? (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ranking</h1>
            </div>

            <div className="mb-8">
              <div className="flex space-x-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('global')}
                  className={`pb-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'global'
                      ? 'text-gray-900 border-b-2 border-green-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Global Rankings
                </button>
                <button
                  onClick={() => setActiveTab('athlete')}
                  className={`pb-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'athlete'
                      ? 'text-gray-900 border-b-2 border-green-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Athlete Rankings
                </button>
              </div>
            </div>

            <div>
              {activeTab === 'global' && (
                <>
                  {loadingGlobal ? (
                    <div className="flex justify-center py-10">
                      <Spinner size={24} className="text-[#4AA96C]" />
                    </div>
                  ) : globalError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {globalError}
                    </div>
                  ) : globalRankings.length === 0 ? (
                    <p className="text-sm text-[#656E81]">No global leaderboard data available.</p>
                  ) : (
                    <GlobalRankingsTable rankings={globalRankings} />
                  )}
                </>
              )}
              {activeTab === 'athlete' && (
                <AthleteRankingsTable rankings={mockAthleteRankings} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764948169/CominSoonBlue_b9r5cs.png"
              alt="Coming Soon"
              width={350}
              height={350}
            />
            <Link
              href="/predictor"
              className="bg-[#4AA96C] text-sm inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
            >
              Play Our Predictor Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
