// Blog Category Slugs - These are stable across environments (staging and production)
export const BLOG_CATEGORY_SLUGS = {
  team: "team",
  player: "player",
  general: "general",
} as const;

// Blog category options for dropdowns/filters (using slugs)
export const BLOG_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: BLOG_CATEGORY_SLUGS.general, label: "General News" },
  { value: BLOG_CATEGORY_SLUGS.team, label: "Team News" },
  { value: BLOG_CATEGORY_SLUGS.player, label: "Player News" },
] as const;

