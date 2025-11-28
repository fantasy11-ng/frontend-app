// Blog API Types
export interface BlogAuthor {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  password: string;
  googleId: string;
  facebookId: string;
  refreshToken: string;
  role: string;
  profileImageUrl: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
}

export interface BlogTag {
  id: string;
  slug: string;
  name: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  readingTimeMinutes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: BlogTag[];
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  readingTimeMinutes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: BlogTag[];
}

export interface BlogPostsResponse {
  success: boolean;
  data: {
    items: BlogPostListItem[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface BlogPostDetailResponse {
  success: boolean;
  data: {
    post: BlogPost;
    related: BlogPostListItem[];
  };
}

// Legacy types for backward compatibility (can be removed after migration)
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
