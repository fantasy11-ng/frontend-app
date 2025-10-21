"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import FeaturedArticle from "@/components/news/FeaturedArticle";
import { NewsCard, NewsSection } from "@/components/news";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: "general" | "team" | "player";
  image: string;
  featured?: boolean;
  tags: string[];
}

const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "AFCON 2025 Fantasy: Complete Guide to Winning Your League",
    excerpt:
      "Everything you need to know about dominating your fantasy league this season. From budget management to captain selection, our comprehensive guide covers all the strategies used by top managers.",
    content:
      "The AFCON 2025 Fantasy League is set to be an exciting event for football fans around the globe. With the tournament taking place in Morocco, this guide will help you navigate the ins and outs of creating a winning fantasy team. First, understanding the tournament format is crucial. Next, consider the players. In addition to star players, another important aspect is budget management. Finally, stay updated on injuries and team news.",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "1 hour ago",
    readTime: "12 min read",
    category: "general",
    image: "/api/placeholder/800/400",
    featured: true,
    tags: ["Mohammed Salah", "Liverpool", "Morocco", "Quarter Finals"],
  },
  {
    id: "2",
    title: "Top 10 Players to Watch in AFCON 2025",
    excerpt:
      "Discover the star players who could make or break your fantasy team this tournament.",
    content: "Content here...",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "2 hours ago",
    readTime: "8 min read",
    category: "player",
    image: "/api/placeholder/400/250",
    tags: ["Mohammed Salah", "Sadio Mané", "Victor Osimhen"],
  },
  {
    id: "3",
    title: "Team Analysis: Nigeria vs Egypt Preview",
    excerpt:
      "A deep dive into the tactical battle between two AFCON powerhouses.",
    content: "Content here...",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "3 hours ago",
    readTime: "6 min read",
    category: "team",
    image: "/api/placeholder/400/250",
    tags: ["Nigeria", "Egypt", "Group Stage"],
  },
  {
    id: "4",
    title: "Injury Updates: Latest from AFCON 2025",
    excerpt:
      "Stay updated with the latest injury news affecting your fantasy picks.",
    content: "Content here...",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "4 hours ago",
    readTime: "5 min read",
    category: "player",
    image: "/api/placeholder/400/250",
    tags: ["Injuries", "Updates", "Fitness"],
  },
  {
    id: "5",
    title: "Morocco Hosts AFCON 2025: Venue Guide",
    excerpt: "Everything you need to know about the host cities and stadiums.",
    content: "Content here...",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "5 hours ago",
    readTime: "10 min read",
    category: "general",
    image: "/api/placeholder/400/250",
    tags: ["Morocco", "Venues", "Stadiums"],
  },
  {
    id: "6",
    title: "Fantasy Tips: Budget Management Strategies",
    excerpt:
      "Learn how to maximize your fantasy budget for optimal team performance.",
    content: "Content here...",
    author: "Fantasy 11 Editorial Team",
    publishedAt: "6 hours ago",
    readTime: "7 min read",
    category: "general",
    image: "/api/placeholder/400/250",
    tags: ["Budget", "Strategy", "Tips"],
  },
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "team", label: "Team News" },
    { value: "player", label: "Player News" },
  ];

  const featuredArticle = mockArticles.find((article) => article.featured);
  const otherArticles = mockArticles.filter((article) => !article.featured);

  const filteredArticles = otherArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generalNews = filteredArticles.filter(
    (article) => article.category === "general"
  );
  const teamNews = filteredArticles.filter(
    (article) => article.category === "team"
  );
  const playerNews = filteredArticles.filter(
    (article) => article.category === "player"
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const selectedCategoryLabel =
    categories.find((cat) => cat.value === selectedCategory)?.label ||
    "All Categories";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Latest News
            </h1>
            <p className="text-gray-600 mb-6">
              Stay updated with AFCON 2025 developments
            </p>
          </div>
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="max-w-[268px] h-9 text-sm text-gray-900 block w-full pl-10 pr-14 border border-gray-300 rounded-lg focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">×</span>
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className="flex items-center px-4 py-3 h-9 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:border-transparent min-w-[200px]"
                >
                  <span className="flex-1 text-left text-sm text-[#656E81]">
                    {selectedCategoryLabel}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedCategory === category.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-[#656E81]"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* No Search Results */}
        {searchQuery && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-md mb-2">
              Oops! It looks like we couldn&apos;t find any results for &quot;
              {searchQuery}&quot;.
            </div>
            <p className="text-gray-400">Try searching for something else.</p>
          </div>
        )}

        {/* Featured Article */}
        {!searchQuery && featuredArticle && (
          <FeaturedArticle article={featuredArticle} />
        )}

        {/* News Sections */}
        {!searchQuery && (
          <div className="space-y-12">
            {generalNews.length > 0 && (
              <NewsSection
                title="News"
                articles={generalNews.slice(0, 4)}
                seeAllLink="/news?category=general"
              />
            )}

            {teamNews.length > 0 && (
              <NewsSection
                title="Team News"
                articles={teamNews.slice(0, 4)}
                seeAllLink="/news?category=team"
              />
            )}

            {playerNews.length > 0 && (
              <NewsSection
                title="Player News"
                articles={playerNews.slice(0, 4)}
                seeAllLink="/news?category=player"
              />
            )}
          </div>
        )}

        {/* Search Results */}
        {searchQuery && filteredArticles.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results ({filteredArticles.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
