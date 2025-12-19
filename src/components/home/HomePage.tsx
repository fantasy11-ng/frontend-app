"use client";

import Link from "next/link";
import { Crown, Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPosts, leaderboardApi } from "@/lib/api";
import { teamApi } from "@/lib/api/team";
import { statsApi } from "@/lib/api/stats";
import { BlogPostListItem } from "@/types/news";
import { Fixture, Team } from "@/types/team";
import { getCountryName } from "@/lib/constants/countries";
import { Spinner } from "../common/Spinner";

type HomeFixture = Fixture & {
  time?: string;
  status?: "LIVE" | null;
  startsAt?: string;
  gameweekId?: number | null;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

export default function HomePage() {
  const { user } = useAuth();
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ||
        user?.lastName ||
        user?.email?.split("@")[0] ||
        "User");

  // Fetch latest news posts
  const { data: newsData } = useBlogPosts({ status: "published", limit: 4 });
  const newsArticles = newsData?.items || [];

  const [fixtures, setFixtures] = useState<HomeFixture[]>([]);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [fixturesError, setFixturesError] = useState<string | null>(null);

  // Team card info
  const [team, setTeam] = useState<Team | null>(null);
  const [squadPlayers, setSquadPlayers] = useState<
    Array<{
      id: string | number;
      name: string;
      commonName: string;
      position: string;
      points: number;
      country: string;
      price: number;
    }>
  >([]);

  // Top 5 players by points
  const [topPlayers, setTopPlayers] = useState<
    Array<{
      id: string | number;
      name: string;
      commonName: string;
      country: string;
      position: string;
      points: number;
    }>
  >([]);

  // Global ranking
  const [globalRank, setGlobalRank] = useState<number | null>(null);

  // Fetch team data
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const teamData = await teamApi.getMyTeam();
        if (teamData?.team) {
          setTeam({
            id: teamData.team.id ?? "",
            name: teamData.team.name ?? "",
            points: teamData.team.points ?? 0,
            budget: teamData.team.budgetTotal ?? 0,
            budgetRemaining:
              Number((teamData.team.budgetRemaining / 1000000).toFixed(1)) ?? 0,
            manager: teamData.team.manager ?? "",
            logo: teamData.team.logo ?? teamData.team.logoUrl,
          });
        }

        // Map squad players - filter for starting 11 and sort by position
        const players = (teamData?.currentSquad?.players ?? []) as Array<{
          isStarting?: boolean;
          position?: string;
          player?: {
            id?: number | string;
            name?: string;
            commonName?: string;
            positionId?: number;
            countryId?: number;
            position?: {
              code?: string;
              developer_name?: string;
              name?: string;
            };
            points?: number;
            price?: number;
          };
        }>;
        const positionOrder: Record<string, number> = {
          // Abbreviations
          gk: 1,
          def: 2,
          mid: 3,
          att: 4,
          // Full names
          goalkeeper: 1,
          defender: 2,
          midfielder: 3,
          attacker: 4,
        };

        const mapped = players
          .filter((p) => p.isStarting === true)
          .map((p) => ({
            id: p.player?.id ?? Math.random(),
            name: p.player?.name ?? "Unknown",
            commonName: p.player?.commonName ?? "Unknown",
            position: p.position ?? "N/A",
            points: p.player?.points ?? 0,
            country: getCountryName(p.player?.countryId),
            price: p.player?.price ?? 0,
          }))
          .sort((a, b) => {
            const posA = a.position.toString().toLowerCase();
            const posB = b.position.toString().toLowerCase();
            const orderA = positionOrder[posA] ?? 99;
            const orderB = positionOrder[posB] ?? 99;
            return orderA - orderB;
          });
        setSquadPlayers(mapped);
      } catch {
        // User may not have a team yet
        setTeam(null);
        setSquadPlayers([]);
      }
    };

    loadTeamData();
  }, []);

  useEffect(() => {
    const loadFixtures = async () => {
      setIsLoadingFixtures(true);
      setFixturesError(null);
      try {
        const upcoming = await teamApi.getUpcomingFixtures({ limit: 8 });
        const mapped: HomeFixture[] = (upcoming ?? []).map((fx) => {
          const home = fx.participants?.[0];
          const away = fx.participants?.[1];
          const start = fx.startingAt ? new Date(fx.startingAt) : null;
          const now = Date.now();
          const time = start
            ? start.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
            : "TBD";
          const date = start
            ? start.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "TBD";
          const startMs = start?.getTime() ?? null;
          // Consider LIVE within a 3h window from kickoff to avoid marking past games as live
          const isLive = startMs
            ? startMs <= now && now <= startMs + 3 * 60 * 60 * 1000
            : false;
          return {
            id: String(fx.id ?? Math.random()),
            homeTeam: { name: home?.name || "Home", flag: home?.logo },
            awayTeam: { name: away?.name || "Away", flag: away?.logo },
            matchDay: fx.gameweekId ? `GW ${fx.gameweekId}` : "Upcoming",
            date: date,
            time,
            status: isLive ? "LIVE" : null,
            startsAt: fx.startingAt ?? undefined,
            gameweekId: fx.gameweekId ?? null,
          };
        });
        setFixtures(mapped);
      } catch (error) {
        setFixturesError(
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
            (error as { message?: string })?.message ||
            "Failed to load fixtures."
        );
      } finally {
        setIsLoadingFixtures(false);
      }
    };

    loadFixtures();
  }, []);

  // Fetch top 5 players by points
  // Fetch top 5 players by points using statsApi with proper sorting
  useEffect(() => {
    const loadTopPlayers = async () => {
      try {
        const response = await statsApi.getPlayers({
          limit: 5,
          sortBy: "points:DESC",
        });
        const players = response.players ?? [];
        const mapped = players.map((p) => ({
          id: p.id ?? Math.random(),
          name: p.commonName || p.name || "Unknown",
          country: getCountryName(p.countryId),
          commonName: p.commonName ?? "Unknown",
          position: p.position?.code ?? "N/A",
          points: p.points ?? 0,
        }));
        setTopPlayers(mapped);
      } catch {
        setTopPlayers([]);
      }
    };

    loadTopPlayers();
  }, []);

  // Fetch global ranking
  useEffect(() => {
    const loadGlobalRank = async () => {
      try {
        const { me } = await leaderboardApi.getGlobalLeaderboard({
          page: 1,
          limit: 1,
        });
        setGlobalRank(me?.rank ?? null);
      } catch {
        setGlobalRank(null);
      }
    };

    loadGlobalRank();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        {/* Welcome Section */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-[#070A11]">
              Welcome back, {userName}!
            </h1>
            <p className="text-xs text-[#656E81]">
              Ready to dominate AFCON 2025?
            </p>
          </div>

          {/* Gameweek Info Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-4">
            <span className="px-4 py-2 bg-[#F5EBEB] text-[#800000] rounded-full text-sm font-medium">
              {fixtures[0]?.gameweekId ? `Gameweek ${fixtures[0].gameweekId}` : "Gameweek -"}
            </span>
            <div className="flex items-center text-[#656E81] border border-[#D4D7DD] rounded-full px-2 py-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">2 days left</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex overflow-x-auto justify-between gap-4 mb-8 w-full pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-2 flex-shrink-0 w-full min-w-[280px] max-w-[318px] border border-[#F1F2F4] rounded-2xl p-2">
            {/* Label outside */}
            <div className="flex items-center gap-2 px-2">
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/group_waeszt.png"
                alt="Users"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <p className="text-sm text-gray-700">My Team</p>
            </div>
            {/* Card with gradient background */}
            <div className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden bg-white max-h-[150px] relative">
              {/* SVG Background */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 302 98"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="paint0_linear_card1"
                    x1="0"
                    y1="0"
                    x2="178.399"
                    y2="205.664"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#800000" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#800000" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_card1"
                    x1="0"
                    y1="0"
                    x2="178.399"
                    y2="205.664"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_card1"
                    x1="0"
                    y1="0"
                    x2="178.399"
                    y2="205.664"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
                <g>
                  <path
                    d="M286 0H16C7.16344 0 0 7.16344 0 16V82C0 90.8366 7.16344 98 16 98H286C294.837 98 302 90.8366 302 82V16C302 7.16344 294.837 0 286 0Z"
                    fill="url(#paint0_linear_card1)"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M286 0H16C7.16344 0 0 7.16344 0 16V82C0 90.8366 7.16344 98 16 98H286C294.837 98 302 90.8366 302 82V16C302 7.16344 294.837 0 286 0Z"
                    fill="url(#paint1_linear_card1)"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M286 0H16C7.16344 0 0 7.16344 0 16V82C0 90.8366 7.16344 98 16 98H286C294.837 98 302 90.8366 302 82V16C302 7.16344 294.837 0 286 0Z"
                    fill="url(#paint2_linear_card1)"
                    fillOpacity="0.7"
                  />
                  <g opacity="0.05">
                    <path
                      d="M188.084 175.917C188.084 147.013 211.514 123.583 240.417 123.583C269.32 123.583 292.751 147.013 292.751 175.917H188.084ZM240.417 117.042C218.732 117.042 201.167 99.4771 201.167 77.7915C201.167 56.1059 218.732 38.5415 240.417 38.5415C262.103 38.5415 279.667 56.1059 279.667 77.7915C279.667 99.4771 262.103 117.042 240.417 117.042ZM288.582 131.65C308.766 136.808 323.941 154.483 325.352 175.917H305.834C305.834 158.844 299.294 143.299 288.582 131.65ZM275.35 116.76C286.031 107.178 292.751 93.2695 292.751 77.7915C292.751 68.5197 290.339 59.8111 286.11 52.2585C301.093 55.2487 312.376 68.4673 312.376 84.3332C312.376 102.405 297.739 117.042 279.667 117.042C278.204 117.042 276.763 116.945 275.35 116.76Z"
                      fill="#800000"
                    />
                  </g>
                </g>
              </svg>
              {/* Content */}
              <div className="p-6 relative z-10">
                <p className="text-base text-[#800000] mb-1">Team Name</p>
                <p className="text-3xl text-[#800000]">{team?.name || "--"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-shrink-0 w-full min-w-[280px] max-w-[318px] border border-[#F1F2F4] rounded-2xl p-2">
            {/* Label outside */}
            <div className="flex items-center gap-2 px-2">
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/focus-2_kkmuae.png"
                alt="Points"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <p className="text-sm font-medium text-gray-700">Points</p>
            </div>
            {/* Card with gradient background */}
            <div className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden bg-white max-h-[150px] relative">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 296 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_2017_135)">
                  <rect
                    width="296"
                    height="110"
                    rx="16"
                    fill="url(#paint0_linear_2017_135)"
                    fillOpacity="0.4"
                  />
                  <rect
                    width="296"
                    height="110"
                    rx="16"
                    fill="url(#paint1_linear_2017_135)"
                    fillOpacity="0.1"
                  />
                  <rect
                    width="296"
                    height="110"
                    rx="16"
                    fill="url(#paint2_linear_2017_135)"
                    fillOpacity="0.7"
                  />
                  <g opacity="0.05">
                    <path
                      d="M247.5 45.0833C283.61 45.0833 312.917 74.3899 312.917 110.5C312.917 146.61 283.61 175.917 247.5 175.917C211.39 175.917 182.083 146.61 182.083 110.5C182.083 74.3899 211.39 45.0833 247.5 45.0833ZM247.5 162.833C276.458 162.833 299.833 139.458 299.833 110.5C299.833 81.5421 276.458 58.1666 247.5 58.1666C218.542 58.1666 195.167 81.5421 195.167 110.5C195.167 139.458 218.542 162.833 247.5 162.833ZM247.5 149.75C225.782 149.75 208.25 132.218 208.25 110.5C208.25 88.7816 225.782 71.2499 247.5 71.2499C269.218 71.2499 286.75 88.7816 286.75 110.5C286.75 132.218 269.218 149.75 247.5 149.75ZM247.5 97.4166C240.304 97.4166 234.417 103.304 234.417 110.5C234.417 117.696 240.304 123.583 247.5 123.583C254.696 123.583 260.583 117.696 260.583 110.5C260.583 103.304 254.696 97.4166 247.5 97.4166Z"
                      fill="#800000"
                    />
                  </g>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_2017_135"
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
                    id="paint1_linear_2017_135"
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
                    id="paint2_linear_2017_135"
                    x1="0"
                    y1="0"
                    x2="202.268"
                    y2="203.615"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <clipPath id="clip0_2017_135">
                    <rect width="296" height="110" rx="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="p-6 relative z-10">
                <p className="text-sm text-[#800000] mb-1">Total points</p>
                <p className="text-3xl text-[#800000]">
                  {team?.points ?? "--"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-shrink-0 w-full min-w-[280px] max-w-[318px] border border-[#F1F2F4] rounded-2xl p-2">
            {/* Label outside */}
            <div className="flex items-center gap-2 px-2">
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592598/trophy_olvsvu.png"
                alt="Trophy"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <p className="text-sm text-gray-700">Rank</p>
            </div>
            {/* Card with gradient background */}
            <div className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden bg-white max-h-[150px] relative">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 303 111"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_2017_120)">
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint0_linear_2017_120)"
                    fillOpacity="0.4"
                  />
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint1_linear_2017_120)"
                    fillOpacity="0.1"
                  />
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint2_linear_2017_120)"
                    fillOpacity="0.7"
                  />
                  <g opacity="0.05">
                    <path
                      d="M261.074 142.822V156.31H293.782V169.393H215.282V156.31H247.99V142.822C222.175 139.603 202.199 117.581 202.199 90.8933V51.6433H306.865V90.8933C306.865 117.581 286.889 139.603 261.074 142.822ZM182.574 64.7266H195.657V90.8933H182.574V64.7266ZM313.407 64.7266H326.49V90.8933H313.407V64.7266Z"
                      fill="#800000"
                    />
                  </g>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_2017_120"
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
                    id="paint1_linear_2017_120"
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
                    id="paint2_linear_2017_120"
                    x1="0"
                    y1="0"
                    x2="204.067"
                    y2="208.389"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <clipPath id="clip0_2017_120">
                    <rect width="303" height="111" rx="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="p-6 relative z-10">
                <p className="text-sm text-[#800000] mb-1">Global Ranking</p>
                <p className="text-3xl text-[#800000]">
                  {globalRank ? `${globalRank}` : "--"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-shrink-0 w-full min-w-[280px] max-w-[318px] border border-[#F1F2F4] rounded-2xl p-2">
            {/* Label outside */}
            <div className="flex items-center gap-2 px-2">
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764592599/wallet-2_nfelnd.png"
                alt="Budget"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <p className="text-sm font-medium text-gray-700">Budget</p>
            </div>
            {/* Card with gradient background */}
            <div className="rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden bg-white max-h-[150px] relative">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 303 111"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_2017_89)">
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint0_linear_2017_89)"
                    fillOpacity="0.4"
                  />
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint1_linear_2017_89)"
                    fillOpacity="0.1"
                  />
                  <rect
                    width="303"
                    height="111"
                    rx="16"
                    fill="url(#paint2_linear_2017_89)"
                    fillOpacity="0.7"
                  />
                  <g opacity="0.05">
                    <path
                      d="M319.949 84.3316H261.074C257.461 84.3316 254.532 87.2604 254.532 90.8733V130.123C254.532 133.736 257.461 136.665 261.074 136.665H319.949V162.832C319.949 166.445 317.02 169.373 313.407 169.373H195.657C192.044 169.373 189.115 166.445 189.115 162.832V58.165C189.115 54.5521 192.044 51.6233 195.657 51.6233H313.407C317.02 51.6233 319.949 54.5521 319.949 58.165V84.3316ZM274.157 103.957H293.782V117.04H274.157V103.957Z"
                      fill="#800000"
                    />
                  </g>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_2017_89"
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
                    id="paint1_linear_2017_89"
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
                    id="paint2_linear_2017_89"
                    x1="0"
                    y1="0"
                    x2="204.067"
                    y2="208.389"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <clipPath id="clip0_2017_89">
                    <rect width="303" height="111" rx="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="p-6 relative z-10">
                <p className="text-sm text-[#800000] mb-1">Remaining</p>
                <p className="text-3xl text-[#800000]">
                  {team?.budgetRemaining != null ? `${team.budgetRemaining}M` : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* First Row: Upcoming Matches, Win Throughout Season, Team Updates */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8 items-stretch">
          {/* Upcoming Matches */}
          <div className="flex-1 rounded-xl p-3 lg:p-6 border border-[#F1F2F4] flex flex-col min-h-[420px]">
            <h2 className="text-xl font-bold text-[#070A11] mb-1">
              Upcoming Matches
            </h2>
            <p className="text-sm text-[#656E81] mb-6">
              Next fixtures in AFCON 2025
            </p>

            <div className="space-y-4 flex-1 min-h-0 max-h-[420px] overflow-y-auto pr-1">
              {isLoadingFixtures ? (
                <Spinner size={24} className="text-[#4AA96C]" />
              ) : fixturesError ? (
                <p className="text-sm text-red-600">{fixturesError}</p>
              ) : fixtures.length === 0 ? (
                <p className="text-sm text-[#656E81]">
                  No upcoming fixtures available.
                </p>
              ) : (
                fixtures.map((match) => (
                  <div
                    key={match.id}
                    className="flex flex-wrap gap-2 items-start justify-between px-4 py-3 rounded-lg border border-[#F1F2F4] transition-colors"
                  >
                    <div className="">
                      <div className="flex items-center justify-between gap-2 sm:gap-8">
                        <div className="flex items-center gap-2 min-w-[100px] max-w-[100px] lg:min-w-[150px]">
                          <div className="w-6 min-w-6 h-6 min-h-6 bg-[#4AA96C] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {match.homeTeam.name?.[0] ?? "H"}
                          </div>
                          <span className="font-medium text-[#070A11] text-sm truncate">
                            {match.homeTeam.name}
                          </span>
                        </div>
                        <div className="text-[#070A11] w-6 lg:w-10 text-sm font-medium">
                          vs
                        </div>
                        <div className="flex items-center gap-2 min-w-[100px] max-w-[100px] lg:min-w-[150px]">
                          <div className="w-6 min-w-6 h-6 min-h-6 bg-[#800000] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {match.awayTeam.name?.[0] ?? "A"}
                          </div>
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {match.awayTeam.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-[#656E81] font-light">
                          {match.matchDay || "Upcoming"} • {match.time || "TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="xl:ml-4">
                      {match.status === "LIVE" ? (
                        <span className="px-2 py-1 bg-[#FE5E41] text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <span className="font-black">•</span> LIVE
                        </span>
                      ) : (
                        <span className="px-2 py-1 whitespace-nowrap border border-[#D4D7DD] text-[#656E81] text-sm font-medium rounded-full">
                          {match.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Squad */}
          <div className="flex-1 rounded-xl pb-0 p-3 lg:p-6 lg:pb-0 border border-[#F1F2F4] flex flex-col min-h-[420px]">
            <h2 className="text-xl font-bold text-[#070A11] mb-1">
              Current Squad
            </h2>
            <p className="text-sm text-[#656E81] mb-6">
              View your starting 11 players
            </p>

            {squadPlayers.length > 0 ? (
              <div className="space-y-3 flex-1 min-h-0 max-h-[420px] overflow-y-auto pr-1">
                {squadPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#F1F2F4]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[38px] h-[38px] bg-[#4AA96C] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {player.position}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#070A11] text-sm mb-1">
                          {player.commonName}
                        </p>
                        <p className="text-xs text-[#656E81]">
                          {player.country} • $
                          {(player.price / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#F5EBEB] text-[#800000] px-3 py-1 rounded-full text-sm font-semibold">
                      {player.points} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 flex-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Image
                    src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764597186/wallet-2_eawcda.png"
                    alt="Squad"
                    width={32}
                    height={32}
                    className="w-8 h-8 opacity-50"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Create your squad to see your starting 11 here
                </p>
                <Link
                  href="/my-team"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#4AA96C] text-white font-semibold rounded-full transition-colors"
                >
                  Create Squad
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: How to Play and Top 5 Players */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* How to Play */}
            <div className="rounded-xl p-3 lg:p-6 border border-[#F1F2F4]">
              <h2 className="text-xl font-bold text-[#070A11] mb-6">
                How to Play
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Create your Team",
                    desc: "Select 15 players within $100M budget",
                  },
                  {
                    title: "Make Predictions",
                    desc: "Predict match outcomes and tournament winner",
                  },
                  {
                    title: "Join Leagues",
                    desc: "Compete with friends or globally",
                  },
                  {
                    title: "Win Prizes",
                    desc: "Earn points and climb the rankings",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#4AA96C] rounded-full flex-shrink-0 mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-[#070A11] text-sm">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#656E81]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Navigation Flow */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/predictor" className="text-[#070A11] font-medium">
                Make Predictions
              </Link>
              <span className="text-[#4AA96C]">→</span>
              <Link href="/prizes" className="text-[#070A11] font-medium">
                Upcoming Prizes
              </Link>
              <span className="text-[#4AA96C]">→</span>
              <Link href="/my-team" className="text-[#070A11] font-medium">
                Create a Team
              </Link>
              <span className="text-[#4AA96C]">→</span>
              <Link href="/league" className="text-[#070A11] font-medium">
                Join a League
              </Link>
              <span className="text-[#4AA96C]">→</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {/* Top 5 Players */}
            <div className="rounded-xl p-3 lg:p-6 border border-[#F1F2F4]">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Current Top 5 Players
              </h2>

              <div className="space-y-3">
                {topPlayers.length > 0 ? (
                  topPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg transition-colors border border-[#F1F2F4]"
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 ? (
                          <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center">
                            <Crown className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-[#070A11] text-sm">
                            {player.name}
                          </p>
                          <p className="text-xs text-[#656E81]">
                            {player.country} • {player.position}
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#F5EBEB] text-[#800000] px-3 py-1 rounded-full text-sm font-semibold">
                        {player.points}pts
                      </span>
                    </div>
                  ))
                ) : (
                  <Spinner size={24} className="text-[#4AA96C]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="mt-8 rounded-xl p-3 lg:p-6 border border-[#F1F2F4]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#070A11]">Latest News</h2>
            <Link href="/news" className="text-[#4AA96C] font-medium">
              See all
            </Link>
          </div>

          {newsArticles.length > 0 ? (
            <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {newsArticles.map((article: BlogPostListItem) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group flex-shrink-0 w-full min-w-[280px] max-w-[300px]"
                >
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-3 flex items-center justify-center group-hover:opacity-90 transition-opacity overflow-hidden relative">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                        priority
                      />
                    ) : (
                      <span className="text-white text-4xl">⚽</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#070A11] mb-2 group-hover:text-[#4AA96C] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#656E81] mb-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-[#656E81]">
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#656E81]">
              No news articles available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
