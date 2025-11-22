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

  return (
    <div className="space-y-6">
      {/* Title and Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Top 10 Players of the season
        </h2>
        <p className="text-gray-600">
          Comprehensive performance statistics for AFCON 2025's top performers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-4 px-1 text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'text-gray-900 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Performance Stats
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 px-1 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-gray-900 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Players Details
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md ml-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players or teams..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowPositionFilter(!showPositionFilter);
              setShowCountryFilter(false);
              setShowPointsFilter(false);
            }}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-sm text-gray-700">{selectedPosition}</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          {showPositionFilter && (
            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
              <div className="p-2">
                {positions.map((position) => (
                  <button
                    key={position}
                    onClick={() => {
                      setSelectedPosition(position);
                      setShowPositionFilter(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
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
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-sm text-gray-700">{selectedCountry}</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          {showCountryFilter && (
            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64 max-h-96 overflow-y-auto">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
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
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-sm text-gray-700">{selectedPointsFilter}</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          {showPointsFilter && (
            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
              <div className="p-2">
                {['Points', 'Goals', 'Assists', 'Cards'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedPointsFilter(filter);
                      setShowPointsFilter(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No Results Message */}
      {filteredPlayers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Oops! It looks like we couldn't find any results for "{searchQuery}". Try searching for something else!
          </p>
        </div>
      )}

      {/* Table */}
      {filteredPlayers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                      <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                        <span className="text-white font-bold">{player.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.country}</div>
                      </div>
                    </td>
                    {activeTab === 'performance' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {player.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-red-700 text-white rounded-full text-xs font-bold">
                            {player.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.goals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                            {player.cards}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.club}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.height}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {player.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
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

