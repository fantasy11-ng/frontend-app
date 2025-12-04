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

type PrizeColor = PrizeCardProps["prize"]["color"];

const colorClasses: Record<
  PrizeColor,
  {
    bg: string;
    accent: string;
    cash: string;
    dot: string;
    image?: {
      src: string;
      width: number;
      height: number;
      desktopClass?: string;
      mobileClass?: string;
    };
  }
> = {
  gold: {
    bg: "bg-gradient-to-br from-[#EFBF0426]-50 via-[#EFBF0426]-50 to-[#EFBF0426]",
    accent: "text-[#B26D05]",
    cash: "text-[#8B4D00]",
    dot: "bg-[#F1B347]",
    image: {
      src: "https://res.cloudinary.com/dmfsyau8s/image/upload/v1764268567/image_5_g8v1ws.png",
      width: 456,
      height: 248,
      desktopClass: "w-[456px] h-auto",
      mobileClass: "w-[220px] h-auto",
    },
  },
  silver: {
    bg: "bg-gradient-to-br from-[#A9B0B426]-50 via-[#A9B0B426]-50 to-[#A9B0B426]",
    accent: "text-[#6D768C]",
    cash: "text-[#4D5567]",
    dot: "bg-[#A4AEC1]",
    image: {
      src: "https://res.cloudinary.com/dmfsyau8s/image/upload/v1764268568/Image_fx_20_1_gdufsv.png",
      width: 456,
      height: 248,
      desktopClass: "w-[456px] h-auto",
      mobileClass: "w-[200px] h-auto",
    },
  },
  bronze: {
    bg: "bg-gradient-to-br from-[#A9714226]-50 via-[#A9714226]-50 to-[#A9714226]",
    accent: "text-[#A35824]",
    cash: "text-[#7C3E16]",
    dot: "bg-[#C97A41]",
    image: {
      src: "https://res.cloudinary.com/dmfsyau8s/image/upload/v1764268567/image_7_se8q25.png",
      width: 456,
      height: 248,
      desktopClass: "w-[456px] h-auto",
      mobileClass: "w-[200px] h-auto",
    },
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 via-white to-blue-50",
    accent: "text-blue-700",
    cash: "text-blue-900",
    dot: "bg-blue-400",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 via-white to-purple-50",
    accent: "text-purple-700",
    cash: "text-purple-900",
    dot: "bg-purple-400",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 via-white to-orange-50",
    accent: "text-orange-700",
    cash: "text-orange-900",
    dot: "bg-orange-400",
  },
};

export default function PredictorPrizes({ prize }: PrizeCardProps) {
  const colors = colorClasses[prize.color];

  return (
    <div
      className={`relative flex flex-col lg:flex-row justify-between overflow-hidden rounded-[28px] ${colors.bg} p-6 shadow-[0px_24px_80px_rgba(7,10,17,0.08)]`}
    >
      <div className="relative z-[1] flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/70 p-2 shadow-inner">
            <prize.icon className={`h-5 w-5 ${colors.accent}`} />
          </div>
          <p className="text-sm text-[#070A11]">
            {prize.title}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#656E81]">
            Cash Prize
          </p>
          <p className={`mt-1 text-3xl font-semibold ${colors.cash}`}>
            {prize.cashPrize}
          </p>
        </div>

        <ul className="space-y-3 text-sm text-[#40495A]">
          {prize.rewards.map((reward) => (
            <li key={reward} className="flex items-start gap-3">
              <span
                className={`mt-2 h-1.5 w-1.5 rounded-full ${colors.dot}`}
              />
              <span>{reward}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
      {colors.image && (
        <>
          <Image
            src={colors.image.src}
            alt={`${prize.title} prize`}
            width={colors.image.width}
            height={colors.image.height}
            className={`z-10 absolute -bottom-12 -right-36 lg:block ${colors.image.desktopClass ?? ""}`}
            sizes="(min-width: 768px) 220px"
            priority={prize.place === 1}
          />
        </>
      )}
      </div>

      <div className="pointer-events-none absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
    </div>
  );
}
