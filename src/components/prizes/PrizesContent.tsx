"use client";

import { Gift } from "lucide-react";
import PastWinners from "./PastWinners";
// import PredictorPrizes from "./PredictorPrizes";
import GlobalPrizeCard from "./GlobalPrizeCard";

export default function PrizesContent() {
  const globalLeaguePrizes = [
    {
      id: '1',
      place: 1,
      title: 'Second Place Champion',
      rewards: [
        'EA Sports FC 26 (any platform)',
        'Bluetooth Speakers',
        'F11 merchandise (shirt, rug sack, and more)'
      ],
      color: 'silver' as const,
      icon: Gift
    },
    {
      id: '2',
      place: 2,
      title: 'Ultimate Fantasy11 Champion',
      rewards: [
        'PlayStation 5',
        'EA Sports FC 26',
        'Bluetooth Speakers',
        'F11 merchandise (shirt, rug sack, and more)'
      ],
      color: 'gold' as const,
      icon: Gift
    },
    {
      id: '3',
      place: 3,
      title: 'Top 3 Predictor Winners',
      rewards: [
        'EA Sports FC 26 (any platform)',
        'F11 merchandise (shirt, rug sack, and more)'
      ],
      color: 'bronze' as const,
      icon: Gift
    }
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
        
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6 space-y-30 lg:space-y-0">
          {globalLeaguePrizes.map((prize) => {
            const mobileOrderClasses: Record<string, string> = {
              gold: "order-1",
              silver: "order-2",
              bronze: "order-3",
            };

            return (
              <div
                key={prize.id}
                className={`${mobileOrderClasses[prize.color] ?? "order-none"} md:order-none`}
              >
                <GlobalPrizeCard prize={prize} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Winners */}
      <PastWinners />
    </div>
  );
}
