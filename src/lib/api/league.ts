import { apiClient } from "./client";

import { LeagueMember, UserLeague } from "@/types/league";

export interface CreateLeaguePayload {
  name: string;
}

export interface JoinLeaguePayload {
  inviteCode: string;
}

export interface LeagueData {
  id: string;
  name: string;
  invitationCode?: string;
  inviteCode?: string;
  createdAt?: string;
}

interface CreateLeagueResponse {
  success?: boolean;
  data: LeagueData;
}

type RawLeagueOwner = {
  fullName?: string;
  name?: string;
};

type RawLeague = {
  id?: string;
  name?: string;
  inviteCode?: string;
  invitationCode?: string;
  isPublic?: boolean;
  memberships?: unknown[];
  maxParticipants?: number;
  owner?: RawLeagueOwner;
};

type RawMyLeague = {
  league?: RawLeague;
  participantCount?: number;
  maxParticipants?: number;
  isOwner?: boolean;
};

type RawLeaderboardEntry = {
  id?: string;
  rank?: number;
  position?: number;
  teamId?: string;
  teamName?: string;
  team?: { id?: string; name?: string };
  manager?: string;
  ownerName?: string;
  user?: { fullName?: string; name?: string };
  totalPoints?: number;
  points?: number;
  score?: number;
  matchDayPoints?: number;
  recentPoints?: number;
  lastPoints?: number;
  budget?: number | string;
  budgetRemaining?: number | string;
  cleansheet?: number;
  cleanSheets?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
};

const normalizeLeague = (entry: RawMyLeague): UserLeague => {
  const leagueDetails = entry.league ?? (entry as RawLeague);
  return {
    id: leagueDetails.id ?? "",
    name: leagueDetails.name ?? "Untitled League",
    inviteCode: leagueDetails.inviteCode ?? leagueDetails.invitationCode,
    isPublic: leagueDetails.isPublic,
    participantCount:
      entry.participantCount ??
      (Array.isArray(leagueDetails.memberships)
        ? leagueDetails.memberships.length
        : undefined),
    maxParticipants: entry.maxParticipants ?? leagueDetails.maxParticipants,
    isOwner: Boolean(entry.isOwner),
    ownerName: leagueDetails.owner?.fullName ?? leagueDetails.owner?.name,
  };
};

export const leagueApi = {
  createLeague: async (payload: CreateLeaguePayload): Promise<LeagueData> => {
    const response = await apiClient.post<CreateLeagueResponse>(
      "/fantasy/leagues",
      payload
    );
    // Some endpoints wrap data, some return raw; normalize to data
    return (
      (response.data as CreateLeagueResponse).data ??
      (response.data as unknown as LeagueData)
    );
  },

  joinLeague: async (payload: JoinLeaguePayload): Promise<void> => {
    await apiClient.post("/fantasy/leagues/join/code", payload);
  },

  getMyLeagues: async (): Promise<UserLeague[]> => {
    const response = await apiClient.get<{ leagues?: RawMyLeague[]; data?: { leagues?: RawMyLeague[] } }>(
      "/fantasy/leagues/me"
    );

    const raw = response.data;
    const leagues: RawMyLeague[] = Array.isArray(raw)
      ? (raw as RawMyLeague[])
      : raw?.leagues ??
        raw?.data?.leagues ??
        [];

    return leagues.map(normalizeLeague);
  },

  getLeagueLeaderboard: async ({
    leagueId,
    page = 1,
    limit = 50,
  }: {
    leagueId: string;
    page?: number;
    limit?: number;
  }): Promise<{
    members: LeagueMember[];
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
      budgetRemaining?: number | string;
      budget?: number | string;
    };
  }> => {
    const response = await apiClient.get(`/fantasy/leagues/${leagueId}/leaderboard/season`, {
      params: { page, limit },
    });

    const raw = response.data ?? {};
    const entries: RawLeaderboardEntry[] = Array.isArray(raw)
      ? (raw as RawLeaderboardEntry[])
      : Array.isArray(raw.data)
        ? raw.data
        : Array.isArray(raw.data?.data)
          ? raw.data.data
          : Array.isArray(raw.data?.leaderboard)
            ? raw.data.leaderboard
            : Array.isArray(raw.leaderboard)
              ? raw.leaderboard
              : Array.isArray(raw.data?.leagues)
                ? raw.data.leagues
                : Array.isArray(raw.leagues)
                  ? raw.leagues
                  : Array.isArray(raw.items)
                    ? raw.items
                    : [];

    const members = entries.map((entry, index) => {
      const teamName = entry.team?.name ?? entry.teamName ?? "Unknown Team";
      const managerName =
        entry.manager ??
        entry.ownerName ??
        entry.user?.fullName ??
        entry.user?.name ??
        "Manager";

      // Format budget - could be in budget or budgetRemaining field
      const rawBudget = entry.budget ?? entry.budgetRemaining;
      let budgetDisplay = "—";
      if (typeof rawBudget === "number") {
        // If budget is in raw units (e.g., 100000000), convert to millions
        const budgetInMillions = rawBudget >= 1000000 ? rawBudget / 1000000 : rawBudget;
        budgetDisplay = `$${budgetInMillions.toFixed(1)}M`;
      } else if (typeof rawBudget === "string" && rawBudget) {
        budgetDisplay = rawBudget;
      }

      return {
        id: entry.id ?? entry.teamId ?? `${leagueId}-${index}`,
        rank: entry.rank ?? entry.position ?? index + 1,
        team: teamName,
        manager: managerName,
        totalPoints: entry.totalPoints ?? entry.points ?? entry.score ?? 0,
        matchDayPoints: entry.matchDayPoints ?? entry.recentPoints ?? entry.lastPoints ?? 0,
        budget: budgetDisplay,
        cleansheet: entry.cleansheet ?? entry.cleanSheets ?? 0,
        goals: entry.goals ?? 0,
        assists: entry.assists ?? 0,
        cards: (entry.yellowCards ?? 0) + (entry.redCards ?? 0),
      };
    });

    const meta =
      raw?.meta ??
      raw?.data?.meta ??
      raw?.data?.data?.meta;

    const rawMe =
      raw?.me ??
      raw?.data?.me ??
      raw?.data?.data?.me;

    // Format the me object's budgetRemaining
    let formattedBudgetRemaining: number | string | undefined = rawMe?.budgetRemaining ?? rawMe?.budget;
    if (typeof formattedBudgetRemaining === "number") {
      // If budget is in raw units (e.g., 100000000), convert to millions
      const budgetInMillions = formattedBudgetRemaining >= 1000000 
        ? formattedBudgetRemaining / 1000000 
        : formattedBudgetRemaining;
      formattedBudgetRemaining = `$${budgetInMillions.toFixed(1)}M`;
    }

    const me = rawMe ? {
      ...rawMe,
      budgetRemaining: formattedBudgetRemaining,
    } : undefined;

    return { members, meta, me };
  },

  leaveLeague: async (leagueId: string): Promise<void> => {
    await apiClient.post(`/fantasy/leagues/${leagueId}/leave`);
  },
};
