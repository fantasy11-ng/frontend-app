export interface Team {
  id: number;
  name: string;
  logo: string;
  short: string;
}

export interface Group {
  id: number;
  name: string;
  teams: Team[];
  myPrediction: string[] | GroupPredictionResponse | null; // ordered list of team names [1st..4th] or prediction object
}

export interface GroupsResponse {
  success: boolean;
  data: Group[];
}

export interface TeamWithIndex {
  id: number;
  index: number;
}

export interface SaveGroupPredictionRequest {
  teams: TeamWithIndex[];
  stageId: number;
  groupId: number;
  winnerId: number;
  runnerUpId: number;
}

export interface TeamWithIndexResponse extends Team {
  index: number;
}

export interface GroupPredictionResponse {
  id: number;
  stageId: number;
  groupId: number;
  externalSeasonId: number;
  winner: Team;
  runnerUp: Team;
  teams: TeamWithIndexResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveGroupPredictionResponse {
  success: boolean;
  data: GroupPredictionResponse;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  venue: string;
  group: string;
}

export interface Prediction {
  matchId: string;
  homeScore: number | null;
  awayScore: number | null;
  winner: 'home' | 'away' | 'draw' | null;
}

export interface PredictionResult {
  matchId: string;
  actualHomeScore: number;
  actualAwayScore: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  points: number;
  isCorrect: boolean;
}

export interface UserStats {
  totalPoints: number;
  accuracy: number;
  totalPredictions: number;
  correctPredictions: number;
  rank: number;
}
