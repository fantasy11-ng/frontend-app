import { apiClient } from './client';
import {
  GroupsResponse,
  SaveGroupPredictionRequest,
  SaveGroupPredictionResponse,
  GroupPredictionResponse,
} from '@/types/predictor';
import type {
  StagePredictionsResponse,
  StagesResponse,
  Stage,
  RoundCode,
  BracketPredictionsRequest,
  BracketPredictionsResponse,
  BracketSeedResponse,
  BracketSeedFixture,
  ThirdPlacedQualifiersRequest,
  ThirdPlacedQualifiersResponse,
  CompetitionResponse,
  CompetitionData,
} from '@/types/predictorStage';

// Predictor API functions
export const predictorApi = {
  // GET /stages - Get all tournament stages
  getStages: async (): Promise<Stage[]> => {
    const response = await apiClient.get<StagesResponse>('/stages');
    return response.data.data;
  },

  // GET /predictor/groups - Get all groups with teams
  getGroups: async (): Promise<GroupsResponse['data']> => {
    const response = await apiClient.get<GroupsResponse>('/predictor/groups');
    return response.data.data;
  },

  // GET /predictor/me/{stageId} - Get user's predictions for a specific stage
  getStagePredictions: async (stageId: number): Promise<GroupPredictionResponse[]> => {
    const response = await apiClient.get<StagePredictionsResponse | GroupPredictionResponse[]>(
      `/predictor/me/${stageId}`,
    );

    // Handle both wrapped and raw array responses
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data as StagePredictionsResponse).data;

    return data;
  },

  // ----- Bracket rounds (r16, qf, sf, final) -----

  // GET /predictor/bracket/{roundCode}/seed - seeded participants for a round
  getBracketSeed: async (roundCode: RoundCode): Promise<BracketSeedFixture[]> => {
    const response = await apiClient.get<BracketSeedResponse>(`/predictor/bracket/${roundCode}/seed`);
    return response.data.data;
  },

  // GET /predictor/bracket/{roundCode}/me - user's bracket predictions for a round
  getBracketPredictions: async (roundCode: RoundCode): Promise<BracketPredictionsResponse['data']> => {
    const response = await apiClient.get<BracketPredictionsResponse>(
      `/predictor/bracket/${roundCode}/me`,
    );
    return response.data.data;
  },

  // POST /predictor/bracket/{roundCode} - submit winners for a round
  saveBracketPredictions: async (
    roundCode: RoundCode,
    data: BracketPredictionsRequest,
  ): Promise<BracketPredictionsResponse['data']> => {
    const response = await apiClient.post<BracketPredictionsResponse>(
      `/predictor/bracket/${roundCode}`,
      data,
    );
    return response.data.data;
  },

  // POST /predictor - Save group stage prediction
  saveGroupPrediction: async (data: SaveGroupPredictionRequest): Promise<SaveGroupPredictionResponse['data']> => {
    const response = await apiClient.post<SaveGroupPredictionResponse>('/predictor', data);
    return response.data.data;
  },

  // ----- Third-placed qualifiers -----

  // GET /predictor/third-placed-qualifiers/me - Get user's ranking of 3rd place teams
  getThirdPlacedQualifiers: async (): Promise<number[]> => {
    const response = await apiClient.get<ThirdPlacedQualifiersResponse | { ranking: number[] } | number[]>(
      '/predictor/third-placed-qualifiers/me',
    );
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      // Direct array response
      return response.data;
    }
    
    if ('ranking' in response.data && Array.isArray(response.data.ranking)) {
      // Unwrapped object with ranking
      return response.data.ranking;
    }
    
    // Wrapped response with success and data
    const wrapped = response.data as ThirdPlacedQualifiersResponse;
    return wrapped.data?.ranking || [];
  },

  // POST /predictor/third-placed-qualifiers - Submit ranking of 3rd place teams
  saveThirdPlacedQualifiers: async (data: ThirdPlacedQualifiersRequest): Promise<number[]> => {
    const response = await apiClient.post<ThirdPlacedQualifiersResponse>(
      '/predictor/third-placed-qualifiers',
      data,
    );
    return response.data.data.ranking;
  },

  // ----- Third-place match -----

  // GET /predictor/bracket/third-place-match/seed - seeded participants for third place match
  // Note: Uses bracket seed endpoint pattern
  getThirdPlaceMatchSeed: async (): Promise<BracketSeedFixture[]> => {
    const response = await apiClient.get<BracketSeedResponse>('/predictor/bracket/third-place/seed');
    return response.data.data;
  },

  // GET /predictor/third-place-match/me - user's third place match prediction
  getThirdPlaceMatchPrediction: async (): Promise<BracketPredictionsResponse['data']> => {
    const response = await apiClient.get<BracketPredictionsResponse>(
      '/predictor/third-place/me',
    );
    return response.data.data;
  },

  // POST /predictor/third-place-match - submit third place match prediction
  saveThirdPlaceMatchPrediction: async (
    data: BracketPredictionsRequest,
  ): Promise<BracketPredictionsResponse['data']> => {
    const response = await apiClient.post<BracketPredictionsResponse>(
      '/predictor/third-place-match',
      data,
    );
    return response.data.data;
  },

  // ----- Competition details -----

  // GET /predictor/competition - Get competition details
  getCompetition: async (): Promise<CompetitionData> => {
    const response = await apiClient.get<CompetitionResponse>('/predictor/competition');
    return response.data.data;
  },
};

