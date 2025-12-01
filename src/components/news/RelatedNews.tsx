'use client';

import Link from 'next/link';
import { BlogPostListItem } from '@/types/news';

interface RelatedNewsProps {
  articles: BlogPostListItem[];
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

export default function RelatedNews({ articles }: RelatedNewsProps) {
  return (
    <div className="rounded-xl border border-[#F1F2F4] p-6">
      <h2 className="text-xl font-bold text-[#070A11] mb-6">Related news</h2>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="block group"
          >
            <div className="pb-4 border-b border-[#F1F2F4] last:border-b-0 last:pb-0">
              {/* Article Content */}
              <div>
                <h3 className="text-sm font-medium text-[#070A11] group-hover:text-[#4AA96C] transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                
                <p className="text-xs text-[#656E81] line-clamp-2 mb-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-xs text-[#656E81]">
                  <span>{formatDate(article.createdAt)}</span>
                  <span className="mx-1">•</span>
                  <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
