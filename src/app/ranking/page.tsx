// 'use client';

// import { useState } from 'react';
// import GlobalRankingsTable from '@/components/ranking/GlobalRankingsTable';
// import AthleteRankingsTable from '@/components/ranking/AthleteRankingsTable';
// import { GlobalRanking, AthleteRanking } from '@/types/ranking';

// // Mock data - replace with actual API call
// const mockGlobalRankings: GlobalRanking[] = [
//   {
//     id: '1',
//     rank: 1,
//     team: 'Chullz ligaaaa',
//     manager: 'Sefu Juma',
//     totalPoints: 127,
//     cleansheet: 7,
//     goals: 7,
//     assists: 4,
//     cards: 1,
//   },
//   {
//     id: '2',
//     rank: 2,
//     team: 'Desert Warriors',
//     manager: 'Amina Diallo',
//     totalPoints: 114,
//     cleansheet: 6,
//     goals: 6,
//     assists: 5,
//     cards: 0,
//   },
//   {
//     id: '3',
//     rank: 3,
//     team: "Pharaoh's XI",
//     manager: 'Juma Karanja',
//     totalPoints: 109,
//     cleansheet: 4,
//     goals: 4,
//     assists: 6,
//     cards: 2,
//   },
//   {
//     id: '4',
//     rank: 4,
//     team: 'Super Eagles FC',
//     manager: 'Kwame Asante',
//     totalPoints: 42,
//     cleansheet: 8,
//     goals: 8,
//     assists: 2,
//     cards: 1,
//   },
//   {
//     id: '5',
//     rank: 5,
//     team: 'Lions of Teranga',
//     manager: 'Fatima Ndiaye',
//     totalPoints: 76,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '6',
//     rank: 6,
//     team: 'Atlas Lions',
//     manager: 'Hassan Alami',
//     totalPoints: 53,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '7',
//     rank: 7,
//     team: 'Carthage Eagles',
//     manager: 'Sami Trabelsi',
//     totalPoints: 29,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '8',
//     rank: 8,
//     team: 'Indomitable Lions',
//     manager: 'Paul Biya',
//     totalPoints: 67,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '9',
//     rank: 9,
//     team: 'Black Stars',
//     manager: 'Kofi Mensah',
//     totalPoints: 58,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '10',
//     rank: 10,
//     team: 'Bafana Bafana',
//     manager: 'Thabo Mbeki',
//     totalPoints: 88,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
// ];

// const mockAthleteRankings: AthleteRanking[] = [
//   {
//     id: '1',
//     rank: 1,
//     player: 'Mohammed Salah',
//     country: 'Egypt',
//     points: 127,
//     cleansheet: 7,
//     goals: 7,
//     assists: 4,
//     cards: 1,
//   },
//   {
//     id: '2',
//     rank: 2,
//     player: 'Sadio Mané',
//     country: 'Senegal',
//     points: 114,
//     cleansheet: 6,
//     goals: 6,
//     assists: 5,
//     cards: 0,
//   },
//   {
//     id: '3',
//     rank: 3,
//     player: 'Riyad Mahrez',
//     country: 'Algeria',
//     points: 109,
//     cleansheet: 4,
//     goals: 4,
//     assists: 6,
//     cards: 2,
//   },
//   {
//     id: '4',
//     rank: 4,
//     player: 'Victor Osimhen',
//     country: 'Nigeria',
//     points: 91,
//     cleansheet: 8,
//     goals: 8,
//     assists: 2,
//     cards: 1,
//   },
//   {
//     id: '5',
//     rank: 5,
//     player: 'Achraf Hakimi',
//     country: 'Morocco',
//     points: 84,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '6',
//     rank: 6,
//     player: 'Amadou Diallo',
//     country: 'Morocco',
//     points: 78,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '7',
//     rank: 7,
//     player: 'Hakim Ziyech',
//     country: 'Morocco',
//     points: 69,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '8',
//     rank: 8,
//     player: 'Samuel Chukwueze',
//     country: 'Morocco',
//     points: 72,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '9',
//     rank: 9,
//     player: 'Mohammed Kudus',
//     country: 'Morocco',
//     points: 65,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '10',
//     rank: 10,
//     player: 'Ilias Chair',
//     country: 'Morocco',
//     points: 87,
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
// ];

// type TabType = 'global' | 'athlete';

// export default function RankingPage() {
//   const [activeTab, setActiveTab] = useState<TabType>('global');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-[1440px] mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Ranking</h1>
//         </div>

//         {/* Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-8 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('global')}
//               className={`pb-4 px-1 text-sm font-medium transition-colors ${
//                 activeTab === 'global'
//                   ? 'text-gray-900 border-b-2 border-green-500'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Global Rankings
//             </button>
//             <button
//               onClick={() => setActiveTab('athlete')}
//               className={`pb-4 px-1 text-sm font-medium transition-colors ${
//                 activeTab === 'athlete'
//                   ? 'text-gray-900 border-b-2 border-green-500'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Athlete Rankings
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div>
//           {activeTab === 'global' && (
//             <GlobalRankingsTable rankings={mockGlobalRankings} />
//           )}
//           {activeTab === 'athlete' && (
//             <AthleteRankingsTable rankings={mockAthleteRankings} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react'

export default function RankingPage() {
  return (
    <div>Coming Soon</div>
  )
}
