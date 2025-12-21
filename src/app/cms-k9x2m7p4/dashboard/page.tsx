'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Search, Calendar, ChevronLeft, ChevronRight, ChevronDown, FileText, Tag, Folder, X } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { useBlogPosts, useCreateTag, useCreateCategory, useBlogCategories } from '@/lib/api/hooks/useBlog';
import { Spinner } from '@/components/common/Spinner';

const ITEMS_PER_PAGE = 20; // 4 per row × 5 rows

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function DashboardContent() {
  const router = useRouter();
  const { adminLogout } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagSlug, setTagSlug] = useState('');
  const [autoTagSlug, setAutoTagSlug] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [autoCategorySlug, setAutoCategorySlug] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const createTag = useCreateTag();
  const createCategory = useCreateCategory();
  const { data: categoriesData, isLoading: categoriesLoading } = useBlogCategories();
  
  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data, isLoading } = useBlogPosts({
    q: searchQuery || undefined,
    category: activeCategory || undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const articles = data?.items || [];
  const totalArticles = data?.total || 0;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleTagNameChange = (value: string) => {
    setTagName(value);
    if (autoTagSlug) {
      setTagSlug(generateSlug(value));
    }
  };

  const handleTagSlugChange = (value: string) => {
    setAutoTagSlug(false);
    setTagSlug(generateSlug(value));
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) return;
    
    await createTag.mutateAsync({
      name: tagName.trim(),
      slug: tagSlug || generateSlug(tagName),
    });
    
    setShowTagModal(false);
    setTagName('');
    setTagSlug('');
    setAutoTagSlug(true);
  };

  const handleCategoryNameChange = (value: string) => {
    setCategoryName(value);
    if (autoCategorySlug) {
      setCategorySlug(generateSlug(value));
    }
  };

  const handleCategorySlugChange = (value: string) => {
    setAutoCategorySlug(false);
    setCategorySlug(generateSlug(value));
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;
    
    await createCategory.mutateAsync({
      name: categoryName.trim(),
      slug: categorySlug || generateSlug(categoryName),
    });
    
    setShowCategoryModal(false);
    setCategoryName('');
    setCategorySlug('');
    setAutoCategorySlug(true);
  };

  const handleAddNewClick = (type: 'article' | 'tag' | 'category') => {
    setShowAddDropdown(false);
    if (type === 'article') {
      router.push('/cms-k9x2m7p4/articles/new');
    } else if (type === 'tag') {
      setShowTagModal(true);
    } else if (type === 'category') {
      setShowCategoryModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tag Creation Modal */}
      {showTagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Tag</h3>
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setTagName('');
                  setTagSlug('');
                  setAutoTagSlug(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tag Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => handleTagNameChange(e.target.value)}
                  placeholder="e.g., AFCON 2025"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={tagSlug}
                  onChange={(e) => handleTagSlugChange(e.target.value)}
                  placeholder="afcon-2025"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setTagName('');
                  setTagSlug('');
                  setAutoTagSlug(true);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTag}
                disabled={!tagName.trim() || createTag.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createTag.isPending ? (
                  <Spinner size={16} className="text-white" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Create Tag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Category</h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryName('');
                  setCategorySlug('');
                  setAutoCategorySlug(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  placeholder="e.g., Fantasy Football Tips"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={categorySlug}
                  onChange={(e) => handleCategorySlugChange(e.target.value)}
                  placeholder="fantasy-football-tips"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryName('');
                  setCategorySlug('');
                  setAutoCategorySlug(true);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!categoryName.trim() || createCategory.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCategory.isPending ? (
                  <Spinner size={16} className="text-white" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Create Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Text */}
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764267172/Logo_x03fz0.png"
                alt="Fantasy Logo"
                width={100}
                height={40}
                className="object-contain h-8 w-auto brightness-0"
                priority
              />
              <span className="text-gray-300 text-xl font-light">|</span>
              <span className="text-gray-700 font-semibold text-lg">Content Editor</span>
            </div>

            {/* Right: Add New Dropdown + Logout */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAddDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showAddDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => handleAddNewClick('article')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">New Article</span>
                    </button>
                    <button
                      onClick={() => handleAddNewClick('tag')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">New Tag</span>
                    </button>
                    <button
                      onClick={() => handleAddNewClick('category')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      <Folder className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">New Category</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={adminLogout}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {/* Search + Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeCategory === ''
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-emerald-600" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || activeCategory
                ? 'Try adjusting your search or filter'
                : 'Get started by creating your first article'}
            </p>
            <button
              onClick={() => router.push('/cms-k9x2m7p4/articles/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => router.push(`/cms-k9x2m7p4/articles/${article.slug}/edit`)}
                  className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  {/* Article Image */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {article.coverImageUrl ? (
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          article.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Article Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(article.createdAt)}</span>
                      {article.category && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-emerald-600">{article.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminProtectedRoute>
      <DashboardContent />
    </AdminProtectedRoute>
  );
}
