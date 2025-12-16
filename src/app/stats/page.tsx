'use client';

import { useState, useEffect, useCallback } from 'react';
import TopStatsCards from '@/components/stats/TopStatsCards';
import PlayersTable from '@/components/stats/PlayersTable';
import { TopStat, Player, PlayerListMeta } from '@/types/stats';
import { statsApi } from '@/lib/api/stats';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for top stats - can be replaced with actual API call later
const mockTopStats: TopStat[] = [
  {
    title: 'Most Points',
    country: 'Egypt',
    playerName: 'Mohammed Salah',
    value: '127 points',
    icon: 'points',
  },
  {
    title: 'Most Goals',
    country: 'Nigeria',
    playerName: 'Mohammed Salah',
    value: '8 goals',
    icon: 'goals',
  },
  {
    title: 'Most Assists',
    country: 'Algeria',
    playerName: 'Mohammed Salah',
    value: '6 assists',
    icon: 'assists',
  },
];

const DEFAULT_PAGE_SIZE = 20;

export default function StatsPage() {
  const ready = true;
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [meta, setMeta] = useState<PlayerListMeta>({
    itemsPerPage: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<number | undefined>(undefined);
  const [countryFilter, setCountryFilter] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await statsApi.getPlayers({
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        search: searchQuery || undefined,
        positionId: positionFilter,
        countryId: countryFilter,
      });
      
      setPlayers(result.players);
      setMeta(result.meta);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, positionFilter, countryFilter]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePositionFilter = (positionId: number | undefined) => {
    setPositionFilter(positionId);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCountryFilter = (countryId: number | undefined) => {
    setCountryFilter(countryId);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <>
    {ready ? 
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stats</h1>
        </div>

        {/* Top Stats Cards */}
        <TopStatsCards stats={mockTopStats} />

        {/* Players Table Section */}
        <PlayersTable 
          players={players}
          meta={meta}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onPositionFilter={handlePositionFilter}
          onCountryFilter={handleCountryFilter}
          isLoading={isLoading}
        />
      </div>
    </div> :

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
    }
    </>
  );
}
