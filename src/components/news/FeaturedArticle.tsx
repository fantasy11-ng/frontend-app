'use client';

import Link from 'next/link';
import { NewsArticle } from '@/types/news';

interface FeaturedArticleProps {
  article: NewsArticle;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="mb-12">
      <Link href={`/news/${article.id}`} className="block group">
        <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>

          {/* Article Image */}
          <div className="relative h-96 bg-gradient-to-br from-green-400 to-green-600">
            {/* Stadium Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <div className="text-white text-6xl opacity-20">⚽</div>
            </div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Article Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-green-300 transition-colors">
                {article.title}
              </h2>
              
              <div className="flex items-center text-sm text-gray-200 mb-4">
                <span>{article.author}</span>
                <span className="mx-2">•</span>
                <span>{article.publishedAt}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </div>

              <p className="text-lg text-gray-100 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
