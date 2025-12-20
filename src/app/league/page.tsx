"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChooseLeagueModal,
  CreateLeagueModal,
  JoinLeagueModal,
  ChampionshipPage,
} from "@/components/league";
import { ChampionshipDetails, LeagueOption, UserLeague } from "@/types/league";
import { leagueApi, leaderboardApi } from "@/lib/api";
import { teamApi } from "@/lib/api/team";
import { Spinner } from "@/components/common/Spinner";
import NoTeamModal from "@/components/common/NoTeamModal";
import { useCurrentUser } from "@/lib/api/hooks/useAuth";
import { GlobalRanking } from "@/types/ranking";
import { ProtectedRoute } from "@/components/auth";

const mockChampionshipDetails: ChampionshipDetails = {
  totalPrizePool: "₦1,000,000",
  activeManagers: "1K+",
  winnerPrize: "₦1,000,000",
  entryFee: "FREE",
};

interface UserStats {
  globalRank: number | null;
  teamName: string;
  userName: string;
  currentGameweek: string;
  totalPoints: number;
  totalGoals: number;
  totalAssists: number;
}

function LeaguePageContent() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [showChooseModal, setShowChooseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LeagueOption | null>(
    null
  );
  const [currentView, setCurrentView] = useState<
    "championship" | "leaderboard"
  >("championship");
  const [currentLeague, setCurrentLeague] = useState<string | null>(null);
  const [isCreatingLeague, setIsCreatingLeague] = useState(false);
  const [createLeagueError, setCreateLeagueError] = useState<string | null>(
    null
  );
  const [myLeagues, setMyLeagues] = useState<UserLeague[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  const [leaguesError, setLeaguesError] = useState<string | null>(null);
  const [isJoiningLeague, setIsJoiningLeague] = useState(false);
  const [joinLeagueError, setJoinLeagueError] = useState<string | null>(null);
  const [initialLeaguesLoading, setInitialLeaguesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [copyingLeagueId, setCopyingLeagueId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false);
  const [showNoTeamModal, setShowNoTeamModal] = useState(false);
  const [currentGameweekId, setCurrentGameweekId] = useState<number | null>(null);
  const ready = true;

  const getErrorMessage = useCallback((error: unknown, fallback: string) => {
    return (
      (
        error as {
          response?: { data?: { message?: string } };
          message?: string;
        }
      )?.response?.data?.message ||
      (error as { message?: string })?.message ||
      fallback
    );
  }, []);

  const fetchUserLeagues = useCallback(async (): Promise<UserLeague[]> => {
    setIsLoadingLeagues(true);
    setLeaguesError(null);
    try {
      const leagues = await leagueApi.getMyLeagues();
      setMyLeagues(leagues);
      return leagues;
    } catch (error) {
      setLeaguesError(getErrorMessage(error, "Failed to load your leagues."));
      return [];
    } finally {
      setIsLoadingLeagues(false);
      setInitialLeaguesLoading(false);
    }
  }, [getErrorMessage]);

  useEffect(() => {
    fetchUserLeagues();
  }, [fetchUserLeagues]);

  // Fetch current gameweek from fixtures
  useEffect(() => {
    const fetchCurrentGameweek = async () => {
      try {
        const fixtures = await teamApi.getUpcomingFixtures({ limit: 1 });
        if (fixtures && fixtures.length > 0 && fixtures[0]?.gameweekId) {
          setCurrentGameweekId(fixtures[0].gameweekId);
        }
      } catch {
        // Silently fail - gameweek will show fallback
      }
    };

    fetchCurrentGameweek();
  }, []);

  // Fetch user stats (global rank, points, goals, assists)
  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoadingUserStats(true);
      try {
        // Fetch global leaderboard to get user's stats
        const { items, me } = await leaderboardApi.getGlobalLeaderboard({ page: 1, limit: 50 });
        
        // Try to get team info
        let teamName = "—";
        try {
          const teamData = await teamApi.getMyTeam();
          teamName = teamData?.team?.name ?? "—";
        } catch {
          // Team may not exist yet
        }

        // Find user's entry in leaderboard for full stats
        const userEntry = me?.teamId 
          ? items.find((item: GlobalRanking) => item.id === me.teamId)
          : null;

        const userName = currentUser?.fullName ?? 
          (currentUser?.firstName && currentUser?.lastName 
            ? `${currentUser.firstName} ${currentUser.lastName}` 
            : currentUser?.email ?? "Manager");

        setUserStats({
          globalRank: me?.rank ?? userEntry?.rank ?? null,
          teamName,
          userName,
          currentGameweek: currentGameweekId ? `GW ${currentGameweekId}` : "GW -",
          totalPoints: me?.totalPoints ?? userEntry?.totalPoints ?? 0,
          totalGoals: userEntry?.goals ?? 0,
          totalAssists: userEntry?.assists ?? 0,
        });
      } catch (error) {
        const errorResponse = error as {
          response?: { data?: { message?: string; error?: { message?: string } } };
          message?: string;
        };
        const message =
          errorResponse?.response?.data?.error?.message ??
          errorResponse?.response?.data?.message ??
          errorResponse?.message ??
          "";
        
        // Check if the error is because user doesn't have a team
        const isNoTeamError = message.toLowerCase().includes("fantasy team not found") ||
          message.toLowerCase().includes("team not found");
        
        if (isNoTeamError) {
          setShowNoTeamModal(true);
        }
      } finally {
        setIsLoadingUserStats(false);
      }
    };

    fetchUserStats();
  }, [currentUser, currentGameweekId]);

  const handleSelectLeague = (league: UserLeague) => {
    if (!league?.id) return;
    router.push(`/league/${league.id}`);
  };

  // Automatically select first league after load if none selected
  const filteredLeagues = useMemo(() => {
    if (!searchTerm.trim()) return myLeagues;
    const term = searchTerm.toLowerCase();
    return myLeagues.filter(
      (league) =>
        league.name.toLowerCase().includes(term) ||
        (league.inviteCode ?? "").toLowerCase().includes(term)
    );
  }, [myLeagues, searchTerm]);

  const visibleLeagues = useMemo(
    () => filteredLeagues.slice(0, visibleCount),
    [filteredLeagues, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24);
  };

  const handleCopyInvite = async (league: UserLeague) => {
    if (!league.inviteCode) return;
    try {
      setCopyingLeagueId(league.id);
      await navigator.clipboard.writeText(league.inviteCode);
      setTimeout(() => setCopyingLeagueId(null), 1200);
    } catch {
      setCopyingLeagueId(null);
    }
  };

  const handleChooseOption = (option: LeagueOption) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    setShowChooseModal(false);

    if (selectedOption === "create") {
      setShowCreateModal(true);
    } else if (selectedOption === "join") {
      setJoinLeagueError(null);
      setShowJoinModal(true);
    } else if (selectedOption === "championship") {
      router.push("/league/leaderboard");
    }
  };

  const handleCreateLeague = async (leagueName: string) => {
    setIsCreatingLeague(true);
    setCreateLeagueError(null);
    try {
      const league = await leagueApi.createLeague({ name: leagueName });
      const leagues = await fetchUserLeagues();
      const createdLeague =
        leagues.find((l) => l.id === league.id) ??
        leagues.find((l) => l.name === league.name);
      setCurrentLeague(createdLeague?.name ?? league?.name ?? leagueName);
      setCurrentView("leaderboard");
      if (createdLeague?.id) {
        router.push(`/league/${createdLeague.id}`);
      }
      setShowCreateModal(false);
    } catch (error) {
      setCreateLeagueError(
        getErrorMessage(error, "Failed to create league. Please try again.")
      );
    } finally {
      setIsCreatingLeague(false);
    }
  };

  const handleJoinLeague = async (code: string) => {
    setIsJoiningLeague(true);
    setJoinLeagueError(null);

    try {
      await leagueApi.joinLeague({ inviteCode: code });
      const leagues = await fetchUserLeagues();

      const joinedLeagueName =
        leagues.find((league) => league.inviteCode === code)?.name ??
        leagues[0]?.name;

      const joinedLeague =
        leagues.find((league) => league.inviteCode === code) ??
        leagues.find((league) => league.name === joinedLeagueName);

      if (joinedLeagueName || joinedLeague) {
        setCurrentLeague(joinedLeague?.name ?? joinedLeagueName ?? null);
        setCurrentView("leaderboard");
        if (joinedLeague?.id) {
          router.push(`/league/${joinedLeague.id}`);
        }
      }

      setShowJoinModal(false);
    } catch (error) {
      setJoinLeagueError(
        getErrorMessage(error, "Failed to join league. Please try again.")
      );
    } finally {
      setIsJoiningLeague(false);
    }
  };

  const handleEnterChampionship = () => {
    setShowChooseModal(true);
  };

  const handleViewGlobalLeaderboard = () => {
    router.push("/league/leaderboard");
  };

  const handleViewLeague = (league: UserLeague) => {
    handleSelectLeague(league);
  };

  if (!ready) {
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

  if (initialLeaguesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size={24} className="text-[#4AA96C]" />
      </div>
    );
  }

  const hasLeagues = myLeagues.length > 0;
  const showChampionship =
    !hasLeagues && currentView === "championship" && !currentLeague;

  return (
    <>
      <NoTeamModal 
        isOpen={showNoTeamModal} 
        onGoBack={() => router.push("/")}
      />
      {showChampionship && (
        <ChampionshipPage
          details={mockChampionshipDetails}
          onEnterChampionship={handleEnterChampionship}
        />
      )}

      {!hasLeagues && !showChampionship && (
        <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-6">
          <div className="bg-white border border-[#F1F2F4] rounded-2xl shadow-sm p-6">
            {leaguesError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {leaguesError}
              </div>
            )}

            {isLoadingLeagues ? (
              <Spinner size={24} className="text-[#4AA96C]" />
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-dashed border-[#D4D7DD] bg-gray-50 px-4 py-6">
                <div>
                  <p className="text-sm font-semibold text-[#070A11]">
                    No leagues yet
                  </p>
                  <p className="text-xs text-[#656E81]">
                    Create or join a league to see it in your list.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setShowChooseModal(true);
                  }}
                  className="rounded-full h-10 px-4 bg-[#4AA96C] text-white text-sm font-semibold hover:bg-[#3c8b58] transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {hasLeagues && (
        <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-6 flex flex-col gap-6">
          <div className="bg-white border border-[#F1F2F4] rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#070A11]">
                      Global Leaderboard
                    </h2>
                    <p className="text-sm text-[#656E81]">
                      See how all managers are performing on the global league.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={handleViewGlobalLeaderboard}
                      className="rounded-full cursor-pointer h-8 px-4 bg-[#4AA96C] text-white text-sm font-semibold hover:bg-[#3c8b58] transition-colors"
                    >
                      View Leaderboard
                    </button>
                  </div>
                </div>
                {/* User Stats Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#F1F2F4]">
                  {/* Global Rank */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5EBEB] flex items-center justify-center">
                      <span className="text-[#800000] font-semibold text-sm">
                        {isLoadingUserStats ? "..." : userStats?.globalRank ? `#${userStats.globalRank}` : "—"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#070A11] truncate max-w-[100px]">
                        {isLoadingUserStats ? "..." : userStats?.teamName ?? "—"}
                      </p>
                      <p className="text-[10px] text-[#656E81]">
                        {isLoadingUserStats ? "" : userStats?.userName ?? ""}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#800000]">
                        {isLoadingUserStats ? "..." : userStats?.totalPoints?.toLocaleString() ?? "0"}
                      </p>
                      <p className="text-[10px] text-[#656E81] uppercase tracking-wide">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#800000]">
                        {isLoadingUserStats ? "..." : userStats?.totalGoals?.toLocaleString() ?? "0"}
                      </p>
                      <p className="text-[10px] text-[#656E81] uppercase tracking-wide">Goals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#800000]">
                        {isLoadingUserStats ? "..." : userStats?.totalAssists?.toLocaleString() ?? "0"}
                      </p>
                      <p className="text-[10px] text-[#656E81] uppercase tracking-wide">Assists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#F1F2F4] rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#070A11]">
                    Your Leagues
                  </h2>
                  <p className="text-sm text-[#656E81]">
                    Select a league to view its leaderboard. Showing{" "}
                    {visibleLeagues.length} of {filteredLeagues.length}.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                  <div className="relative flex-1 min-w-[220px]">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setVisibleCount(24);
                      }}
                      placeholder="Search leagues or codes"
                      className="w-full rounded-lg border border-[#D4D7DD] bg-white py-2.5 pl-4 pr-4 text-sm text-[#070A11] placeholder:text-[#A0A6B1] focus:outline-none focus:ring-2 focus:ring-[#4AA96C]"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOption(null);
                      setShowChooseModal(true);
                    }}
                    className="rounded-full cursor-pointer h-8 px-4 bg-[#4AA96C] text-white text-sm font-semibold hover:bg-[#3c8b58] transition-colors"
                  >
                    Create / Join
                  </button>
                </div>
              </div>

              {leaguesError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {leaguesError}
                </div>
              )}

              {isLoadingLeagues ? (
                <Spinner size={24} className="text-[#4AA96C]" />
              ) : filteredLeagues.length === 0 ? (
                <p className="text-sm text-[#656E81]">
                  No leagues match your search.
                </p>
              ) : (
                <>
                  <div className="divide-y divide-[#F1F2F4] border border-[#F1F2F4] rounded-xl bg-white">
                    {visibleLeagues.map((league, index) => (
                      <div
                        role="button"
                        tabIndex={0}
                        key={
                          league.id || league.inviteCode || league.name || index
                        }
                        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-[#070A11] truncate">
                              {league.name}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F1F2F4] text-[#4AA96C] font-semibold">
                              {league.isOwner ? "Owner" : "Member"}
                            </span>
                          </div>
                          <p className="text-xs text-[#656E81] mt-1">
                            {league.participantCount ?? "—"} participant
                            {league.participantCount === 1 ? "" : "s"}
                            {league.ownerName
                              ? ` • Admin: ${league.ownerName}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {league.inviteCode && (
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-[#070A11] font-mono">
                                {league.inviteCode}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyInvite(league);
                                }}
                                className="text-xs font-semibold text-[#4AA96C] hover:text-[#3c8b58] transition-colors"
                              >
                                {copyingLeagueId === league.id
                                  ? "Copied"
                                  : "Copy"}
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewLeague(league);
                            }}
                            className="h-8 px-3 cursor-pointer rounded-full border border-[#D4D7DD] bg-white text-xs font-semibold text-[#070A11] hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {visibleLeagues.length < filteredLeagues.length && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleLoadMore}
                        className="rounded-full h-10 px-4 bg-white border border-[#D4D7DD] text-sm font-semibold text-[#070A11] hover:bg-gray-50 transition-colors"
                      >
                        Load more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ChooseLeagueModal
        isOpen={showChooseModal}
        onClose={() => {
          setShowChooseModal(false);
          setSelectedOption(null);
        }}
        selectedOption={selectedOption}
        onSelectOption={handleChooseOption}
        onContinue={handleContinue}
      />

      <CreateLeagueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateLeague={handleCreateLeague}
        isSubmitting={isCreatingLeague}
        errorMessage={createLeagueError}
      />

      <JoinLeagueModal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setJoinLeagueError(null);
        }}
        onJoinLeague={handleJoinLeague}
        isSubmitting={isJoiningLeague}
        errorMessage={joinLeagueError}
        leagueDetails={
          showJoinModal
            ? {
                name: "Lion Champs",
                members: "12/50",
                admin: "Ahmed Hassan",
              }
            : null
        }
      />
    </>
  );
}

export default function LeaguePage() {
  return (
    <ProtectedRoute>
      <LeaguePageContent />
    </ProtectedRoute>
  );
}
