import { apiClient } from './client';
import type {
  BlogPost,
  BlogPostsResponse,
  BlogPostDetailResponse,
  BlogCategory,
  BlogTag,
  CreatePostData,
  UpdatePostData,
  CreateCategoryData,
  CreateTagData,
} from '@/types/news';

export interface GetBlogPostsParams {
  q?: string;
  status?: 'draft' | 'published';
  category?: string; // UUID
  tag?: string; // UUID
  page?: number;
  limit?: number;
}

// Blog API functions
export const blogApi = {
  // GET /blog/posts - Get list of blog posts (public, no auth needed)
  getPosts: async (params?: GetBlogPostsParams): Promise<BlogPostsResponse> => {
    const response = await apiClient.get<{ success: boolean; data: BlogPostsResponse }>('/blog/posts', { params });
    // API returns { success: true, data: { items, total, page, limit } }
    return response.data.data;
  },

  // GET /blog/posts/{slug} - Get single blog post by slug (public, no auth needed)
  getPostBySlug: async (slug: string): Promise<BlogPostDetailResponse> => {
    const response = await apiClient.get<{ success: boolean; data: BlogPostDetailResponse }>(`/blog/posts/${slug}`);
    // API returns { success: true, data: { post, related } }
    return response.data.data;
  },

  // POST /blog/posts - Create new blog post (admin)
  createPost: async (data: CreatePostData): Promise<BlogPost> => {
    const response = await apiClient.post<BlogPost>('/blog/posts', data);
    return response.data;
  },

  // PATCH /blog/posts/{id} - Update blog post (admin)
  updatePost: async (id: string, data: UpdatePostData): Promise<BlogPost> => {
    const response = await apiClient.patch<BlogPost>(`/blog/posts/${id}`, data);
    return response.data;
  },

  // DELETE /blog/posts/{id} - Delete blog post (admin)
  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/blog/posts/${id}`);
    return response.data;
  },

  // GET /blog/categories - Get all categories (public, no auth needed)
  getCategories: async (): Promise<BlogCategory[]> => {
    const response = await apiClient.get<BlogCategory[] | { success: boolean; data: BlogCategory[] }>('/blog/categories');
    // Handle both wrapped and unwrapped responses
    if (response.data && 'success' in response.data && 'data' in response.data) {
      return (response.data as { success: boolean; data: BlogCategory[] }).data;
    }
    return response.data as BlogCategory[];
  },

  // POST /blog/categories - Create new category (admin)
  createCategory: async (data: CreateCategoryData): Promise<BlogCategory> => {
    const response = await apiClient.post<BlogCategory>('/blog/categories', data);
    return response.data;
  },

  // PATCH /blog/categories/{id} - Update category (admin)
  updateCategory: async (id: string, data: CreateCategoryData): Promise<BlogCategory> => {
    const response = await apiClient.patch<BlogCategory>(`/blog/categories/${id}`, data);
    return response.data;
  },

  // DELETE /blog/categories/{id} - Delete category (admin)
  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/blog/categories/${id}`);
    return response.data;
  },

  // GET /blog/tags - Get all tags (public, no auth needed)
  getTags: async (): Promise<BlogTag[]> => {
    const response = await apiClient.get<BlogTag[] | { success: boolean; data: BlogTag[] }>('/blog/tags');
    // Handle both wrapped and unwrapped responses
    if (response.data && 'success' in response.data && 'data' in response.data) {
      return (response.data as { success: boolean; data: BlogTag[] }).data;
    }
    return response.data as BlogTag[];
  },

  // POST /blog/tags - Create new tag (admin)
  createTag: async (data: CreateTagData): Promise<BlogTag> => {
    const response = await apiClient.post<BlogTag>('/blog/tags', data);
    return response.data;
  },

  // PATCH /blog/tags/{id} - Update tag (admin)
  updateTag: async (id: string, data: CreateTagData): Promise<BlogTag> => {
    const response = await apiClient.patch<BlogTag>(`/blog/tags/${id}`, data);
    return response.data;
  },

  // DELETE /blog/tags/{id} - Delete tag (admin)
  deleteTag: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/blog/tags/${id}`);
    return response.data;
  },
};
