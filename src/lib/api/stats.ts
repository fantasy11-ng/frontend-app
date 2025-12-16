import { apiClient } from "./client";

// Types for API response
export type PlayerPosition = {
  id?: number;
  code?: string;
  name?: string;
  developer_name?: string;
};

export type PlayerApiItem = {
  id: number;
  name: string;
  commonName?: string;
  image?: string;
  pool?: string;
  positionId?: number;
  position?: PlayerPosition;
  countryId?: number;
  externalId?: number;
  rating?: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  points: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PlayerListMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: [string, string][];
};

export type PlayerListLinks = {
  current?: string;
  next?: string;
  last?: string;
  prev?: string;
};

type GetPlayersResponse = {
  success?: boolean;
  data?: {
    data?: PlayerApiItem[];
    meta?: PlayerListMeta;
    links?: PlayerListLinks;
  };
};

export type GetPlayersParams = {
  page?: number;
  limit?: number;
  search?: string;
  positionId?: number;
  countryId?: number;
  sortBy?: string;
};

export const statsApi = {
  getPlayers: async (params?: GetPlayersParams) => {
    // Build query params - need to use filter.X format for NestJS paginate
    const queryParams: Record<string, string | number> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.positionId) queryParams['filter.positionId'] = params.positionId;
    if (params?.countryId) queryParams['filter.countryId'] = params.countryId;

    const response = await apiClient.get<GetPlayersResponse>("/players", { params: queryParams });
    const payload = (response.data as GetPlayersResponse)?.data;

    return {
      players: payload?.data ?? [],
      meta: payload?.meta ?? {
        itemsPerPage: 20,
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
      },
      links: payload?.links,
    };
  },
};
