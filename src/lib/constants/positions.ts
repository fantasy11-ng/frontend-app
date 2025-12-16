// Position ID mappings from the API
// These map position names to their API IDs for filtering

export const POSITION_ID_MAP: Record<string, number> = {
  'Goalkeeper': 24,
  'Defender': 25,
  'Midfielder': 26,
  'Attacker': 27,
};

// Reverse map: position ID to name (for displaying in UI)
export const POSITION_NAME_MAP: Record<number, string> = Object.entries(POSITION_ID_MAP).reduce(
  (acc, [name, id]) => ({ ...acc, [id]: name }),
  {} as Record<number, string>
);

// Get all position names
export const POSITION_NAMES = Object.keys(POSITION_ID_MAP);

// Helper to get position name from ID
export const getPositionName = (positionId: number | undefined): string => {
  if (!positionId) return '-';
  return POSITION_NAME_MAP[positionId] || String(positionId);
};

// Helper to get position ID from name
export const getPositionId = (positionName: string): number | undefined => {
  return POSITION_ID_MAP[positionName];
};
