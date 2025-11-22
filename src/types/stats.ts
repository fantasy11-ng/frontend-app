export interface Player {
  id: string;
  rank: number;
  name: string;
  country: string;
  countryFlag: string;
  club: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  price: string;
  points: number;
  goals: number;
  assists: number;
  cards: number;
  index: number;
}

export interface TopStat {
  title: string;
  country: string;
  playerName: string;
  value: string;
  icon: 'points' | 'goals' | 'assists';
}

