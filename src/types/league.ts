export interface LeagueMember {
  id: string;
  rank: number;
  team: string;
  manager: string;
  totalPoints: number;
  matchDayPoints: number;
  budget: string;
  cleansheet: number;
  goals: number;
  assists: number;
  cards: number;
}

export interface League {
  id: string;
  name: string;
  invitationCode: string;
  members: number;
  maxMembers: number;
  admin: string;
  type: 'private' | 'global';
}

export interface UserLeague {
  id: string;
  name: string;
  inviteCode?: string;
  isPublic?: boolean;
  participantCount?: number;
  maxParticipants?: number;
  isOwner?: boolean;
  ownerName?: string;
}

export interface LeagueStats {
  globalRank: number;
  totalPoints: number;
  budgetLeft: string;
}

export interface ChampionshipDetails {
  totalPrizePool: string;
  activeManagers: string;
  winnerPrize: string;
  entryFee: string;
}

export type LeagueOption = 'create' | 'join' | 'championship';

