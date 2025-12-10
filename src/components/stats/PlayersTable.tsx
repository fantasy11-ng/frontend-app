'use client';

import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Player } from '@/types/stats';

interface PlayersTableProps {
  players: Player[];
}

type TabType = 'performance' | 'details';

export default function PlayersTable({ players }: PlayersTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>('performance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [showPointsFilter, setShowPointsFilter] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('All Positions');
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [selectedPointsFilter, setSelectedPointsFilter] = useState<string>('Points');

  const positions = ['All Positions', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Wingback', 'Sweeper'];
  const countries = [
    'All Countries',
    'Morocco',
    'Mali',
    'Zambia',
    'Comoros',
    'Egypt',
    'South Africa',
    'Angola',
    'Zimbabwe',
    'Nigeria',
    'Tunisia',
    'Uganda',
    'Senegal',
    'DR Congo',
    'Benin',
    'Algeria',
    'Burkina Faso',
    'Equatorial Guinea',
    'Sudan',
    'Cote D\'Ivoire',
    'Cameroon',
    'Gabon',
    'Mozambique',
    'Tanzania',
    'Botswana',
    'Rwanda',
  ];

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPosition = selectedPosition === 'All Positions' || player.position === selectedPosition;
    const matchesCountry = selectedCountry === 'All Countries' || player.country === selectedCountry;

    return matchesSearch && matchesPosition && matchesCountry;
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  const positionLabel = selectedPosition === 'All Positions' ? 'Position' : selectedPosition;
  const countryLabel = selectedCountry === 'All Countries' ? 'Country' : selectedCountry;
  const pointsLabel = selectedPointsFilter === 'Points' ? 'Points' : selectedPointsFilter;

  return (
    <div className="space-y-6 mt-6">
      {/* Title and Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-[#070A11] mb-1">
          Top 10 Players of the season
        </h2>
        <p className="text-sm text-[#656E81]">
          Comprehensive performance statistics for AFCON 2025&apos;s top performers
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
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-[#070A11] border-b-4 border-[#4AA96C]'
                : 'text-[#656E81] hover:text-[#070A11]'
            }`}
          >
            Players Details
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex w-full flex-col md:flex-row gap-3 sm:w-auto sm:items-center sm:justify-end sm:gap-3 xl:gap-4">
          <div className="relative w-full lg:w-72 flex items-center">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A6B1]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players or teams..."
              className="rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-11 pr-11 text-sm text-[#070A11] placeholder:text-[#A0A6B1] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
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

          <div className="flex w-full gap-2 sm:flex-row flex-wrap sm:justify-end sm:gap-3">
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
                        onClick={() => {
                          setSelectedPosition(position);
                          setShowPositionFilter(false);
                        }}
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
                }}
                className="flex items-center rounded-lg border border-[#D4D7DD] px-4 py-2 text-sm text-[#070A11] transition hover:border-[#4AA96C]"
              >
                <span>{countryLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-[#7C8395]" />
              </button>
              {showCountryFilter && (
                <div className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl z-10">
                  <div className="border-b border-gray-200 p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                      />
                    </div>
                  </div>
                  <div className="p-2">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryFilter(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {country}
                      </button>
                    ))}
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
                    {['Points', 'Goals', 'Assists', 'Cards'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedPointsFilter(filter);
                          setShowPointsFilter(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* No Results Message */}
      {filteredPlayers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Oops! It looks like we couldn&apos;t find any results for &quot;{searchQuery}&quot;. Try searching for something else!
          </p>
        </div>
      )}

      {/* Table */}
      {filteredPlayers.length > 0 && (
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
                  {activeTab === 'performance' ? (
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
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Club
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Height
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Index
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-4 h-4 rounded-full bg-[#800000] flex items-center justify-center">
                        <span className="text-white font-semibold text-[10px]">{player.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-[#070A11] text-sm">{player.name}</div>
                      </div>
                    </td>
                    {activeTab === 'performance' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 border border-[#D4D7DD] text-[#656E81] rounded-full text-sm">
                            {player.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.price}
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
                            {player.cards}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.club}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.height}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#070A11]">
                          {player.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm">
                            {player.index}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

