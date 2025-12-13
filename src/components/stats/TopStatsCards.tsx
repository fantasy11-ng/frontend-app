'use client';

import Image from 'next/image';
import { TopStat } from '@/types/stats';

interface TopStatsCardsProps {
  stats: TopStat[];
}

const ICONS: Record<
  string,
  { src: string; alt: string }
> = {
  points: {
    src: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/trophy_olvsvu.png',
    alt: 'Points',
  },
  goals: {
    src: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/focus-2_kkmuae.png',
    alt: 'Goals',
  },
  assists: {
    src: 'https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/group_waeszt.png',
    alt: 'Assists',
  },
};

const renderCardBackground = (variant: string) => {
  const suffix = variant || 'default';

  switch (variant) {
    case 'goals':
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 303 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g clipPath={`url(#clip0_${suffix})`}>
            <rect width="303" height="111" rx="16" fill={`url(#paint0_${suffix})`} fillOpacity="0.4" />
            <rect width="303" height="111" rx="16" fill={`url(#paint1_${suffix})`} fillOpacity="0.1" />
            <rect width="303" height="111" rx="16" fill={`url(#paint2_${suffix})`} fillOpacity="0.7" />
            <g opacity="0.05">
              <path
                d="M261.074 142.822V156.31H293.782V169.393H215.282V156.31H247.99V142.822C222.175 139.603 202.199 117.581 202.199 90.8933V51.6433H306.865V90.8933C306.865 117.581 286.889 139.603 261.074 142.822ZM182.574 64.7266H195.657V90.8933H182.574V64.7266ZM313.407 64.7266H326.49V90.8933H313.407V64.7266Z"
                fill="#800000"
              />
            </g>
          </g>
          <defs>
            <linearGradient
              id={`paint0_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#800000" stopOpacity="0.15" />
              <stop offset="1" stopColor="#800000" />
            </linearGradient>
            <linearGradient
              id={`paint1_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id={`paint2_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <clipPath id={`clip0_${suffix}`}>
              <rect width="303" height="111" rx="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case 'assists':
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 303 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g clipPath={`url(#clip0_alt_${suffix})`}>
            <rect width="303" height="111" rx="16" fill={`url(#paint0_alt_${suffix})`} fillOpacity="0.4" />
            <rect width="303" height="111" rx="16" fill={`url(#paint1_alt_${suffix})`} fillOpacity="0.1" />
            <rect width="303" height="111" rx="16" fill={`url(#paint2_alt_${suffix})`} fillOpacity="0.7" />
            <g opacity="0.05">
              <path
                d="M319.949 84.3316H261.074C257.461 84.3316 254.532 87.2604 254.532 90.8733V130.123C254.532 133.736 257.461 136.665 261.074 136.665H319.949V162.832C319.949 166.445 317.02 169.373 313.407 169.373H195.657C192.044 169.373 189.115 166.445 189.115 162.832V58.165C189.115 54.5521 192.044 51.6233 195.657 51.6233H313.407C317.02 51.6233 319.949 54.5521 319.949 58.165V84.3316ZM274.157 103.957H293.782V117.04H274.157V103.957Z"
                fill="#800000"
              />
            </g>
          </g>
          <defs>
            <linearGradient
              id={`paint0_alt_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#800000" stopOpacity="0.15" />
              <stop offset="1" stopColor="#800000" />
            </linearGradient>
            <linearGradient
              id={`paint1_alt_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id={`paint2_alt_${suffix}`}
              x1="0"
              y1="0"
              x2="204.067"
              y2="208.389"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <clipPath id={`clip0_alt_${suffix}`}>
              <rect width="303" height="111" rx="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    default:
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 296 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g clipPath={`url(#clip0_default_${suffix})`}>
            <rect width="296" height="110" rx="16" fill={`url(#paint0_default_${suffix})`} fillOpacity="0.4" />
            <rect width="296" height="110" rx="16" fill={`url(#paint1_default_${suffix})`} fillOpacity="0.1" />
            <rect width="296" height="110" rx="16" fill={`url(#paint2_default_${suffix})`} fillOpacity="0.7" />
            <g opacity="0.05">
              <path
                d="M247.5 45.0833C283.61 45.0833 312.917 74.3899 312.917 110.5C312.917 146.61 283.61 175.917 247.5 175.917C211.39 175.917 182.083 146.61 182.083 110.5C182.083 74.3899 211.39 45.0833 247.5 45.0833ZM247.5 162.833C276.458 162.833 299.833 139.458 299.833 110.5C299.833 81.5421 276.458 58.1666 247.5 58.1666C218.542 58.1666 195.167 81.5421 195.167 110.5C195.167 139.458 218.542 162.833 247.5 162.833ZM247.5 149.75C225.782 149.75 208.25 132.218 208.25 110.5C208.25 88.7816 225.782 71.2499 247.5 71.2499C269.218 71.2499 286.75 88.7816 286.75 110.5C286.75 132.218 269.218 149.75 247.5 149.75ZM247.5 97.4166C240.304 97.4166 234.417 103.304 234.417 110.5C234.417 117.696 240.304 123.583 247.5 123.583C254.696 123.583 260.583 117.696 260.583 110.5C260.583 103.304 254.696 97.4166 247.5 97.4166Z"
                fill="#800000"
              />
            </g>
          </g>
          <defs>
            <linearGradient
              id={`paint0_default_${suffix}`}
              x1="0"
              y1="0"
              x2="202.268"
              y2="203.615"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#800000" stopOpacity="0.15" />
              <stop offset="1" stopColor="#800000" />
            </linearGradient>
            <linearGradient
              id={`paint1_default_${suffix}`}
              x1="0"
              y1="0"
              x2="202.268"
              y2="203.615"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id={`paint2_default_${suffix}`}
              x1="0"
              y1="0"
              x2="202.268"
              y2="203.615"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <clipPath id={`clip0_default_${suffix}`}>
              <rect width="296" height="110" rx="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
  }
};

export default function TopStatsCards({ stats }: TopStatsCardsProps) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {stats.map((stat) => {
        const icon = ICONS[stat.icon] ?? ICONS.points;
        return (
          <div
            key={stat.title}
            className="space-y-2 w-full min-w-[280px] h-[195px] max-w-[416px] flex-shrink-0 rounded-2xl border border-[#F1F2F4] p-2"
          >
            <div className="flex items-center gap-2 px-2">
              <Image src={icon.src} alt={icon.alt} width={24} height={24} className="h-6 w-6" />
              <p className="text-sm text-[#070A11]">{stat.title}</p>
            </div>

            <div className="relative max-h-[150px] overflow-hidden rounded-xl border-2 border-white bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              {renderCardBackground(stat.icon)}
              <div className="relative z-10 p-6 text-[#800000]">
                <p className="text-sm tracking-wide mb-4 text-[#800000]">{stat.country}</p>
                <p className="text-base text-[#800000]">{stat.playerName}</p>
                <p className="text-3xl">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

