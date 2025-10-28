'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import RelatedNews from '@/components/news/RelatedNews';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: 'general' | 'team' | 'player';
  image: string;
  featured?: boolean;
  tags: string[];
}

// Mock data - in real app, this would come from API
const mockArticle: NewsArticle = {
  id: '1',
  title: 'AFCON 2025 Fantasy: Complete Guide to Winning Your League',
  excerpt: 'Everything you need to know about dominating your fantasy league this season.',
  content: `
    <p>The AFCON 2025 Fantasy League is set to be an exciting event for football fans around the globe. With the tournament taking place in Morocco, this guide will help you navigate the ins and outs of creating a winning fantasy team.</p>
    
    <p><strong>First, understanding the tournament format is crucial.</strong> The African Cup of Nations features 24 teams divided into six groups of four. Each team plays three group stage matches, with the top two teams from each group advancing to the knockout rounds.</p>
    
    <p><strong>Next, consider the players.</strong> Star players like Mohamed Salah from Egypt or Sadio Mané from Senegal are obvious picks, but don't overlook emerging talents who could provide excellent value for money.</p>
    
    <p><strong>In addition to star players,</strong> focus on players from teams likely to progress deep into the tournament. These players will have more opportunities to score points over the course of the competition.</p>
    
    <p><strong>Another important aspect</strong> is budget management. With a limited budget, you'll need to balance expensive star players with budget-friendly options who can still contribute significantly to your team's performance.</p>
    
    <p><strong>Finally, stay updated</strong> on injuries and team news. The tournament format means that player availability can change quickly, and staying informed will give you an edge over other fantasy managers.</p>
    
    <p>By following these tips and staying engaged throughout the tournament, you'll be well on your way to winning your AFCON 2025 Fantasy League!</p>
  `,
  author: 'Fantasy 11 Editorial Team',
  publishedAt: '1 hour ago',
  readTime: '12 min read',
  category: 'general',
  image: '/api/placeholder/800/400',
  featured: true,
  tags: ['Mohammed Salah', 'Liverpool', 'Morocco', 'Quarter Finals']
};

const relatedArticles: NewsArticle[] = [
  {
    id: '2',
    title: 'Top 10 Players to Watch in AFCON 2025',
    excerpt: 'Discover the star players who could make or break your fantasy team this tournament.',
    content: 'Content here...',
    author: 'Fantasy 11 Editorial Team',
    publishedAt: '2 hours ago',
    readTime: '8 min read',
    category: 'player',
    image: '/api/placeholder/400/250',
    tags: ['Mohammed Salah', 'Sadio Mané', 'Victor Osimhen']
  },
  {
    id: '3',
    title: 'Team Analysis: Nigeria vs Egypt Preview',
    excerpt: 'A deep dive into the tactical battle between two AFCON powerhouses.',
    content: 'Content here...',
    author: 'Fantasy 11 Editorial Team',
    publishedAt: '3 hours ago',
    readTime: '6 min read',
    category: 'team',
    image: '/api/placeholder/400/250',
    tags: ['Nigeria', 'Egypt', 'Group Stage']
  },
  {
    id: '4',
    title: 'Injury Updates: Latest from AFCON 2025',
    excerpt: 'Stay updated with the latest injury news affecting your fantasy picks.',
    content: 'Content here...',
    author: 'Fantasy 11 Editorial Team',
    publishedAt: '4 hours ago',
    readTime: '5 min read',
    category: 'player',
    image: '/api/placeholder/400/250',
    tags: ['Injuries', 'Updates', 'Fitness']
  }
];

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockArticle.title,
          text: mockArticle.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/news"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Article Header */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {mockArticle.featured && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{mockArticle.publishedAt}</span>
                      <span className="mx-2">•</span>
                      <span>{mockArticle.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Share article"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`p-2 transition-colors ${
                        isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title="Bookmark article"
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {mockArticle.title}
                </h1>
              </div>

              {/* Article Image */}
              <div className="relative h-96 bg-gradient-to-br from-green-400 to-green-600">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <div className="text-white text-6xl opacity-20">⚽</div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none text-[#070A11]"
                  dangerouslySetInnerHTML={{ __html: mockArticle.content }}
                />

                {/* Article Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {mockArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedNews articles={relatedArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
