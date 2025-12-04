'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WinnerCarousel from './WinnerCarousel';

interface PastWinner {
  id: string;
  rank: number;
  name: string;
  teamName: string;
  points: number;
  prize: string;
}

interface WinnerEvent {
  id: string;
  title: string;
  year: string;
  photos: Array<{
    id: string;
    image: string;
    alt?: string;
  }>;
}

export default function PastWinners() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const pastWinners: PastWinner[] = [
    {
      id: '1',
      rank: 1,
      name: 'Amadou Diallo',
      teamName: "Desert Fox",
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '2',
      rank: 2,
      name: 'Amadou Diallo',
      teamName: "Black Angels",
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '3',
      rank: 3,
      name: 'Amadou Diallo',
      teamName: "Desert Fox",
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '4',
      rank: 4,
      name: 'Amadou Diallo',
      teamName: "Golden Eagles",
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '5',
      rank: 5,
      name: 'Amadou Diallo',
      teamName: "Golden Eagles",
      points: 847,
      prize: 'N1,000,000'
    }
  ];

  // Separate carousels for different years/events
  const winnerEvents: WinnerEvent[] = [
    {
      id: 'fifa2022',
      title: 'FIFA 2022 Winner',
      year: '2022',
      photos: [
        {
          id: 'fifa2022-1',
          image: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764860176/Image_Container_suog7b.png',
          alt: 'FIFA 2022 Winner - Photo 1'
        },
        {
          id: 'fifa2022-2',
          image: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764274554/Image_Container_1_m97wo9.png',
          alt: 'FIFA 2022 Winner - Photo 2'
        }
      ]
    },
    {
      id: 'afcon2021',
      title: 'AFCON 2021 Winner',
      year: '2021',
      photos: [
        {
          id: 'afcon2021-1',
          image: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764860176/Image_Container_suog7b.png',
          alt: 'AFCON 2021 Winner - Photo 1'
        },
        {
          id: 'afcon2021-2',
          image: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764274554/Image_Container_1_m97wo9.png',
          alt: 'AFCON 2021 Winner - Photo 2'
        }
      ]
    }
  ];

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWinners = pastWinners.slice(startIndex, endIndex);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-[32px] font-semibold text-[#070A11]">
          Past Winners
        </h2>
        <p className="mt-2 text-sm text-[#656E81]">
          A look back at Fantasy11 champions from recent tournaments.
        </p>
      </div>

      {/* Winner Photo Carousels - Side by Side */}
      <div className="mb-4">
        <div
          className="mx-auto flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:max-w-5xl sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 sm:snap-none [&::-webkit-scrollbar]:hidden"
        >
          {winnerEvents.map((event) => (
            <WinnerCarousel
              key={event.id}
              title={event.title}
              photos={event.photos}
              year={event.year}
            />
          ))}
        </div>
      </div>

      {/* Winners List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {currentWinners.map((winner) => (
            <div
              key={winner.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex md:items-center justify-between flex-col md:flex-row gap-4">
                {/* Left: Rank Indicator and Winner Info */}
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                    {winner.rank === 1 ? (
                      <span className="text-white text-xl">👑</span>
                    ) : (
                      <span className="text-white text-xl font-bold">{winner.rank}</span>
                    )}
                  </div>

                  {/* Winner Details */}
                  <div>
                    <h3 className="text-sm text-[#070A11] mb-1">
                      {winner.name}
                    </h3>
                    <p className="text-xs text-[#656E81]">
                      {winner.teamName} – {winner.points} points
                    </p>
                  </div>
                </div>

                {/* Right: Prize Badge */}
                <div className="bg-[#F5EBEB] text-[#800000] px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                  {winner.rank === 1 && '1st Place'}
                  {winner.rank === 2 && '2nd Place'}
                  {winner.rank === 3 && '3rd Place'}
                  {winner.rank === 4 && '4th Place'}
                  {winner.rank === 5 && '5th Place'}
                  {' – '}
                  {winner.prize}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, pastWinners.length)} of {pastWinners.length}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
