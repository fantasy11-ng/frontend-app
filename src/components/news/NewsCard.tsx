'use client';

import { BlogPostListItem } from '@/types/news';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  article: BlogPostListItem;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Article Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
          {article.coverImageUrl ? (
            <Image
              fill
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <div className="text-white text-4xl opacity-20">⚽</div>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center text-xs text-gray-500">
            <span>{formatDate(article.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{formatReadingTime(article.readingTimeMinutes)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
