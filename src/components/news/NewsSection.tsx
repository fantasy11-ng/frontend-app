'use client';

import Link from 'next/link';
import NewsCard from './NewsCard';
import { BlogPostListItem } from '@/types/news';

interface NewsSectionProps {
  title: string;
  articles: BlogPostListItem[];
  seeAllLink: string;
}

export default function NewsSection({ title, articles, seeAllLink }: NewsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#070A11]">{title}</h2>
        <Link 
          href={seeAllLink}
          className="text-[#4AA96C] hover:text-[#070A11] font-medium transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {articles.map((article) => (
          <div key={article.id} className="flex-shrink-0 w-full min-w-[280px] max-w-[300px]">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
