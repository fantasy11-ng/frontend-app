"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import RelatedNews from "@/components/news/RelatedNews";
import { useBlogPost } from "@/lib/api";
import Image from "next/image";
import { Spinner } from "@/components/common/Spinner";

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
        <Spinner size={24} className="text-[#4AA96C]" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
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
    <div className="min-h-screen max-w-[1440px] mx-auto bg-[#FFFFFF]">
      {/* Header Section with Title and Meta */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-8">
        <div className="mb-6 flex sm:flex-row flex-col justify-between">
          {/* Title and Featured Badge */}
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#070A11] flex-1 pr-4 md:max-w-[514px]">
              {post.title}
            </h1>
          </div>

          {/* Date, Time Info and Actions */}
          <div className="flex flex-row md:flex-col items-center justify-between md:items-left gap-4">
            <div className="flex md:items-center text-sm text-[#656E81]">
              <span>{formatDate(post.createdAt)}</span>
              <span className="border-l border-[#D4D7DD] h-4 mx-3 md:mx-4" />
              <span>{formatReadingTime(post.readingTimeMinutes)}</span>
            </div>
            <div className="flex md:items-center justify-end space-x-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center text-[#656E81] hover:text-[#1877F2] transition-colors"
                title="Share on Facebook"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center text-[#656E81] hover:text-[#000000] transition-colors"
                title="Share on Twitter"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  post.title +
                    " " +
                    (typeof window !== "undefined" ? window.location.href : "")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#D4D7DD] flex items-center justify-center text-[#656E81] hover:text-[#25D366] transition-colors"
                title="Share on WhatsApp"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Cover Image */}
      {post.coverImageUrl && (
        <div className="relative h-[450px] md:h-[558px] rounded-4xl w-full mx-auto mb-8 px-4 md:px-12 overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              fill
              src={post.coverImageUrl}
              alt={post.title}
              className="object-cover rounded-4xl"
              priority
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <div className="flex-1 lg:max-w-[65%]">
            <article className="rounded-xl p-6 md:p-8">
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
                        className="px-3 py-1 bg-[#F5EBEB] text-[#800000] rounded-full text-sm font-medium transition-colors"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar - Recent News */}
          <div className="lg:w-[35%]">
            {related && related.length > 0 && (
              <RelatedNews articles={related.slice(0, 4)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
