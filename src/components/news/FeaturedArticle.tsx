"use client";

import Link from "next/link";
import { BlogPostListItem } from "@/types/news";
import Image from "next/image";
import { Calendar } from "lucide-react";

interface FeaturedArticleProps {
  article: BlogPostListItem;
}

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

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="mb-12">
      <Link href={`/news/${article.slug}`} className="block group">
        <div className="relative bg-white rounded-xl md:rounded-4xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-5">
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7, 10, 17, 0) 50.11%, rgba(7, 10, 17, 0.88) 76.25%)",
              }}
            ></div>

            {/* Article Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
              <div className="flex flex-col sm:flex-row justify-between ">
                <h2 className="max-w-[400px] lg:max-w-[514px] text-xl md:text-4xl font-medium mb-4 group-hover:text-green-300 transition-colors">
                  {article.title}
                </h2>

                <div className="text-sm text-white">
                  <div className="flex items-center flex-wrap">
                    <span className="flex items-center gap-2">
                      <Calendar color="#fff" size={16} />
                      Fantasy11 Team
                    </span>
                    <span className="w-full md:w-auto border-l border-transparent md:border-gray-200 h-3 md:h-4 mx-3 md:mx-4" />
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="border-l border-gray-200 h-4 mx-3 md:mx-4" />
                    <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                  </div>
                  <p className="text-xs sm:text-base leading-relaxed max-w-[400px] mt-3">
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
