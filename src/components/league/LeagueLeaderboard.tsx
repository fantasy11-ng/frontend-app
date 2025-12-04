'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import Image from 'next/image';
import { LeagueMember, LeagueStats } from '@/types/league';

interface LeagueLeaderboardProps {
  leagueName: string;
  stats: LeagueStats;
  members: LeagueMember[];
  onLeaveLeague: () => void;
}

const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({
  leagueName,
  stats,
  members,
  onLeaveLeague,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [pointsFilter, setPointsFilter] = useState<string>('points');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.manager.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
          {rank}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">League - {leagueName}</h1>
          <button
            onClick={onLeaveLeague}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Leave League
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
            <div className="flex items-center space-x-3 mb-2">
              <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Trophy" width={24} height={24} className="w-6 h-6" />
              <span className="text-sm font-medium text-gray-700">Global Rank</span>
            </div>
            <div className="text-3xl font-bold text-red-500">#{stats.globalRank}</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Total Points</span>
            </div>
            <div className="text-3xl font-bold text-red-500">{stats.totalPoints.toLocaleString()}</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Budget Left</span>
            </div>
            <div className="text-3xl font-bold text-red-500">{stats.budgetLeft}</div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Global Leaderboard</h2>
            <p className="text-sm text-gray-600">Fantasy Global League - {members.length} teams</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search players or teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="all">Position</option>
                </select>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="all">Country</option>
                </select>
                <select
                  value={pointsFilter}
                  onChange={(e) => setPointsFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="points">Points</option>
                  <option value="goals">Goals</option>
                  <option value="assists">Assists</option>
                  <option value="cards">Cards</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Team</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Manager</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Points</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Match Day Points</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cleansheet</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Goals</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assists</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cards</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      {getRankIcon(member.rank)}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{member.team}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{member.manager}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {member.totalPoints}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {member.matchDayPoints}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{member.budget}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{member.cleansheet}</td>
                    <td className="py-4 px-4 text-sm text-red-600 font-medium">{member.goals}</td>
                    <td className="py-4 px-4 text-sm text-blue-600 font-medium">{member.assists}</td>
                    <td className="py-4 px-4 text-sm text-green-600 font-medium">{member.cards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 hidden md:block">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} teams
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueLeaderboard;

