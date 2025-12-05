// 'use client';

// import React, { useEffect, useState } from 'react';
// import EmptyTeamState from '@/components/team/EmptyTeamState';
// import CreateTeamModal from '@/components/team/CreateTeamModal';
// import MyTeamPage from '@/components/team/MyTeamPage';
// import { Team, Player } from '@/types/team';

// // Mock players data - would come from API
// const mockPlayers: Player[] = [
//   {
//     id: '1',
//     name: 'Mohammed Salah',
//     position: 'FWD',
//     country: 'Egypt',
//     countryFlag: '🇪🇬',
//     price: 10000000,
//     points: 127,
//     goals: 7,
//     assists: 4,
//     cards: 1,
//     age: 31,
//     height: '175cm',
//     weight: '75kg',
//     index: 127,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '2',
//     name: 'Sadio Mané',
//     position: 'FWD',
//     country: 'Senegal',
//     countryFlag: '🇸🇳',
//     price: 8000000,
//     points: 114,
//     goals: 6,
//     assists: 5,
//     cards: 0,
//     age: 31,
//     height: '175cm',
//     weight: '69kg',
//     index: 114,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '3',
//     name: 'Riyad Mahrez',
//     position: 'MID',
//     country: 'Algeria',
//     countryFlag: '🇩🇿',
//     price: 7500000,
//     points: 109,
//     goals: 4,
//     assists: 6,
//     cards: 2,
//     age: 32,
//     height: '179cm',
//     weight: '61kg',
//     index: 109,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '4',
//     name: 'Victor Osimhen',
//     position: 'FWD',
//     country: 'Nigeria',
//     countryFlag: '🇳🇬',
//     price: 7500000,
//     points: 91,
//     goals: 8,
//     assists: 2,
//     cards: 1,
//     age: 25,
//     height: '185cm',
//     weight: '70kg',
//     index: 77,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '5',
//     name: 'Achraf Hakimi',
//     position: 'MID',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5500000,
//     points: 95,
//     goals: 3,
//     assists: 4,
//     cards: 1,
//     age: 25,
//     height: '181cm',
//     weight: '73kg',
//     index: 95,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '6',
//     name: 'Amadou Diallo',
//     position: 'MID',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5500000,
//     points: 88,
//     goals: 2,
//     assists: 5,
//     cards: 0,
//     age: 24,
//     height: '178cm',
//     weight: '70kg',
//     index: 88,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '7',
//     name: 'Hakim Ziyech',
//     position: 'MID',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5500000,
//     points: 85,
//     goals: 3,
//     assists: 3,
//     cards: 1,
//     age: 30,
//     height: '180cm',
//     weight: '65kg',
//     index: 85,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '8',
//     name: 'Samuel Chukwueze',
//     position: 'DEF',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5500000,
//     points: 82,
//     goals: 1,
//     assists: 2,
//     cards: 2,
//     age: 24,
//     height: '175cm',
//     weight: '68kg',
//     index: 82,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '9',
//     name: 'Mohammed Kudus',
//     position: 'DEF',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5500000,
//     points: 80,
//     goals: 1,
//     assists: 1,
//     cards: 1,
//     age: 23,
//     height: '177cm',
//     weight: '70kg',
//     index: 80,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '10',
//     name: 'Ilias Chair',
//     position: 'DEF',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 2500000,
//     points: 78,
//     goals: 0,
//     assists: 3,
//     cards: 0,
//     age: 26,
//     height: '172cm',
//     weight: '65kg',
//     index: 78,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '11',
//     name: 'David De Gea',
//     position: 'GK',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5000000,
//     points: 75,
//     goals: 0,
//     assists: 0,
//     cards: 0,
//     age: 33,
//     height: '192cm',
//     weight: '82kg',
//     index: 75,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '12',
//     name: 'Onana',
//     position: 'GK',
//     country: 'Cameroon',
//     countryFlag: '🇲🇦',
//     price: 5000000,
//     points: 75,
//     goals: 0,
//     assists: 0,
//     cards: 0,
//     age: 33,
//     height: '192cm',
//     weight: '82kg',
//     index: 75,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '13',
//     name: 'Edouard Mendy',
//     position: 'DEF',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5000000,
//     points: 75,
//     goals: 0,
//     assists: 0,
//     cards: 0,
//     age: 33,
//     height: '192cm',
//     weight: '82kg',
//     index: 75,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '14',
//     name: 'Aissa Mandi',
//     position: 'DEF',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     price: 5000000,
//     points: 75,
//     goals: 0,
//     assists: 0,
//     cards: 0,
//     age: 33,
//     height: '192cm',
//     weight: '82kg',
//     index: 75,
//     rating: 83,
//     selected: false,
//   },
//   {
//     id: '15',
//     name: 'Bryan Mbeumo',
//     position: 'MID',
//     country: 'Cameroon',
//     countryFlag: '🇨🇲',
//     price: 5000000,
//     points: 75,
//     goals: 0,
//     assists: 0,
//     cards: 0,
//     age: 33,
//     height: '192cm',
//     weight: '82kg',
//     index: 75,
//     rating: 83,
//     selected: false,
//   },
// ];

// export default function TeamPage() {
//   const [hasTeam, setHasTeam] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [team, setTeam] = useState<Team | null>(null);

//   const handleCreateTeam = () => {
//     setShowCreateModal(true);
//   };

//   const handleCreateTeamSubmit = (teamName: string, logo?: File) => {
//     // Here you would make an API call to create the team
//     // For now, we'll create a mock team
//     const newTeam: Team = {
//       id: '1',
//       name: teamName,
//       logo: logo ? URL.createObjectURL(logo) : undefined,
//       points: 0,
//       budget: 100000000, // $100M (FPL standard)
//       manager: 'Current User', // Would come from auth context
//     };

//     setTeam(newTeam);
//     setHasTeam(true);
//     setShowCreateModal(false);
//   };

//   // Ensure budget is always 100M if team exists
//   useEffect(() => {
//     if (team && team.budget !== 100000000) {
//       setTeam({ ...team, budget: 100000000 });
//     }
//   }, [team]);

//   const handleAppointStarting11 = () => {
//     // Navigate to player selection page or open modal
//     console.log('Appoint starting 11');
//   };

//   if (!hasTeam) {
//     return (
//       <>
//         <EmptyTeamState onCreateTeam={handleCreateTeam} />
//         <CreateTeamModal
//           isOpen={showCreateModal}
//           onClose={() => setShowCreateModal(false)}
//           onCreateTeam={handleCreateTeamSubmit}
//         />
//       </>
//     );
//   }

//   if (!team) {
//     return null;
//   }

//   return (
//     <MyTeamPage
//       team={team}
//       onAppointStarting11={handleAppointStarting11}
//       availablePlayers={mockPlayers}
//     />
//   );
// }

import Image from "next/image";
import Link from "next/link";

export default function TeamPage() {
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
