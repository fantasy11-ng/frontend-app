export interface GlobalRanking {
  id: string;
  rank: number;
  team: string;
  manager: string;
  totalPoints: number;
  cleansheet: number;
  goals: number;
  assists: number;
  cards: number;
}

export interface AthleteRanking {
  id: string;
  rank: number;
  player: string;
  country: string;
  points: number;
  cleansheet: number;
  goals: number;
  assists: number;
  cards: number;
}

export type SortField = 'totalPoints' | 'cleansheet' | 'goals' | 'assists' | 'cards' | 'points';
export type SortDirection = 'asc' | 'desc' | null;

