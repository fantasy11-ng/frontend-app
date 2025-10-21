'use client';

import { NewsArticle } from '@/types';
import Link from 'next/link';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Article Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <div className="text-white text-4xl opacity-20">⚽</div>
          </div>
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
            <span>{article.publishedAt}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
