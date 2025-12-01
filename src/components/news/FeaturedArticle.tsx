'use client';

import Link from 'next/link';
import { BlogPostListItem } from '@/types/news';
import Image from 'next/image';

interface FeaturedArticleProps {
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

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="mb-12">
      <Link href={`/news/${article.slug}`} className="block group">
        <div className="relative bg-white rounded-4xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-[#F5EBEB] text-[#800000] px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>

          {/* Article Image */}
          <div className="relative h-135 bg-gradient-to-br from-green-400 to-green-600">
            {article.coverImageUrl ? (
              <Image
                fill
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"  
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-white text-6xl opacity-20">⚽</div>
              </div>
            )}
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#070A1100] to-[#070A11] opacity-70"></div>

            {/* Article Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <h2 className="max-w-[350px] lg:max-w-[514px] text-xl md:text-4xl font-bold mb-4 group-hover:text-green-300 transition-colors">
                {article.title}
              </h2>
              
              <div className=" items-center text-sm text-gray-200 mb-4">
                <span>{article.author.fullName}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(article.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                <p className="text-xs sm:text-lg text-gray-100 leading-relaxed max-w-[400px]">
                {article.excerpt}
              </p>
              </div>
           
              </div>
             
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
