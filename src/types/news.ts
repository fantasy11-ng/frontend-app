export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: 'general' | 'team' | 'player';
  image: string;
  featured?: boolean;
  tags: string[];
}

export interface NewsCategory {
  value: string;
  label: string;
}

export interface NewsSearchFilters {
  query: string;
  category: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
