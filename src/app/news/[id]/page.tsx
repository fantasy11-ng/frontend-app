'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, Loader2 } from 'lucide-react';
import RelatedNews from '@/components/news/RelatedNews';
import { useBlogPost } from '@/lib/api';
import Image from 'next/image';

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

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, isLoading, error } = useBlogPost(params.id);

  const handleShare = async () => {
    if (!data?.post) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.post.title,
          text: data.post.excerpt,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              href="/news"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="text-red-600 text-md mb-2">
              {error ? 'Error loading article. Please try again later.' : 'Article not found.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
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
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatReadingTime(post.readingTimeMinutes)}</span>
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
                  {post.title}
                </h1>
              </div>

              {/* Article Image */}
              <div className="relative h-96 bg-gradient-to-br from-green-400 to-green-600">
                {post.coverImageUrl ? (
                  <Image
                    fill
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <div className="text-white text-6xl opacity-20">⚽</div>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none text-[#070A11]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Article Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {related && related.length > 0 && <RelatedNews articles={related} />}
          </div>
        </div>
      </div>
    </div>
  );
}
