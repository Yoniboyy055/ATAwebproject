'use client'

import Link from 'next/link'
import { useState } from 'react'
import { blogPosts, BlogPost } from '@/lib/blog'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'destination', label: 'Destinations' },
    { id: 'travel-tips', label: 'Travel Tips' },
    { id: 'visa', label: 'Visa & Documents' },
    { id: 'cultural', label: 'Culture' },
  ]

  let filteredPosts = blogPosts

  if (searchQuery) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (selectedCategory) {
    filteredPosts = filteredPosts.filter((post) => post.category === selectedCategory)
  }

  filteredPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Blog</h1>
          <p className="text-xl text-emerald-100">
            Expert travel guides, tips, and stories from the Amanuel Travel team
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <p className="text-slate-600 mb-6">
          Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
        </p>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600 mb-4">No articles found</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="text-emerald-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-shadow cursor-pointer h-full">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
            <div className="text-6xl">📖</div>
          </div>

          {/* Content */}
          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {post.category.replace('-', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {post.publishedAt.toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">{post.title}</h2>
              <p className="text-slate-600 mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>By {post.author}</span>
              <span>{post.readingTime} min read</span>
            </div>

            <div className="mt-4">
              <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
