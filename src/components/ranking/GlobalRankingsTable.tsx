'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobalRanking, SortField, SortDirection } from '@/types/ranking';

interface GlobalRankingsTableProps {
  rankings: GlobalRanking[];
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const DEFAULT_ITEMS_PER_PAGE = 50;

export default function GlobalRankingsTable({
  rankings,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  currentPage = 1,
  totalPages,
  totalItems,
  onPageChange,
}: GlobalRankingsTableProps) {
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

  const computedTotalPages =
    totalPages ??
    (totalItems ? Math.max(1, Math.ceil(totalItems / itemsPerPage)) : Math.max(1, Math.ceil(sortedRankings.length / itemsPerPage)));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRankings = sortedRankings;
  const totalCount = totalItems ?? (totalPages ? totalPages * itemsPerPage : displayedRankings.length);

  const goToPage = (page: number) => {
    if (!onPageChange) return;
    if (page >= 1 && page <= computedTotalPages) {
      onPageChange(page);
    }
  };

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
            {displayedRankings.map((ranking, index) => {
              const displayRank = startIndex + index + 1;
              return (
              <tr key={ranking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    displayRank <= 3 ? 'bg-[#800000]' : 'bg-[#F1F2F4]'
                  }`}>
                    <span className={`text-[11px] font-semibold ${
                      displayRank <= 3 ? 'text-white' : 'text-[#656E81]'
                    }`}>
                      {displayRank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[#070A11] text-sm">{ranking.team}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#070A11]">{ranking.manager}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm">
                    {ranking.totalPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#070A11]">
                  {ranking.cleansheet}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#FE5E41] font-medium">
                  {ranking.goals}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#4961B9] font-medium">
                  {ranking.assists}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-[#0EC76A] font-medium">
                  {ranking.cards}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {computedTotalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F2F4]">
          <div className="text-sm text-[#656E81]">
            Showing {startIndex + 1} - {Math.min(startIndex + displayedRankings.length, totalCount)} of {totalCount} teams
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                currentPage === 1
                  ? 'border-[#F1F2F4] text-[#D4D7DD] cursor-not-allowed'
                  : 'border-[#D4D7DD] text-[#656E81] hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: computedTotalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and adjacent pages
                const showPage = 
                  page === 1 || 
                  page === computedTotalPages || 
                  Math.abs(page - currentPage) <= 1;
                
                const showEllipsis = 
                  (page === 2 && currentPage > 3) || 
                  (page === computedTotalPages - 1 && currentPage < computedTotalPages - 2);

                if (!showPage && !showEllipsis) return null;

                if (showEllipsis && !showPage) {
                  return (
                    <span key={page} className="px-2 text-[#656E81]">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-[#4AA96C] text-white'
                        : 'text-[#656E81] hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === computedTotalPages}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                currentPage === computedTotalPages
                  ? 'border-[#F1F2F4] text-[#D4D7DD] cursor-not-allowed'
                  : 'border-[#D4D7DD] text-[#656E81] hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

