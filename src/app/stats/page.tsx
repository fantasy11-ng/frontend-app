// 'use client';

// import TopStatsCards from '@/components/stats/TopStatsCards';
// import PlayersTable from '@/components/stats/PlayersTable';
// import { TopStat, Player } from '@/types/stats';

// // Mock data - replace with actual API call
// const mockTopStats: TopStat[] = [
//   {
//     title: 'Most Points',
//     country: 'Egypt',
//     playerName: 'Mohammed Salah',
//     value: '127 points',
//     icon: 'points',
//   },
//   {
//     title: 'Most Goals',
//     country: 'Nigeria',
//     playerName: 'Mohammed Salah',
//     value: '8 goals',
//     icon: 'goals',
//   },
//   {
//     title: 'Most Assists',
//     country: 'Algeria',
//     playerName: 'Mohammed Salah',
//     value: '6 assists',
//     icon: 'assists',
//   },
// ];

// const mockPlayers: Player[] = [
//   {
//     id: '1',
//     rank: 1,
//     name: 'Mohammed Salah',
//     country: 'Egypt',
//     countryFlag: '🇪🇬',
//     club: 'Liverpool',
//     position: 'Forward',
//     age: 31,
//     height: '175 cm',
//     weight: '75kg',
//     price: '$12.5M',
//     points: 127,
//     goals: 8,
//     assists: 4,
//     cards: 1,
//     index: 127,
//   },
//   {
//     id: '2',
//     rank: 2,
//     name: 'Sadio Mané',
//     country: 'Senegal',
//     countryFlag: '🇸🇳',
//     club: 'Al Nassr',
//     position: 'Forward',
//     age: 31,
//     height: '175 cm',
//     weight: '69kg',
//     price: '$11M',
//     points: 114,
//     goals: 6,
//     assists: 5,
//     cards: 0,
//     index: 114,
//   },
//   {
//     id: '3',
//     rank: 3,
//     name: 'Riyad Mahrez',
//     country: 'Algeria',
//     countryFlag: '🇩🇿',
//     club: 'Al Ahil',
//     position: 'Midfielder',
//     age: 32,
//     height: '179 cm',
//     weight: '61kg',
//     price: '$9.5M',
//     points: 109,
//     goals: 4,
//     assists: 6,
//     cards: 2,
//     index: 109,
//   },
//   {
//     id: '4',
//     rank: 4,
//     name: 'Victor Osimhen',
//     country: 'Nigeria',
//     countryFlag: '🇳🇬',
//     club: 'Napoli',
//     position: 'Forward',
//     age: 25,
//     height: '185 cm',
//     weight: '70kg',
//     price: '$10.5M',
//     points: 91,
//     goals: 8,
//     assists: 2,
//     cards: 1,
//     index: 77,
//   },
//   {
//     id: '5',
//     rank: 5,
//     name: 'Achraf Hakimi',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     club: 'PSG',
//     position: 'Defender',
//     age: 25,
//     height: '181 cm',
//     weight: '73kg',
//     price: '$7.5M',
//     points: 84,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 66,
//   },
//   {
//     id: '6',
//     rank: 6,
//     name: 'Amadou Diallo',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     club: 'England',
//     position: 'Goalkeeper',
//     age: 30,
//     height: '185 cm',
//     weight: '77kg',
//     price: '$7.5M',
//     points: 78,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 74,
//   },
//   {
//     id: '7',
//     rank: 7,
//     name: 'Hakim Ziyech',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     club: 'Galatasaray',
//     position: 'Midfielder',
//     age: 32,
//     height: '187 cm',
//     weight: '89kg',
//     price: '$7.5M',
//     points: 69,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 80,
//   },
//   {
//     id: '8',
//     rank: 8,
//     name: 'Samuel Chukwueze',
//     country: 'Nigeria',
//     countryFlag: '🇳🇬',
//     club: 'Liverpool',
//     position: 'Forward',
//     age: 27,
//     height: '183 cm',
//     weight: '89kg',
//     price: '$7.5M',
//     points: 72,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 90,
//   },
//   {
//     id: '9',
//     rank: 9,
//     name: 'Mohammed Kudus',
//     country: 'Ghana',
//     countryFlag: '🇬🇭',
//     club: 'Chelsea',
//     position: 'Wingback',
//     age: 31,
//     height: '180 cm',
//     weight: '66kg',
//     price: '$7.5M',
//     points: 65,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 95,
//   },
//   {
//     id: '10',
//     rank: 10,
//     name: 'Ilias Chair',
//     country: 'Morocco',
//     countryFlag: '🇲🇦',
//     club: 'Arsenal',
//     position: 'Sweeper',
//     age: 30,
//     height: '181cm',
//     weight: '60kg',
//     price: '$7.5M',
//     points: 87,
//     goals: 2,
//     assists: 4,
//     cards: 3,
//     index: 82,
//   },
// ];

// export default function StatsPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-[1440px] mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Stats</h1>
//         </div>

//         {/* Top Stats Cards */}
//         <TopStatsCards stats={mockTopStats} />

//         {/* Players Table Section */}
//         <PlayersTable players={mockPlayers} />
//       </div>
//     </div>
//   );
// }


import { redirect } from "next/navigation";

export default function StatsPage() {
  redirect("/");
}
