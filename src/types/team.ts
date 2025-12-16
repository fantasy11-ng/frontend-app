export interface Team {
  id: string;
  name: string;
  logo?: string;
  points: number;
  budget: number;
  manager: string;
}

export interface TeamBoost {
  id: string;
  name: string;
  description: string;
  used: boolean;
}

export interface Fixture {
  id: string;
  homeTeam: {
    name: string;
    flag?: string;
  };
  awayTeam: {
    name: string;
    flag?: string;
  };
  matchDay: string;
  date: string;
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'ATT';
export type PlayerRole = 'captain' | 'vice-captain' | null;

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  country: string;
  image?: string;
  countryFlag?: string;
  club?: string;
  jerseyNumber?: number;
  price: number;
  points: number;
  goals?: number;
  assists?: number;
  cards?: number;
  age?: number;
  height?: string;
  weight?: string;
  index?: number;
  rating?: number;
  selected: boolean;
  inSquad?: boolean;
  inStarting11?: boolean;
  onBench?: boolean;
  role?: PlayerRole;
  isPenaltyTaker?: boolean;
  isFreeKickTaker?: boolean;
}

export interface SquadPlayer extends Player {
  squadPosition?: 'starting' | 'bench';
  formationPosition?: {
    x: number;
    y: number;
  };
  /**
   * Unique identifier for the squad entry (not the player id).
   * Use this for role/lineup updates when the API expects the squad row id.
   */
  squadEntryId?: string;
}

export interface Squad {
  players: SquadPlayer[];
  budget: number;
  formation: string; // e.g., "4-3-3"
}

export interface SquadValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

