'use client';

import Link from 'next/link';
import { NewsArticle } from '@/types/news';

interface RelatedNewsProps {
  articles: NewsArticle[];
}

export default function RelatedNews({ articles }: RelatedNewsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Related news</h2>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.id}`}
            className="block group"
          >
            <div className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Article Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-lg opacity-20">⚽</div>
                </div>
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h3>
                
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-xs text-gray-400">
                  <span>{article.publishedAt}</span>
                  <span className="mx-1">•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
