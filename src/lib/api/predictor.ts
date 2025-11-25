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
  BracketSeedData,
  BracketSeedPair,
  BracketSeedWithQualified,
  ThirdPlacedQualifiersRequest,
  ThirdPlacedQualifiersResponse,
  CompetitionResponse,
  CompetitionData,
} from '@/types/predictorStage';

const emptyQualified = { winners: [] as number[], runnersUp: [] as number[], thirdQualified: [] as number[] };

const parseBracketSeedResponse = (data: BracketSeedResponse['data']): BracketSeedWithQualified => {
  if (!Array.isArray(data) && data && typeof data === 'object' && 'pairs' in data) {
    const bracketData = data as BracketSeedData;
    const fixtures: BracketSeedFixture[] = [];

    bracketData.pairs.forEach((pair, index: number) => {
      const pairWithIds = pair as BracketSeedPair & { fixtureId?: number; externalFixtureId?: number; id?: number };
      const externalFixtureId =
        pairWithIds.fixtureId ||
        pairWithIds.externalFixtureId ||
        pairWithIds.id ||
        (bracketData.participants && bracketData.participants[index] !== null
          ? bracketData.participants[index]
          : null) ||
        index + 1000;

      const homeTeam =
        pair.home &&
        pair.home.id !== null &&
        pair.home.id !== undefined &&
        typeof pair.home.id === 'number'
          ? {
              id: pair.home.id,
              name: pair.home.name || '',
              short: pair.home.short || '',
              logo: pair.home.logo || '',
            }
          : null;

      const awayTeam =
        pair.away &&
        pair.away.id !== null &&
        pair.away.id !== undefined &&
        typeof pair.away.id === 'number'
          ? {
              id: pair.away.id,
              name: pair.away.name || '',
              short: pair.away.short || '',
              logo: pair.away.logo || '',
            }
          : null;

      if (homeTeam && awayTeam && homeTeam.id && awayTeam.id) {
        fixtures.push({
          externalFixtureId: typeof externalFixtureId === 'number' ? externalFixtureId : index + 1000,
          homeTeam,
          awayTeam,
        });
      }
    });

    if (fixtures.length === 0) {
      console.warn(`No valid fixtures found in bracket seed. Response:`, bracketData);
    }

    return {
      fixtures,
      qualified: bracketData.qualified || emptyQualified,
    };
  }

  return {
    fixtures: Array.isArray(data) ? data : [],
    qualified: emptyQualified,
  };
};

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
    const parsed = parseBracketSeedResponse(response.data.data);
    return parsed.fixtures;
  },

  // GET /predictor/bracket/{roundCode}/seed with qualified info
  getBracketSeedWithQualified: async (roundCode: RoundCode): Promise<BracketSeedWithQualified> => {
    const response = await apiClient.get<BracketSeedResponse>(`/predictor/bracket/${roundCode}/seed`);
    return parseBracketSeedResponse(response.data.data);
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

  // GET /predictor/bracket/third-place/seed - seeded participants for third place match
  // Uses the same bracket seed endpoint pattern with roundCode 'third-place'
  getThirdPlaceMatchSeed: async (): Promise<BracketSeedFixture[]> => {
    // Use the same getBracketSeed function with 'third-place' as roundCode
    return predictorApi.getBracketSeed('third-place' as RoundCode);
  },

  // GET /predictor/bracket/third-place/me - user's third place match prediction
  // Uses the same bracket predictions endpoint pattern with roundCode 'third-place'
  getThirdPlaceMatchPrediction: async (): Promise<BracketPredictionsResponse['data']> => {
    // Use the same getBracketPredictions function with 'third-place' as roundCode
    return predictorApi.getBracketPredictions('third-place' as RoundCode);
  },

  // POST /predictor/bracket/third-place - submit third place match prediction
  // Uses the same bracket predictions endpoint pattern with roundCode 'third-place'
  saveThirdPlaceMatchPrediction: async (
    data: {
      externalFixtureId: number;
      predictedWinnerTeamId: number;
    },
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      '/predictor/third-place-match',
      data,
    );
    return response.data;
  },

  // ----- Competition details -----

  // GET /predictor/competition - Get competition details
  getCompetition: async (): Promise<CompetitionData> => {
    const response = await apiClient.get<CompetitionResponse>('/predictor/competition');
    return response.data.data;
  },
};

