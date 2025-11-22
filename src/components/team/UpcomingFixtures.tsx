'use client';

import React from 'react';
import Image from 'next/image';

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
}

const UpcomingFixtures: React.FC<UpcomingFixturesProps> = ({ fixtures }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Fixtures</h3>

      {fixtures.length > 0 ? (
        fixtures.map((fixture) => (
          <div
            key={fixture.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 flex-1">
              {/* Home Team */}
              <div className="flex items-center space-x-2">
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
                <span className="text-sm font-medium text-gray-900">{fixture.homeTeam.name}</span>
              </div>

              <span className="text-gray-500 text-sm">vs</span>

              {/* Away Team */}
              <div className="flex items-center space-x-2">
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
                <span className="text-sm font-medium text-gray-900">{fixture.awayTeam.name}</span>
              </div>

            </div>

            {/* Match Day and Date */}
            <div className="ml-4 flex flex-col items-end">
              <div className="text-xs text-gray-500 mb-1">{fixture.matchDay}</div>
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

