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

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team: string;
  price: number;
  points: number;
  selected: boolean;
}

