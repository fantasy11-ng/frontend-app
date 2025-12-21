'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { useCreatePost, useBlogCategories, useBlogTags } from '@/lib/api/hooks/useBlog';
import { Spinner } from '@/components/common/Spinner';
import { TipTapEditor } from '@/components/editor';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function NewArticleContent() {
  const router = useRouter();
  const { adminLogout } = useAdminAuth();
  const createPost = useCreatePost();
  const { data: categories = [], isLoading: categoriesLoading } = useBlogCategories();
  const { data: tags = [], isLoading: tagsLoading } = useBlogTags();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [autoSlug, setAutoSlug] = useState(true);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSlug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setSlug(generateSlug(value));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      return;
    }

    await createPost.mutateAsync({
      title: title.trim(),
      slug: slug || generateSlug(title),
      content: content,
      excerpt: excerpt.trim(),
      ...(coverImageUrl.trim() && { coverImageUrl: coverImageUrl.trim() }),
      ...(categoryId && { categoryId }),
      ...(selectedTagIds.length > 0 && { tagIds: selectedTagIds }),
      status,
    });

    router.push('/cms-k9x2m7p4/dashboard');
  };

  const isLoading = categoriesLoading || tagsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/cms-k9x2m7p4/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
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
                <span className="text-gray-700 font-semibold">New Article</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={!title.trim() || createPost.isPending}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={!title.trim() || createPost.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPost.isPending ? (
                  <Spinner size={16} className="text-white" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>Publish</span>
              </button>
              <button
                onClick={adminLogout}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="text-emerald-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Slug */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/news/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="article-url-slug"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Auto-generated from title. Edit to customize.
              </p>
            </div>

            {/* Cover Image */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {coverImageUrl && (
                <div className="mt-4 relative aspect-video max-w-md rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the article (shown in previews)..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            {/* Content - TipTap Editor */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Write your article content here..."
              />
            </div>

            {/* Category */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {tag.name}
                      {isSelected && <X className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
              {tags.length === 0 && (
                <p className="text-gray-500 text-sm">No tags available</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <AdminProtectedRoute>
      <NewArticleContent />
    </AdminProtectedRoute>
  );
}
