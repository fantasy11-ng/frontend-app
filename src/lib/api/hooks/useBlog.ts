import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi, GetBlogPostsParams } from '../blog';
import type { 
  BlogPostsResponse, 
  BlogPostDetailResponse, 
  BlogCategory, 
  BlogTag,
  CreatePostData,
  UpdatePostData,
  BlogPost,
} from '@/types/news';
import toast from 'react-hot-toast';

// API Error type for axios-style errors
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query keys
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  postsList: (params?: GetBlogPostsParams) => [...blogKeys.posts(), params] as const,
  post: (slug: string) => [...blogKeys.posts(), slug] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
};

// Get list of posts
export function useBlogPosts(params?: GetBlogPostsParams) {
  return useQuery<BlogPostsResponse>({
    queryKey: blogKeys.postsList(params),
    queryFn: async () => {
      const result = await blogApi.getPosts(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Get single post by slug
export function useBlogPost(slug: string) {
  return useQuery<BlogPostDetailResponse>({
    queryKey: blogKeys.post(slug),
    queryFn: () => blogApi.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Get all categories
export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: blogKeys.categories(),
    queryFn: () => blogApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Get all tags
export function useBlogTags() {
  return useQuery<BlogTag[]>({
    queryKey: blogKeys.tags(),
    queryFn: () => blogApi.getTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Create new post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPost, Error, CreatePostData>({
    mutationFn: (data) => blogApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      toast.success('Article created successfully!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error.message || 'Failed to create article';
      toast.error(message);
    },
  });
}

// Update post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPost, Error, { id: string; data: UpdatePostData }>({
    mutationFn: ({ id, data }) => blogApi.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      if (variables.data.slug) {
        queryClient.invalidateQueries({ queryKey: blogKeys.post(variables.data.slug) });
      }
      toast.success('Article updated successfully!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error.message || 'Failed to update article';
      toast.error(message);
    },
  });
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => blogApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      toast.success('Article deleted successfully!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error.message || 'Failed to delete article';
      toast.error(message);
    },
  });
}

// Create tag
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation<BlogTag, Error, { name: string; slug: string }>({
    mutationFn: (data) => blogApi.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
      toast.success('Tag created successfully!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error.message || 'Failed to create tag';
      toast.error(message);
    },
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<BlogCategory, Error, { name: string; slug: string }>({
    mutationFn: (data) => blogApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      toast.success('Category created successfully!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error.message || 'Failed to create category';
      toast.error(message);
    },
  });
}
