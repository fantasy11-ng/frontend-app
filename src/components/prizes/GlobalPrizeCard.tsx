"use client";

import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface PrizeCardProps {
  prize: {
    id: string;
    place: number;
    title: string;
    cashPrize: string;
    rewards: string[];
    color: "gold" | "silver" | "bronze" | "blue" | "purple" | "orange";
    icon: LucideIcon;
  };
}

const colorClasses = {
  gold: {
    bg: "bg-gradient-to-br from-[#EFBF0426]-50 via-[#EFBF0426]-50 to-[#EFBF0426]",
    text: "text-yellow-900",
    prizeText: "text-yellow-900",
    icon: "text-yellow-700",
    height: "max-h-[330px]",
  },
  silver: {
    bg: "bg-gradient-to-br from-[#A9B0B426]-50 via-[#A9B0B426]-50 to-[#A9B0B426]",
    text: "text-gray-900",
    prizeText: "text-gray-900",
    icon: "text-gray-700",
  },
  bronze: {
    bg: "bg-gradient-to-br from-[#A9714226]-50 via-[#A9714226]-50 to-[#A9714226]",
    text: "text-amber-900",
    prizeText: "text-amber-900",
    icon: "text-amber-700",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50",
    text: "text-blue-900",
    prizeText: "text-blue-900",
    icon: "text-blue-700",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50",
    text: "text-purple-900",
    prizeText: "text-purple-900",
    icon: "text-purple-700",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50",
    text: "text-orange-900",
    prizeText: "text-orange-900",
    icon: "text-orange-700",
  },
};

export default function GlobalPrizeCard({ prize }: PrizeCardProps) {
  const colors = colorClasses[prize.color];

  return (
    <div
      className={`${colors.bg} rounded-xl p-6 relative max-h-[330px]`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4 max-h-[330px] -mt-36 z-50">
        <div className={`${colors.icon} opacity-80`}>
          {prize.color === "gold" ? (
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png"
              alt="Gold Trophy"
              width={489}
              height={266}
              className="!w-[489px] !h-[266px] max-w-[1000px]"
            />
          ) : prize.color === "silver" ? (
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Silver_zo3xqh.png"
              alt="Silver Trophy"
              width={417}
              height={227}
              className="!w-[417px] !h-[227px] max-w-[1000px]"
            />
          ) : prize.color === "bronze" ? (
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Bronze_j7v5qk.png"
              alt="Bronze Trophy"
              width={379}
              height={206}
              className="!w-[379px] !h-[206px] max-w-[1000px]"
            />
          ) : null}
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
        {prize.title}
      </h3>
      {/* Rewards */}
      <ul className="space-y-2">
        {prize.rewards.map((reward, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <span className="mr-2">•</span>
            <span>{reward}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
