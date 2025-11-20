"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Team } from "@/types/team";
import FootballPitch from "./FootballPitch";
import TeamBoosts, { TeamBoost } from "./TeamBoosts";
import UpcomingFixtures, { Fixture } from "./UpcomingFixtures";

interface MyTeamPageProps {
  team: Team;
  onAppointStarting11: () => void;
}

type TabType = "my-team" | "transfers" | "team-history";
type BoostTabType = "boosts" | "fixtures";

const MyTeamPage: React.FC<MyTeamPageProps> = ({
  team,
  onAppointStarting11,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("my-team");
  const [activeBoostTab, setActiveBoostTab] = useState<BoostTabType>("boosts");

  // Mock data - would come from API
  const boosts: TeamBoost[] = [
    {
      id: "1",
      name: "Maximum Captain",
      description: "Double points for both captain and vice-captain",
      used: false,
    },
    {
      id: "2",
      name: "Triple Captain",
      description: "Triple the points of your captain for one gameweek",
      used: false,
    },
    {
      id: "3",
      name: "Saves Boost",
      description: "Add 3 points per save to the GK for that game week",
      used: false,
    },
  ];

  const fixtures: Fixture[] = [
    {
      id: "1",
      homeTeam: { name: "Nigeria", flag: undefined },
      awayTeam: { name: "Burundi", flag: undefined },
      matchDay: "MD 1",
      date: "Dec 21",
    },
    {
      id: "2",
      homeTeam: { name: "Nigeria", flag: undefined },
      awayTeam: { name: "Burundi", flag: undefined },
      matchDay: "MD 1",
      date: "Dec 21",
    },
    {
      id: "3",
      homeTeam: { name: "Nigeria", flag: undefined },
      awayTeam: { name: "Burundi", flag: undefined },
      matchDay: "MD 1",
      date: "Dec 21",
    },
    {
      id: "4",
      homeTeam: { name: "Nigeria", flag: undefined },
      awayTeam: { name: "Burundi", flag: undefined },
      matchDay: "MD 1",
      date: "Dec 21",
    },
  ];

  const handleUseBoost = (boostId: string) => {
    console.log("Using boost:", boostId);
    // API call would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Team</h1>
          <div className="flex justify-end">
            <div className="px-4 py-2 bg-white border-2 border-red-500 rounded-full">
              <span className="text-red-600 font-semibold">
                ${(team.budget / 1000000).toFixed(1)}M Budget
              </span>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {team.logo ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                {team.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {team.name}
              </h2>
              <div className="mt-1">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {team.points} points
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-200">
              {(["my-team", "transfers", "team-history"] as TabType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "my-team"
                      ? "My Team"
                      : tab === "transfers"
                      ? "Transfers"
                      : "Team History"}
                  </button>
                )
              )}
            </div>
            {/* Appoint Starting 11 Button */}
            {activeTab === "my-team" && (
              <div className="flex justify-center">
                <button
                  onClick={onAppointStarting11}
                  className="px-4 py-1 bg-[#4AA96C] text-white rounded-full font-semibold text-base"
                >
                  Appoint starting 11
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "my-team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Squad Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Football Pitch */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row">
                {/* Squad Management */}
                <div className=" rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Squad Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your starting 11 and assign roles
                  </p>
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">No players selected.</p>
                    <p>Add players to see them here</p>
                  </div>
                </div>
                <FootballPitch />
              </div>
            </div>

            {/* Right Column - Boosts and Fixtures */}
            <div className="space-y-6">
              {/* Boost/Fixture Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex space-x-6 border-b border-gray-200 mb-4">
                  {(["boosts", "fixtures"] as BoostTabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveBoostTab(tab)}
                      className={`pb-3 px-1 font-medium text-sm transition-colors ${
                        activeBoostTab === tab
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab === "boosts" ? "Team Boosts" : "Upcoming Fixtures"}
                    </button>
                  ))}
                </div>

                {activeBoostTab === "boosts" ? (
                  <TeamBoosts boosts={boosts} onUseBoost={handleUseBoost} />
                ) : (
                  <UpcomingFixtures fixtures={fixtures} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transfers Tab */}
        {activeTab === "transfers" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transfers
            </h3>
            <div className="text-center py-8 text-gray-500">
              <p>Transfer functionality coming soon</p>
            </div>
          </div>
        )}

        {/* Team History Tab */}
        {activeTab === "team-history" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Team History
            </h3>
            <div className="text-center py-8 text-gray-500">
              <p>Team history coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeamPage;
