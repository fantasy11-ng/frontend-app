export interface PlayerPosition {
  id?: number;
  code?: string;
  name?: string;
  developer_name?: string;
}

export interface Player {
  id: number;
  name: string;
  commonName?: string;
  image?: string;
  pool?: string;
  positionId?: number;
  position?: PlayerPosition;
  countryId?: number;
  externalId?: number;
  rating?: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  points: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerListMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: [string, string][];
}

export interface TopStat {
  title: string;
  country: string;
  playerName: string;
  value: string;
  icon: 'points' | 'goals' | 'assists';
}
