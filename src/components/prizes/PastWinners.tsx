'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WinnerCarousel from './WinnerCarousel';

interface PastWinner {
  id: string;
  rank: number;
  name: string;
  accuracy: number;
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
      accuracy: 94,
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '2',
      rank: 2,
      name: 'Amadou Diallo',
      accuracy: 94,
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '3',
      rank: 3,
      name: 'Amadou Diallo',
      accuracy: 94,
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '4',
      rank: 4,
      name: 'Amadou Diallo',
      accuracy: 94,
      points: 847,
      prize: 'N1,000,000'
    },
    {
      id: '5',
      rank: 5,
      name: 'Amadou Diallo',
      accuracy: 94,
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
          image: '/img1.png',
          alt: 'FIFA 2022 Winner - Photo 1'
        },
        {
          id: 'fifa2022-2',
          image: '/img2.png',
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
          image: '/img1.png',
          alt: 'AFCON 2021 Winner - Photo 1'
        },
        {
          id: 'afcon2021-2',
          image: '/img2.png',
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
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Past Winners</h2>

      {/* Winner Photo Carousels - Side by Side */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {winnerEvents.map((event) => (
            <div key={event.id}>
              <WinnerCarousel
                title={event.title}
                photos={event.photos}
                year={event.year}
              />
            </div>
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
              <div className="flex items-center justify-between">
                {/* Left: Rank Indicator and Winner Info */}
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {winner.rank === 1 ? (
                      <span className="text-white text-xl">👑</span>
                    ) : (
                      <span className="text-white text-xl font-bold">{winner.rank}</span>
                    )}
                  </div>

                  {/* Winner Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {winner.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {winner.accuracy}% accuracy – {winner.points} points
                    </p>
                  </div>
                </div>

                {/* Right: Prize Badge */}
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
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
