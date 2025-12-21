"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import FeaturedArticle from "@/components/news/FeaturedArticle";
import { NewsCard, NewsSection } from "@/components/news";
import { useBlogPosts, useBlogCategories } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import { BLOG_CATEGORY_SLUGS, BLOG_CATEGORIES } from "@/lib/constants";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromUrl || "all"
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Debounce search query with 700ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Get categories to map slugs to UUIDs for API calls
  const { data: categoriesData } = useBlogCategories();
  const categories = useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : [];
  }, [categoriesData]);

  // Build API params using debounced search query
  const apiParams = useMemo(() => {
    const params: {
      q?: string;
      status?: "draft" | "published";
      category?: string;
    } = {
      status: "published",
    };

    if (debouncedSearchQuery) {
      params.q = debouncedSearchQuery;
    }

    if (selectedCategory !== "all") {
      // Convert slug to UUID if needed (API expects UUID)
      const category = categories.find((cat) => cat.slug === selectedCategory);
      if (category) {
        params.category = category.id;
      } else {
        // Fallback: if it's already a UUID, use it directly
        params.category = selectedCategory;
      }
    }

    return params;
  }, [debouncedSearchQuery, selectedCategory, categories]);

  const { data, isLoading, error } = useBlogPosts(apiParams);

  // Extract articles from response - API returns { items, total, page, limit }
  const articles = useMemo(() => {
    if (!data) {
      return [];
    }
    // Handle both direct { items } structure and any wrapped structures
    if ("items" in data && Array.isArray(data.items)) {
      return data.items;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }, [data]);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.slice(1);

  // Debug: Log all articles and their categories
  console.log(
    "[NewsPage] All articles:",
    articles.map((a) => ({
      id: a.id,
      title: a.title,
      categoryId: a.category?.id,
      categoryName: a.category?.name,
      categorySlug: a.category?.slug,
    }))
  );
  console.log(
    "[NewsPage] Category slugs we're looking for:",
    BLOG_CATEGORY_SLUGS
  );
  console.log("[NewsPage] otherArticles count:", otherArticles.length);

  // Group articles by category for display using category slugs (more stable across environments)
  const generalNews = otherArticles.filter((article) => {
    const matches =
      article.category && article.category.slug === BLOG_CATEGORY_SLUGS.general;
    if (article.category) {
      console.log(
        `[NewsPage] Article "${article.title}" - category.slug: ${article.category.slug}, matches General: ${matches}`
      );
    }
    return matches;
  });
  const teamNews = otherArticles.filter((article) => {
    const matches =
      article.category && article.category.slug === BLOG_CATEGORY_SLUGS.team;
    if (article.category) {
      console.log(
        `[NewsPage] Article "${article.title}" - category.slug: ${article.category.slug}, matches Team: ${matches}`
      );
    }
    return matches;
  });
  const playerNews = otherArticles.filter((article) => {
    const matches =
      article.category && article.category.slug === BLOG_CATEGORY_SLUGS.player;
    if (article.category) {
      console.log(
        `[NewsPage] Article "${article.title}" - category.slug: ${article.category.slug}, matches Player: ${matches}`
      );
    }
    return matches;
  });

  console.log("[NewsPage] Filtered results:", {
    generalNews: generalNews.length,
    teamNews: teamNews.length,
    playerNews: playerNews.length,
    totalOtherArticles: otherArticles.length,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const selectedCategoryLabel =
    BLOG_CATEGORIES.find((cat) => cat.value === selectedCategory)?.label ||
    "All Categories";

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#070A11] mb-2">
              Latest News
            </h1>
            <p className="text-[#656E81] mb-6">
              Stay updated with AFCON 2025 developments
            </p>
          </div>
          <div className="w-full md:w-auto">
            {/* Search and Filter */}
            <div className="flex w-full md:w-auto flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#070A11]" />
                </div>
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="md:max-w-[268px] h-9 text-sm text-[#070A11] block w-full pl-10 pr-14 border border-gray-300 rounded-lg focus:border-transparent"
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
                  className="flex items-center px-4 py-3 h-9 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:border-transparent w-full min-w-[200px]"
                >
                  <span className="flex-1 text-left text-sm text-[#656E81]">
                    {selectedCategoryLabel}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {BLOG_CATEGORIES.map((category) => (
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Spinner size={32} className="text-gray-500 mx-auto" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-600">
              Error loading news. Please try again later.
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading &&
          !error &&
          debouncedSearchQuery &&
          articles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-md mb-2">
                Oops! It looks like we couldn&apos;t find any results for &quot;
                {debouncedSearchQuery}&quot;.
              </div>
              <p className="text-gray-400">Try searching for something else.</p>
            </div>
          )}

        {/* Featured Article */}
        {!isLoading && !error && !debouncedSearchQuery && featuredArticle && (
          <FeaturedArticle article={featuredArticle} />
        )}

        {/* News Sections */}
        {!isLoading &&
          !error &&
          !debouncedSearchQuery &&
          articles.length > 0 && (
            <div className="space-y-12">
              {generalNews.length > 0 && (
                <NewsSection
                  title="General News"
                  articles={generalNews.slice(0, 4)}
                  seeAllLink={`/news?category=${BLOG_CATEGORY_SLUGS.general}`}
                />
              )}

              {teamNews.length > 0 && (
                <NewsSection
                  title="Team News"
                  articles={teamNews.slice(0, 4)}
                  seeAllLink={`/news?category=${BLOG_CATEGORY_SLUGS.team}`}
                />
              )}

              {playerNews.length > 0 && (
                <NewsSection
                  title="Player News"
                  articles={playerNews.slice(0, 4)}
                  seeAllLink={`/news?category=${BLOG_CATEGORY_SLUGS.player}`}
                />
              )}

              {/* Show remaining articles if no specific category sections match */}
              {generalNews.length === 0 &&
                teamNews.length === 0 &&
                playerNews.length === 0 &&
                otherArticles.length > 0 && (
                  <NewsSection
                    title="All News"
                    articles={otherArticles.slice(0, 8)}
                    seeAllLink="/news"
                  />
                )}
            </div>
          )}

        {/* Search Results */}
        {!isLoading &&
          !error &&
          debouncedSearchQuery &&
          articles.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-[#070A11]">
                Search Results ({articles.length})
              </h2>
              <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex-shrink-0 w-full min-w-[280px] max-w-[300px]"
                  >
                    <NewsCard article={article} />
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* No articles at all */}
        {!isLoading &&
          !error &&
          articles.length === 0 &&
          !debouncedSearchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-md mb-2">
                No news articles available at the moment.
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
