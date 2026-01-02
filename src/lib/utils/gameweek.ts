/**
 * Maps backend gameweekId to the actual gameweek number for display
 */
export const GAMEWEEK_ID_MAP: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 7,
  5: 5,
  6: 4,
  7: 6,
};

/**
 * Get the display gameweek number from a backend gameweekId
 * @param gameweekId - The backend gameweekId
 * @returns The actual gameweek number for display
 */
export const getGameweekNumber = (gameweekId: number): number => {
  return GAMEWEEK_ID_MAP[gameweekId] ?? gameweekId;
};

/**
 * Format gameweek for display (short form: "GW 1")
 * @param gameweekId - The backend gameweekId
 * @returns Formatted string like "GW 1" or "Upcoming" if null/undefined
 */
export const formatGameweekShort = (gameweekId: number | null | undefined): string => {
  if (!gameweekId) return "Upcoming";
  return `GW ${getGameweekNumber(gameweekId)}`;
};

/**
 * Format gameweek for display (long form: "Gameweek 1")
 * @param gameweekId - The backend gameweekId
 * @returns Formatted string like "Gameweek 1" or "Gameweek -" if null/undefined
 */
export const formatGameweekLong = (gameweekId: number | null | undefined): string => {
  if (!gameweekId) return "Gameweek -";
  return `Gameweek ${getGameweekNumber(gameweekId)}`;
};

