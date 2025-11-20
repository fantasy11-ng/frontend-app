'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, Crown } from 'lucide-react';
import { GlobalRanking, SortField, SortDirection } from '@/types/ranking';

interface GlobalRankingsTableProps {
  rankings: GlobalRanking[];
}

export default function GlobalRankingsTable({ rankings }: GlobalRankingsTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or clear
      if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    if (!sortField || !sortDirection) return a.rank - b.rank;

    let aValue: number;
    let bValue: number;

    switch (sortField) {
      case 'totalPoints':
        aValue = a.totalPoints;
        bValue = b.totalPoints;
        break;
      case 'cleansheet':
        aValue = a.cleansheet;
        bValue = b.cleansheet;
        break;
      case 'goals':
        aValue = a.goals;
        bValue = b.goals;
        break;
      case 'assists':
        aValue = a.assists;
        bValue = b.assists;
        break;
      case 'cards':
        aValue = a.cards;
        bValue = b.cards;
        break;
      default:
        return a.rank - b.rank;
    }

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
    return <ArrowDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Points
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('cleansheet')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-700"
                >
                  <span>Cleansheet</span>
                  {getSortIcon('cleansheet')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('goals')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-700"
                >
                  <span>Goals</span>
                  {getSortIcon('goals')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('assists')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-700"
                >
                  <span>Assists</span>
                  {getSortIcon('assists')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('cards')}
                  className="flex items-center justify-end space-x-1 hover:text-gray-700"
                >
                  <span>Cards</span>
                  {getSortIcon('cards')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRankings.map((ranking) => (
              <tr key={ranking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {ranking.rank <= 3 ? (
                    <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                      <span className="text-white font-bold">{ranking.rank}</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{ranking.team}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ranking.manager}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    {ranking.totalPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {ranking.cleansheet}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                  {ranking.goals}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">
                  {ranking.assists}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                  {ranking.cards}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

