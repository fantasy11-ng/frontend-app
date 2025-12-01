"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, Loader2 } from "lucide-react";
import RelatedNews from "@/components/news/RelatedNews";
import { useBlogPost } from "@/lib/api";
import Image from "next/image";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = use(params);
  const { data, isLoading, error } = useBlogPost(id);

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
        console.log("Error sharing:", error);
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
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#656E81]" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/news"
              className="inline-flex items-center text-[#656E81] hover:text-[#070A11] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="text-[#800000] text-md mb-2">
              {error
                ? "Error loading article. Please try again later."
                : "Article not found."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header Section with Title and Meta */}
      <div className="max-w-[1440px] mx-auto px-4 pt-8">
        <div className="mb-6 flex sm:flex-row flex-col sm:items-center justify-between">
          {/* Title and Featured Badge */}
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#070A11] flex-1 pr-4 max-w-[350px] md:max-w-[514px]">
              {post.title}
            </h1>
          </div>

          {/* Date, Time Info and Actions */}
          <div className="flex flex-col items-left justify-between gap-2">
            <span className="w-fit px-3 py-1 bg-[#F5EBEB] text-[#800000] text-sm font-semibold rounded-full flex-shrink-0">
              Featured
            </span>
            <div className="flex items-center text-sm text-[#656E81]">
              <span>{formatDate(post.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>{formatReadingTime(post.readingTimeMinutes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center text-[#656E81] hover:text-[#070A11] transition-colors"
                title="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleBookmark}
                className={`w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center transition-colors ${
                  isBookmarked
                    ? "text-[#800000]"
                    : "text-[#656E81] hover:text-[#070A11]"
                }`}
                title="Bookmark article"
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button
                className="w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center text-[#656E81] hover:text-[#070A11] transition-colors"
                title="More options"
              >
                <span className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#656E81]"></span>
                  <span className="w-1 h-1 rounded-full bg-[#656E81]"></span>
                  <span className="w-1 h-1 rounded-full bg-[#656E81]"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Cover Image */}
      {post.coverImageUrl && (
        <div className="relative h-[450px] md:h-[558px] rounded-4xl w-full xl:max-w-[1400px] mx-auto mb-8">
          <Image
            fill
            src={post.coverImageUrl}
            alt={post.title}
            className="object-cover rounded-4xl"
            priority
          />
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <div className="flex-1 lg:max-w-[65%]">
            <article className="rounded-xl border border-[#F1F2F4] p-6 md:p-8">
              {/* Repeat Title */}
              <h2 className="text-xl md:text-2xl font-bold text-[#070A11] mb-6">
                {post.title}
              </h2>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none text-[#070A11]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#F1F2F4]">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm font-medium hover:bg-[#800000] hover:text-white transition-colors cursor-pointer"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar - Related News */}
          <div className="lg:w-[35%]">
            {related && related.length > 0 && (
              <RelatedNews articles={related} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
