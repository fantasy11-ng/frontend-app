"use client";

import { Gift, Trophy } from "lucide-react";
import PastWinners from "./PastWinners";
import PredictorPrizes from "./PredictorPrizes";
import GlobalPrizeCard from "./GlobalPrizeCard";

export default function PrizesContent() {
  const globalLeaguePrizes = [
    {
      id: '1',
      place: 1,
      title: 'Second Place Champion',
      cashPrize: '₦750,000',
      rewards: [
        'AFCON 2025 Premium Tickets',
        'Signed Football',
        'Medal'
      ],
      color: 'silver' as const,
      icon: Gift
    },
    {
      id: '2',
      place: 2,
      title: 'Ultimate Fantasy11 Champion',
      cashPrize: '₦1,000,000',
      rewards: [
        'AFCON 2025 VIP Experience',
        'Signed Jersey Collection',
        'Trophy & Medal'
      ],
      color: 'gold' as const,
      icon: Gift
    },
    {
      id: '3',
      place: 3,
      title: 'Third Place Champion',
      cashPrize: '₦500,000',
      rewards: [
        'AFCON 2025 Standard Tickets',
        'Team Merchandise',
        'Medal'
      ],
      color: 'bronze' as const,
      icon: Gift
    }
  ];

  const predictorPrizes = [
    {
      id: "p1",
      place: 1,
      title: "Perfect Predictor",
      cashPrize: "₦1,000,000",
      rewards: [
        "AFCON 2025 VIP Experience",
        "Signed Jersey Collection",
        "Trophy & Medal",
      ],
      color: "gold" as const,
      icon: Trophy,
    },
    {
      id: "p2",
      place: 2,
      title: "Second Place Champion",
      cashPrize: "₦1,000,000",
      rewards: [
        "AFCON 2025 Premium Tickets",
        "Signed Football",
        "Medal",
      ],
      color: "silver" as const,
      icon: Trophy,
    },
    {
      id: "p3",
      place: 3,
      title: "Third Place Champion",
      cashPrize: "₦1,000,000",
      rewards: [
        "AFCON 2025 Standard Tickets",
        "Team Merchandise",
        "Medal",
      ],
      color: "bronze" as const,
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Fantasy11 Global League Prizes */}
      <section>
        <h2 className="text-2xl font-medium text-[#070A11] mb-1">
          Fantasy11 Global League Prizes
        </h2>
        <p className="text-[#656E81] mb-36 text-sm">
          Compete against managers worldwide for these incredible rewards.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-30 lg:space-y-0">
          {globalLeaguePrizes.map((prize) => (
            <GlobalPrizeCard key={prize.id} prize={prize} />
          ))}
        </div>
      </section>

      {/* AFCON 2025 Predictor Prizes */}
      <section>
        <h2 className="text-2xl font-medium text-[#070A11] mb-1">
          AFCON 2025 Predictor Prizes
        </h2>
        <p className="text-[#656E81] text-sm mb-6">
          Predict tournament outcomes for a chance to win the N25,000,000 grand prize
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predictorPrizes.map((prize) => (
            <PredictorPrizes key={prize.id} prize={prize} />
          ))}
        </div>
      </section>

      {/* Past Winners */}
      <PastWinners />
    </div>
  );
}
