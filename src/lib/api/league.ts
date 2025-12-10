import { apiClient } from "./client";

export interface CreateLeaguePayload {
  name: string;
}

export interface LeagueData {
  id: string;
  name: string;
  invitationCode?: string;
  createdAt?: string;
}

interface CreateLeagueResponse {
  success?: boolean;
  data: LeagueData;
}

export const leagueApi = {
  createLeague: async (payload: CreateLeaguePayload): Promise<LeagueData> => {
    const response = await apiClient.post<CreateLeagueResponse>(
      "/fantasy/leagues",
      payload
    );
    // Some endpoints wrap data, some return raw; normalize to data
    return (response.data as CreateLeagueResponse).data ?? (response.data as unknown as LeagueData);
  },
};
