"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { LeagueMember, LeagueStats } from "@/types/league";

interface LeagueLeaderboardProps {
  leagueName: string;
  stats: LeagueStats;
  members: LeagueMember[];
  onLeaveLeague: () => void;
  inviteCode?: string;
  isOwner?: boolean;
  leaving?: boolean;
  copying?: boolean;
  onCopyInvite?: () => void;
}

const statIcons = {
  rank: "https://res.cloudinary.com/dmfsyau8s/image/upload/v1764596558/avatar_nm2eui.png",
  points:
    "https://res.cloudinary.com/dmfsyau8s/image/upload/v1765286001/star_gnslsb.png",
  budget:
    "https://res.cloudinary.com/dmfsyau8s/image/upload/v1764597186/wallet-2_eawcda.png",
};

const positionOptions = ["All Positions"];
const countryOptions = ["All Countries"];
const pointsOptions = ["Points", "Goals", "Assists", "Cards"];

const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({
  leagueName,
  stats,
  members,
  inviteCode,
  isOwner = false,
  leaving = false,
  copying = false,
  onCopyInvite,
  onLeaveLeague,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosition, setSelectedPosition] =
    useState<string>("All Positions");
  const [selectedCountry, setSelectedCountry] =
    useState<string>("All Countries");
  const [pointsFilter, setPointsFilter] = useState<string>("Points");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const statCards = useMemo(
    () => [
      {
        label: "League Rank",
        value: `#${stats.globalRank}`,
        icon: statIcons.rank,
      },
      {
        label: "Total Points",
        value: stats.totalPoints.toLocaleString(),
        icon: statIcons.points,
      },
      {
        label: "Budget Left",
        value: stats.budgetLeft,
        icon: statIcons.budget,
      },
    ],
    [stats]
  );

  const filteredMembers = useMemo(() => {
    const matches = members.filter((member) => {
      const matchesSearch =
        member.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.manager.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    const sorted = [...matches].sort((a, b) => {
      switch (pointsFilter) {
        case "Goals":
          return b.goals - a.goals;
        case "Assists":
          return b.assists - a.assists;
        case "Cards":
          return b.cards - a.cards;
        case "Points":
        default:
          return b.totalPoints - a.totalPoints;
      }
    });

    return sorted;
  }, [members, pointsFilter, searchQuery]);

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderRankBadge = (rank: number) => {
    const isTopThree = rank <= 3;
    const baseClasses =
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold";

    if (isTopThree) {
      const colors = ["bg-[#800000]", "bg-[#A23B3B]", "bg-[#C25C5C]"];
      return (
        <div
          className={`${baseClasses} text-white ${
            colors[rank - 1] ?? colors[2]
          }`}
        >
          {rank}
        </div>
      );
    }

    return (
      <div
        className={`${baseClasses} bg-[#F5EBEB] text-[#800000] border border-[#F1F2F4]`}
      >
        <Crown className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 h-8 w-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-semibold">
              {leagueName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-medium text-[#070A11] leading-tight">
                {leagueName}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 sm:gap-12">
            {inviteCode && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#070A11] font-mono bg-gray-100 px-3 py-1 rounded-full">
                  {inviteCode}
                </span>
                <button
                  onClick={onCopyInvite}
                  className="text-xs font-semibold text-[#4AA96C] hover:text-[#3c8b58] transition-colors"
                  disabled={!onCopyInvite}
                >
                  {copying ? "Copied" : "Copy"}
                </button>
              </div>
            )}

            {!isOwner && (
              <button
                onClick={onLeaveLeague}
                disabled={leaving}
                className={`rounded-full h-9 px-4 text-sm font-semibold text-white transition-colors ${
                  leaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#4AA96C]"
                }`}
              >
                {leaving ? "Leaving..." : "Leave League"}
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <div className="flex gap-8 overflow-x-auto pb-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="border border-[#F1F2F4] p-2 rounded-2xl w-[432px]"
              >
                <div className="flex items-center gap-3 p-3">
                  <Image
                    src={card.icon}
                    alt={card.label}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="text-sm text-[#656E81]">{card.label}</span>
                </div>
                <div className="relative min-w-[280px] max-w-[420px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#F5EBEB] via-white to-[#F5EBEB] shadow-sm">
                  <div className="relative flex items-center justify-between px-5 py-6">
                    <span className="text-3xl font-medium text-[#800000]">
                      {card.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F1F2F4] p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#070A11] mb-1">
              Leaderboard
            </h2>
            <p className="text-sm text-[#656E81]">
              Fantasy League - {members.length} teams
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A6B1]" />
              <input
                type="text"
                placeholder="Search players or teams..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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

            <div className="flex w-full flex-wrap gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <div className="relative w-full sm:w-40">
                <select
                  value={selectedPosition}
                  onChange={(e) => {
                    setSelectedPosition(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-4 pr-10 text-sm text-[#070A11] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                >
                  {positionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8395]" />
              </div>

              <div className="relative w-full sm:w-40">
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-4 pr-10 text-sm text-[#070A11] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                >
                  {countryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8395]" />
              </div>

              <div className="relative w-full sm:w-40">
                <select
                  aria-label="Sort by"
                  value={pointsFilter}
                  onChange={(e) => {
                    setPointsFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-4 pr-10 text-sm text-[#070A11] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                >
                  {pointsOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8395]" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Manager
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Total Points
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Match Day Points
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Cleansheet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Goals
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Assists
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#656E81] uppercase">
                    Cards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F2F4]">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {renderRankBadge(member.rank)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#070A11]">
                      {member.team}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[#656E81]">
                      {member.manager}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5EBEB] text-sm font-medium text-[#800000]">
                        {member.totalPoints}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F1F2F4] text-sm font-medium text-[#070A11]">
                        {member.matchDayPoints}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[#070A11]">
                      {member.cleansheet}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#FE5E41]">
                      {member.goals}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#4961B9]">
                      {member.assists}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#0EC76A]">
                      {member.cards}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-6 pt-4 border-t border-[#F1F2F4]">
            <div className="text-sm text-[#656E81]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{" "}
              {filteredMembers.length} teams
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-[#070A11] bg-white border border-[#D4D7DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="px-4 py-2 text-sm text-[#070A11]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-[#070A11] bg-white border border-[#D4D7DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
