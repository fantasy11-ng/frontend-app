import type { GroupPredictionResponse } from './predictor';

// ---- Tournament stages (/stages) ----
export interface Stage {
  id: number;
  name: string;
  code: string;
  externalLeagueId: number;
  externalSeasonId: number;
  finished: boolean;
  startingAt: string;
  endingAt: string;
}

export interface StagesResponse {
  success: boolean;
  data: Stage[];
}

// ---- Group stage predictions (/predictor/me/{stageId}) ----
export interface StagePredictionsResponse {
  success: boolean;
  data: GroupPredictionResponse[];
}

// ---- Bracket rounds (/predictor/bracket/{roundCode}) ----
export type RoundCode = 'r16' | 'qf' | 'sf' | 'final' | 'third-place';
export type ThirdPlaceRoundCode = 'third-place';

export interface BracketPredictionInput {
  externalFixtureId: number;
  predictedWinnerTeamId: number;
}

export interface BracketPredictionsRequest {
  predictions: BracketPredictionInput[];
}

export type BracketPrediction = BracketPredictionInput;

export interface BracketPredictionsResponse {
  success: boolean;
  data: BracketPrediction[];
}

// Seeded participants for a round (/predictor/bracket/{roundCode}/seed)
export interface BracketSeedTeam {
  id: number;
  name: string;
  short: string;
  logo: string;
}

export interface BracketSeedFixture {
  externalFixtureId: number;
  homeTeam: BracketSeedTeam;
  awayTeam: BracketSeedTeam;
}

// New API response structure for bracket rounds
export interface BracketSeedPair {
  home: BracketSeedTeam | { id: number | null; name: string; short: string; logo: string };
  away: BracketSeedTeam | { id: number | null; name: string; short: string; logo: string };
}

export interface BracketSeedData {
  round: string;
  qualified: {
    winners: number[];
    runnersUp: number[];
    thirdQualified: number[];
  };
  participants: (number | null)[];
  pairs: BracketSeedPair[];
}

export interface BracketSeedResponse {
  success: boolean;
  data: BracketSeedFixture[] | BracketSeedData;
}

// ---- Third-placed qualifiers (/predictor/third-placed-qualifiers) ----

export interface ThirdPlacedQualifiersRequest {
  ranking: number[]; // Array of team IDs in ranked order
}

export interface ThirdPlacedQualifiersResponse {
  success: boolean;
  data: {
    ranking: number[]; // Array of team IDs in ranked order
  };
}

// ---- Competition details (/predictor/competition) ----

export interface CompetitionData {
  competition: string;
  override: string;
  leagueName: string;
  seasonId: number;
}

export interface CompetitionResponse {
  success: boolean;
  data: CompetitionData;
}


