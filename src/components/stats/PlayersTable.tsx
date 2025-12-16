'use client';

import { useState } from 'react';
import { Search, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Player, PlayerListMeta } from '@/types/stats';
import { 
  POSITION_ID_MAP, 
  POSITION_NAMES,
  getPositionName,
  COUNTRY_ID_MAP, 
  COUNTRY_NAMES,
  getCountryName 
} from '@/lib/constants';

interface PlayersTableProps {
  players: Player[];
  meta: PlayerListMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  onPositionFilter?: (positionId: number | undefined) => void;
  onCountryFilter?: (countryId: number | undefined) => void;
  onSortChange?: (sortBy: string) => void;
  isLoading?: boolean;
}

type TabType = 'performance' | 'details';

// Helper to format price
const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price}`;
};

// Map dropdown labels to API sortBy values
const SORT_OPTIONS = [
  { label: 'Points', sortBy: 'points:DESC' },
  { label: 'Price', sortBy: 'price:DESC' },
  { label: 'Goals', sortBy: 'goals:DESC' },
  { label: 'Assists', sortBy: 'assists:DESC' },
] as const;

export default function PlayersTable({ 
  players, 
  meta,
  currentPage,
  onPageChange,
  onSearch,
  onPositionFilter,
  onCountryFilter,
  onSortChange,
  isLoading = false,
}: PlayersTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>('performance');
  const [searchQuery, setSearchQuery] = useState('');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [showPointsFilter, setShowPointsFilter] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('All Positions');
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [selectedPointsFilter, setSelectedPointsFilter] = useState<string>('Points');

  const positions = ['All Positions', ...POSITION_NAMES];
  
  // Get countries from the constants, sorted alphabetically
  const countries = ['All Countries', ...COUNTRY_NAMES];
  
  // Filter countries based on search
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
    setShowPositionFilter(false);
    const positionId = position === 'All Positions' ? undefined : POSITION_ID_MAP[position];
    onPositionFilter?.(positionId);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setShowCountryFilter(false);
    setCountrySearchQuery('');
    const countryId = country === 'All Countries' ? undefined : COUNTRY_ID_MAP[country];
    onCountryFilter?.(countryId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < meta.totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate rank based on pagination
  const getRank = (index: number): number => {
    return (currentPage - 1) * meta.itemsPerPage + index + 1;
  };

  // Calculate showing range
  const startIndex = (currentPage - 1) * meta.itemsPerPage + 1;
  const endIndex = Math.min(currentPage * meta.itemsPerPage, meta.totalItems);

  const positionLabel = selectedPosition === 'All Positions' ? 'Position' : selectedPosition;
  const countryLabel = selectedCountry === 'All Countries' ? 'Country' : selectedCountry;
  const pointsLabel = selectedPointsFilter === 'Points' ? 'Points' : selectedPointsFilter;

  return (
    <div className="space-y-6 mt-6">
      {/* Title and Subtitle */}
      <div className="mb-6">
        <p className="text-sm text-[#656E81]">
          Comprehensive performance statistics for AFCON 2025&apos;s players
        </p>
      </div>

      {/* Tabs + Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex space-x-8 border-b-2 border-[#F1F2F4]">
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'text-[#070A11] border-b-4 border-[#4AA96C]'
                : 'text-[#656E81] hover:text-[#070A11]'
            }`}
          >
            Performance Stats
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex w-full flex-col lg:flex-row gap-3 sm:w-auto  sm:justify-end sm:gap-3 xl:gap-4">
          <div className="relative w-full lg:w-72 flex items-center">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A6B1]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search players..."
              className="w-full rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-11 pr-11 text-sm text-[#070A11] placeholder:text-[#A0A6B1] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A6B1] hover:text-[#070A11]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 sm:flex-row flex-wrap justify-end sm:gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  setShowPositionFilter(!showPositionFilter);
                  setShowCountryFilter(false);
                  setShowPointsFilter(false);
                }}
                className="flex items-center rounded-lg border border-[#D4D7DD] px-4 py-2 text-sm text-[#070A11] transition hover:border-[#4AA96C]"
              >
                <span>{positionLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-[#7C8395]" />
              </button>
              {showPositionFilter && (
                <div className="absolute top-full mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl z-10">
                  <div className="p-2">
                    {positions.map((position) => (
                      <button
                        key={position}
                        onClick={() => handlePositionChange(position)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowCountryFilter(!showCountryFilter);
                  setShowPositionFilter(false);
                  setShowPointsFilter(false);
                  if (showCountryFilter) setCountrySearchQuery('');
                }}
                className="flex items-center rounded-lg border border-[#D4D7DD] px-4 py-2 text-sm text-[#070A11] transition hover:border-[#4AA96C]"
              >
                <span>{countryLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-[#7C8395]" />
              </button>
              {showCountryFilter && (
                <div className="absolute top-full mt-2 w-64 max-h-96 rounded-2xl border border-gray-200 bg-white shadow-xl z-10">
                  <div className="sticky top-0 border-b border-gray-200 p-2 bg-white rounded-t-2xl">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        placeholder="Search countries..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="p-2 max-h-72 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountryChange(country)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                            selectedCountry === country ? 'bg-gray-100 text-[#4AA96C] font-medium' : 'text-gray-700'
                          }`}
                        >
                          {country}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-500">No countries found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowPointsFilter(!showPointsFilter);
                  setShowPositionFilter(false);
                  setShowCountryFilter(false);
                }}
                className="flex items-center rounded-lg border border-[#D4D7DD] px-4 py-2 text-sm text-[#070A11] transition hover:border-[#4AA96C]"
              >
                <span>{pointsLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-[#7C8395]" />
              </button>
              {showPointsFilter && (
                <div className="absolute top-full mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl z-10">
                  <div className="p-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          setSelectedPointsFilter(option.label);
                          setShowPointsFilter(false);
                          onSortChange?.(option.sortBy);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          selectedPointsFilter === option.label ? 'bg-gray-100 text-[#4AA96C] font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4AA96C] border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading players...</p>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery 
              ? `Oops! It looks like we couldn't find any results for "${searchQuery}". Try searching for something else!`
              : 'No players found.'}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && players.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[#F1F2F4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  {activeTab === 'performance' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assists
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cards
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player, index) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-[#800000] flex items-center justify-center">
                        <span className="text-white font-semibold text-[10px]">{getRank(index)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-[#070A11] text-sm font-medium">{player.name}</div>
                      </div>
                    </td>
                    {activeTab === 'performance' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 border border-[#D4D7DD] text-[#656E81] rounded-full text-sm">
                            {getPositionName(player.positionId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {getCountryName(player.countryId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {formatPrice(player.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm">
                            {player.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FE5E41]">
                          {player.goals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4961B9]">
                          {player.assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-[#0EC76A] text-sm font-medium">
                            {player.yellowCards + player.redCards}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600 hidden md:block">
              Showing {startIndex} to {endIndex} of {meta.totalItems}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {meta.totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === meta.totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === meta.totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
