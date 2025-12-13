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
  cleansheet?: number;
  goals?: number;
  assists?: number;
  cards?: number;
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
  }): Promise<LeagueMember[]> => {
    const response = await apiClient.get(`/fantasy/leagues/${leagueId}/leaderboard/season`, {
      params: { page, limit },
    });

    const raw = response.data;
    const entries: RawLeaderboardEntry[] = Array.isArray(raw)
      ? (raw as RawLeaderboardEntry[])
      : raw?.data?.leagues ??
        raw?.data?.leaderboard ??
        raw?.leaderboard ??
        raw?.leagues ??
        raw?.items ??
        [];

    return entries.map((entry, index) => {
      const teamName = entry.team?.name ?? entry.teamName ?? "Unknown Team";
      const managerName =
        entry.manager ??
        entry.ownerName ??
        entry.user?.fullName ??
        entry.user?.name ??
        "Manager";

      return {
        id: entry.id ?? entry.teamId ?? `${leagueId}-${index}`,
        rank: entry.rank ?? entry.position ?? index + 1,
        team: teamName,
        manager: managerName,
        totalPoints: entry.totalPoints ?? entry.points ?? entry.score ?? 0,
        matchDayPoints: entry.matchDayPoints ?? entry.recentPoints ?? entry.lastPoints ?? 0,
        budget: typeof entry.budget === "number" ? `$${entry.budget}M` : entry.budget ?? "—",
        cleansheet: entry.cleansheet ?? 0,
        goals: entry.goals ?? 0,
        assists: entry.assists ?? 0,
        cards: entry.cards ?? 0,
      };
    });
  },

  leaveLeague: async (leagueId: string): Promise<void> => {
    await apiClient.post(`/fantasy/leagues/${leagueId}/leave`);
  },
};
