"use client";

import React from "react";
import Image from "next/image";
import { Spinner } from "../common/Spinner";

export interface Fixture {
  id: string;
  homeTeam: {
    name: string;
    flag?: string;
  };
  awayTeam: {
    name: string;
    flag?: string;
  };
  matchDay: string;
  date: string;
}

interface UpcomingFixturesProps {
  fixtures: Fixture[];
  isLoading?: boolean;
}

const UpcomingFixtures: React.FC<UpcomingFixturesProps> = ({
  fixtures,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Fixtures
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-gray-500">
          <Spinner size={24} className="text-[#4AA96C]" />
        </div>
      ) : fixtures.length > 0 ? (
        fixtures.map((fixture) => (
          <div
            key={fixture.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-between"
          >
            <div className="flex items-center space-x-3 flex-1">
              {/* Home Team */}
              <div className="flex justify-end items-center space-x-2 w-[125px] lg:w-[125px] ml-auto">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {fixture.homeTeam.name}
                </span>
                {fixture.homeTeam.flag ? (
                  <Image
                    src={fixture.homeTeam.flag}
                    alt={fixture.homeTeam.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                )}
              </div>

              <span className="text-gray-500 text-sm">vs</span>

              {/* Away Team */}
              <div className="flex justify-start items-center space-x-2 w-[125px] lg:w-[125px] mr-auto">
                {fixture.awayTeam.flag ? (
                  <Image
                    src={fixture.awayTeam.flag}
                    alt={fixture.awayTeam.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                )}
                <span className="text-sm font-medium text-gray-900 truncate">
                  {fixture.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Match Day and Date */}
            <div className="mt-3 w-full justify-between ml-4 flex flex items-end">
              <div className="text-xs text-gray-500 mb-1">
                {fixture.matchDay}
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {fixture.date}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming fixtures</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingFixtures;
