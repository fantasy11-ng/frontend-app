import { apiClient } from "./client";
import { Team } from "@/types/team";

export type TransferRequest = {
  fixtureId: number;
  transfers: Array<{
    playerOutId: number | string;
    playerInId: number | string;
  }>;
};

export type TransferHistoryItem = {
  id: string;
  teamId?: string;
  playerOutId?: number | string;
  playerInId?: number | string;
  amountOut?: number;
  amountIn?: number;
  netAmount?: number;
  type?: string;
  fixtureId?: number | string;
  triggeredByUserId?: string;
  createdAt?: string;
};

export interface CreateTeamPayload {
  name: string;
  logoUrl?: string;
}

interface CreateTeamResponse {
  success?: boolean;
  data: Team & { logoUrl?: string };
}

interface GetMyTeamResponse {
  success?: boolean;
  data: {
    team?: Team & { logoUrl?: string; budgetTotal?: number; budgetRemaining?: number };
    currentSquad?: {
      players?: Array<{
        player?: {
          id?: number | string;
          name?: string;
          image?: string;
          position?: {
            code?: string;
            developer_name?: string;
            name?: string;
          };
          rating?: number;
          points?: number;
          price?: number;
        };
      }>;
    };
  };
}

type PlayerListMeta = {
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  sortBy?: [string, string][];
};

type PlayerListLinks = {
  current?: string;
  next?: string;
  last?: string;
  prev?: string;
};

type PlayerApiItem = {
  id?: number | string;
  name?: string;
  commonName?: string;
  image?: string;
  pool?: string;
  positionId?: number;
  position?: {
    id?: number;
    code?: string;
    name?: string;
    developer_name?: string;
  };
  countryId?: number;
  externalId?: number;
  rating?: number;
  points?: number;
  price?: number;
};

type GetPlayersResponse = {
  success?: boolean;
  data?: {
    data?: PlayerApiItem[];
    meta?: PlayerListMeta;
    links?: PlayerListLinks;
  };
};

export const teamApi = {
  createTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    const response = await apiClient.post<CreateTeamResponse>("/fantasy/team", payload);
    const data = (response.data as CreateTeamResponse).data ?? (response.data as unknown as Team);

    return {
      ...data,
      logo: data.logo ?? (data as { logoUrl?: string }).logoUrl,
    };
  },

  getMyTeam: async (): Promise<GetMyTeamResponse["data"]> => {
    const response = await apiClient.get<GetMyTeamResponse>("/fantasy/team/me");
    return (response.data as GetMyTeamResponse).data ?? (response.data as unknown as GetMyTeamResponse["data"]);
  },

  getPlayers: async (params?: { page?: number; limit?: number; search?: string; position?: string }) => {
    const response = await apiClient.get<GetPlayersResponse>("/players", { params });
    const payload = (response.data as GetPlayersResponse)?.data;

    return {
      players: payload?.data ?? [],
      meta: payload?.meta,
      links: payload?.links,
    };
  },

  getTeamBoosts: async () => {
    const response = await apiClient.get<{
      data?: Array<{
        id?: string | number;
        type?: string;
        used?: boolean;
        gameweekId?: number;
      }>;
    }>("/fantasy/team/boosts");

    return response.data?.data ?? [];
  },

  applyTeamBoost: async (type: string) => {
    const response = await apiClient.post<{ message?: string; type?: string; gameweekId?: number }>(
      "/fantasy/team/boost",
      { type }
    );
    return response.data;
  },

  createSquad: async (payload: {
    formation: string;
    squad: Array<{
      playerId: number;
      isStarting: boolean;
      isCaptain?: boolean;
      isViceCaptain?: boolean;
      isPenaltyTaker?: boolean;
      isFreeKickTaker?: boolean;
    }>;
  }): Promise<void> => {
    await apiClient.post("/fantasy/team/squad", payload);
  },

  updateLineup: async (payload: {
    formation: string;
    startingPlayerIds: Array<string | number>;
    benchPlayerIds: Array<string | number>;
    fixtureId: number;
  }): Promise<void> => {
    await apiClient.post("/fantasy/team/lineup", payload);
  },

  updateRoles: async (payload: {
    captainId?: string | number;
    viceCaptainId?: string | number;
    penaltyTakerId?: string | number;
    freeKickTakerId?: string | number;
    fixtureId: number;
  }): Promise<void> => {
    await apiClient.post("/fantasy/team/roles", payload);
  },

  getUpcomingFixtures: async (params?: { limit?: number }) => {
    const response = await apiClient.get<{
      data?: Array<{
        id?: number | string;
        startingAt?: string;
        stageId?: number;
        gameweekId?: number;
        participants?: Array<{
          id?: number | string;
          name?: string;
          short?: string;
          logo?: string;
        }>;
      }>;
    }>("/fantasy/fixtures/upcoming", { params });

    return response.data?.data ?? [];
  },

  makeTransfers: async (payload: TransferRequest) => {
    await apiClient.post("/fantasy/team/transfers", payload);
  },

  getTransferHistory: async (): Promise<TransferHistoryItem[]> => {
    const response = await apiClient.get<{ data?: TransferHistoryItem[] }>("/fantasy/team/transfers");
    const raw = response.data;
    const items = Array.isArray(raw)
      ? (raw as TransferHistoryItem[])
      : raw?.data ?? [];
    return items.map((item, index) => ({
      ...item,
      id: item.id ?? `${item.teamId ?? "transfer"}-${index}`,
    }));
  },
};
