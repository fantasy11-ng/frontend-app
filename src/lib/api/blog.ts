import { apiClient } from './client';
import type {
  BlogPost,
  BlogPostListItem,
  BlogPostsResponse,
  BlogPostDetailResponse,
} from '@/types/news';

export interface GetBlogPostsParams {
  q?: string;
  status?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

// Blog API functions
export const blogApi = {
  // GET /blog/posts - Get list of blog posts
  getPosts: async (params?: GetBlogPostsParams): Promise<BlogPostsResponse['data']> => {
    const response = await apiClient.get<BlogPostsResponse>('/blog/posts', { params });
    return response.data.data;
  },

  // GET /blog/posts/{slug} - Get single blog post by slug
  getPostBySlug: async (slug: string): Promise<BlogPostDetailResponse['data']> => {
    const response = await apiClient.get<BlogPostDetailResponse>(`/blog/posts/${slug}`);
    return response.data.data;
  },
};

