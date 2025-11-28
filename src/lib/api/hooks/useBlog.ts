import { useQuery } from '@tanstack/react-query';
import { blogApi, GetBlogPostsParams } from '../blog';
import type { BlogPostsResponse, BlogPostDetailResponse } from '@/types/news';

export function useBlogPosts(params?: GetBlogPostsParams) {
  return useQuery<BlogPostsResponse['data']>({
    queryKey: ['blog', 'posts', params],
    queryFn: () => blogApi.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPostDetailResponse['data']>({
    queryKey: ['blog', 'post', slug],
    queryFn: () => blogApi.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

