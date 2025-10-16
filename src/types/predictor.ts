export interface Team {
  name: string;
  flag: string;
  code: string;
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
