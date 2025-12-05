// 'use client';

// import React, { useState } from 'react';
// import {
//   ChooseLeagueModal,
//   CreateLeagueModal,
//   JoinLeagueModal,
//   LeaveLeagueModal,
//   LeagueLeaderboard,
//   ChampionshipPage,
// } from '@/components/league';
// import { LeagueMember, LeagueStats, ChampionshipDetails, LeagueOption } from '@/types/league';

// // Mock data - replace with actual API calls
// const mockLeagueStats: LeagueStats = {
//   globalRank: 1,
//   totalPoints: 1058,
//   budgetLeft: '₦94.4M',
// };

// const mockLeagueMembers: LeagueMember[] = [
//   {
//     id: '1',
//     rank: 1,
//     team: 'Chullz ligaaaa',
//     manager: 'Sefu Juma',
//     totalPoints: 127,
//     matchDayPoints: 91,
//     budget: '$12.5M',
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
//     matchDayPoints: 85,
//     budget: '$11M',
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
//     matchDayPoints: 53,
//     budget: '$9.5M',
//     cleansheet: 4,
//     goals: 4,
//     assists: 6,
//     cards: 2,
//   },
//   {
//     id: '4',
//     rank: 4,
//     team: 'Super Eagles FC',
//     manager: 'Kwame Nkrumah',
//     totalPoints: 42,
//     matchDayPoints: 76,
//     budget: '$10.5M',
//     cleansheet: 8,
//     goals: 8,
//     assists: 2,
//     cards: 1,
//   },
//   {
//     id: '5',
//     rank: 5,
//     team: 'Lions of Teranga',
//     manager: 'Nia Chike',
//     totalPoints: 76,
//     matchDayPoints: 68,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '6',
//     rank: 6,
//     team: 'Atlas Lions',
//     manager: 'Fatoumata Sow',
//     totalPoints: 53,
//     matchDayPoints: 48,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '7',
//     rank: 7,
//     team: 'Thunder FC',
//     manager: 'Lamine Diop',
//     totalPoints: 29,
//     matchDayPoints: 42,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '8',
//     rank: 8,
//     team: 'Sahara Storm',
//     manager: 'Zuri Mwanga',
//     totalPoints: 67,
//     matchDayPoints: 34,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '9',
//     rank: 9,
//     team: 'Nile Warriors',
//     manager: 'Kofi Mensah',
//     totalPoints: 58,
//     matchDayPoints: 27,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
//   {
//     id: '10',
//     rank: 10,
//     team: 'Tiger Teeth',
//     manager: 'Tunde Adebayo',
//     totalPoints: 88,
//     matchDayPoints: 19,
//     budget: '$7.5M',
//     cleansheet: 2,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//   },
// ];

// const mockChampionshipDetails: ChampionshipDetails = {
//   totalPrizePool: '₦1,000,000',
//   activeManagers: '2.4M+',
//   winnerPrize: '₦1,000,000',
//   entryFee: 'FREE',
// };

// export default function LeaguePage() {
//   const [showChooseModal, setShowChooseModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<LeagueOption | null>(null);
//   const [currentView, setCurrentView] = useState<'championship' | 'leaderboard'>('championship');
//   const [currentLeague, setCurrentLeague] = useState<string | null>(null);

//   const handleChooseOption = (option: LeagueOption) => {
//     setSelectedOption(option);
//   };

//   const handleContinue = () => {
//     if (!selectedOption) return;

//     setShowChooseModal(false);

//     if (selectedOption === 'create') {
//       setShowCreateModal(true);
//     } else if (selectedOption === 'join') {
//       setShowJoinModal(true);
//     } else if (selectedOption === 'championship') {
//       // Join the global championship
//       console.log('Joining global championship');
//       // API call to join championship would go here
//       setCurrentView('leaderboard');
//       setCurrentLeague('Fantasy Global League');
//     }
//   };

//   const handleCreateLeague = (leagueName: string) => {
//     // API call to create league
//     console.log('Creating league:', leagueName);
//     setShowCreateModal(false);
//     setCurrentLeague(leagueName);
//     setCurrentView('leaderboard');
//   };

//   const handleJoinLeague = (code: string) => {
//     // API call to join league
//     console.log('Joining league with code:', code);
//     // Mock: fetch league details
//     const mockLeagueDetails = {
//       name: 'Lion Champs',
//       members: '12/50',
//       admin: 'Ahmed Hassan',
//     };
//     // In real app, this would come from API response
//     setShowJoinModal(false);
//     setCurrentLeague(mockLeagueDetails.name);
//     setCurrentView('leaderboard');
//   };

//   const handleEnterChampionship = () => {
//     // Open the Choose League modal when Enter Championship is clicked
//     setShowChooseModal(true);
//   };

//   const handleLeaveLeague = () => {
//     // API call to leave league
//     setShowLeaveModal(false);
//     setCurrentLeague(null);
//     setCurrentView('championship');
//   };

//   // Show championship page by default if no league is selected
//   // User can click "Enter Championship" or use the choose modal to create/join a league

//   return (
//     <>
//       {currentView === 'championship' && !currentLeague && (
//         <ChampionshipPage
//           details={mockChampionshipDetails}
//           onEnterChampionship={handleEnterChampionship}
//         />
//       )}

//       {currentView === 'leaderboard' && currentLeague && (
//         <LeagueLeaderboard
//           leagueName={currentLeague}
//           stats={mockLeagueStats}
//           members={mockLeagueMembers}
//           onLeaveLeague={() => setShowLeaveModal(true)}
//         />
//       )}

//       {/* Modals */}
//       <ChooseLeagueModal
//         isOpen={showChooseModal}
//         onClose={() => {
//           setShowChooseModal(false);
//           setSelectedOption(null);
//         }}
//         selectedOption={selectedOption}
//         onSelectOption={handleChooseOption}
//         onContinue={handleContinue}
//       />

//       <CreateLeagueModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onCreateLeague={handleCreateLeague}
//       />

//       <JoinLeagueModal
//         isOpen={showJoinModal}
//         onClose={() => setShowJoinModal(false)}
//         onJoinLeague={handleJoinLeague}
//         leagueDetails={
//           showJoinModal
//             ? {
//                 name: 'Lion Champs',
//                 members: '12/50',
//                 admin: 'Ahmed Hassan',
//               }
//             : null
//         }
//       />

//       <LeaveLeagueModal
//         isOpen={showLeaveModal}
//         onClose={() => setShowLeaveModal(false)}
//         onConfirmLeave={handleLeaveLeague}
//         leagueType={currentLeague === 'Fantasy Global League' ? 'global' : 'private'}
//       />
//     </>
//   );
// }

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LeaguePage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764948169/CominSoonBlue_b9r5cs.png"
          alt="Coming Soon"
          width={350}
          height={350}
        />
        <Link
          href="/predictor"
          className="bg-[#4AA96C] text-sm inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
        >
          Play Our Predictor Now
        </Link>
      </div>
    </div>
  );
}
