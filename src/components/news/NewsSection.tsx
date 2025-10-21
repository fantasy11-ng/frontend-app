'use client';

import Link from 'next/link';
import NewsCard from './NewsCard';
import { NewsArticle } from '@/types/news';

interface NewsSectionProps {
  title: string;
  articles: NewsArticle[];
  seeAllLink: string;
}

export default function NewsSection({ title, articles, seeAllLink }: NewsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link 
          href={seeAllLink}
          className="text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
