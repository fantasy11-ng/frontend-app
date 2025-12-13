'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, Crown } from 'lucide-react';
import { AthleteRanking, SortField, SortDirection } from '@/types/ranking';

interface AthleteRankingsTableProps {
  rankings: AthleteRanking[];
}

export default function AthleteRankingsTable({ rankings }: AthleteRankingsTableProps) {
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
      case 'points':
        aValue = a.points;
        bValue = b.points;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <div className="w-5 h-5 rounded-full bg-[#800000] flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold">{ranking.rank}</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#800000] flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[#070A11] text-sm">{ranking.player}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#070A11]">{ranking.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm">
                    {ranking.points}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#070A11]">
                  {ranking.cleansheet}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#FE5E41]">
                  {ranking.goals}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#4961B9]">
                  {ranking.assists}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#0EC76A]">
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

