// Country ID mappings from the API
// These map country names to their API IDs for filtering

export const COUNTRY_ID_MAP: Record<string, number> = {
  'Algeria': 614,
  'Angola': 911,
  'Benin': 7830,
  'Botswana': 191038,
  'Burkina Faso': 607,
  'Cameroon': 593,
  'Cape Verde Islands': 772,
  'Comoros': 364678,
  'Congo DR': 1320,
  'Côte d\'Ivoire': 23,
  'Egypt': 886,
  'Equatorial Guinea': 211975,
  'Gabon': 3662,
  'Gambia': 2507,
  'Ghana': 468,
  'Guinea': 1703,
  'Guinea-Bissau': 1707,
  'Mali': 26,
  'Mauritania': 2493,
  'Morocco': 1424,
  'Mozambique': 6783,
  'Namibia': 5790,
  'Nigeria': 716,
  'Senegal': 200,
  'South Africa': 146,
  'Sudan': 56518,
  'Tanzania': 35210,
  'Tunisia': 1439,
  'Uganda': 4125,
  'Zambia': 2568,
  'Zimbabwe': 2325,
};

// Reverse map: country ID to name (for displaying in UI)
export const COUNTRY_NAME_MAP: Record<number, string> = Object.entries(COUNTRY_ID_MAP).reduce(
  (acc, [name, id]) => ({ ...acc, [id]: name }),
  {} as Record<number, string>
);

// Get all country names sorted alphabetically
export const COUNTRY_NAMES = Object.keys(COUNTRY_ID_MAP).sort();

// Helper to get country name from ID
export const getCountryName = (countryId: number | undefined): string => {
  if (!countryId) return '-';
  return COUNTRY_NAME_MAP[countryId] || String(countryId);
};

// Helper to get country ID from name
export const getCountryId = (countryName: string): number | undefined => {
  return COUNTRY_ID_MAP[countryName];
};
