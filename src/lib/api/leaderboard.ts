import { apiClient } from "./client";
import { GlobalRanking } from "@/types/ranking";

type RawGlobalLeaderboardEntry = {
  id?: string;
  rank?: number;
  position?: number;
  teamId?: string;
  teamName?: string;
  manager?: string;
  ownerName?: string;
  user?: { fullName?: string; name?: string };
  team?: {
    id?: string;
    name?: string;
    owner?: { fullName?: string; name?: string };
  };
  totalPoints?: number;
  points?: number;
  score?: number;
  cleansheet?: number;
  cleanSheet?: number;
  goals?: number;
  assists?: number;
  cards?: number;
};

type GlobalLeaderboardResponse = {
  data?: RawGlobalLeaderboardEntry[];
  // Some responses wrap payload inside data.data
  dataNested?: {
    data?: RawGlobalLeaderboardEntry[];
    meta?: {
      totalItems?: number;
      itemCount?: number;
      itemsPerPage?: number;
      totalPages?: number;
      currentPage?: number;
    };
    me?: {
      teamId?: string;
      rank?: number;
      totalPoints?: number;
      budgetRemaining?: number;
    };
  };
  items?: RawGlobalLeaderboardEntry[];
  leaderboard?: RawGlobalLeaderboardEntry[];
  meta?: {
    totalItems?: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };
  me?: {
    teamId?: string;
    rank?: number;
    totalPoints?: number;
    budgetRemaining?: number;
  };
};

export const leaderboardApi = {
  getGlobalLeaderboard: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    items: GlobalRanking[];
    meta?: GlobalLeaderboardResponse["meta"];
    me?: GlobalLeaderboardResponse["me"];
  }> => {
    const response = await apiClient.get<GlobalLeaderboardResponse>("/fantasy/leaderboard/season", {
      params: { page: params?.page ?? 1, limit: params?.limit ?? 50 },
    });

    const payload = response.data ?? {};
    const entries: RawGlobalLeaderboardEntry[] = Array.isArray(payload)
      ? (payload as unknown as RawGlobalLeaderboardEntry[])
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.data?.data)
          ? payload.data.data
          : Array.isArray((payload as GlobalLeaderboardResponse)?.dataNested?.data)
            ? (payload as GlobalLeaderboardResponse).dataNested?.data ?? []
            : Array.isArray(payload.items)
              ? payload.items
              : Array.isArray(payload.leaderboard)
                ? payload.leaderboard
                : [];

    const items: GlobalRanking[] = entries.map((entry, index) => {
      const teamName = entry.team?.name ?? entry.teamName ?? "Unknown Team";
      const managerName =
        entry.team?.owner?.fullName ??
        entry.team?.owner?.name ??
        entry.manager ??
        entry.ownerName ??
        entry.user?.fullName ??
        entry.user?.name ??
        "Manager";

      return {
        id: entry.id ?? entry.teamId ?? `global-${index}`,
        rank: entry.rank ?? entry.position ?? index + 1,
        team: teamName,
        manager: managerName,
        totalPoints: entry.totalPoints ?? entry.points ?? entry.score ?? 0,
        cleansheet: entry.cleansheet ?? entry.cleanSheet ?? 0,
        goals: entry.goals ?? 0,
        assists: entry.assists ?? 0,
        cards: entry.cards ?? 0,
      };
    });

    return {
      items,
      meta: payload.dataNested?.meta ?? payload.data?.meta ?? payload.meta,
      me: payload.dataNested?.me ?? payload.data?.me ?? payload.me,
    };
  },
};

