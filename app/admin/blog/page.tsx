'use client'

import { useState, useEffect } from 'react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  readTime: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: 'Amanuel Travel',
    readTime: 5,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchPosts()
        setFormData({
          title: '',
          excerpt: '',
          author: 'Amanuel Travel',
          readTime: 5,
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleTogglePublish = async (slug: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentState }),
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const handleDeletePost = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const publishedCount = posts.filter((p) => p.published).length
  const draftCount = posts.filter((p) => !p.published).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Total Posts</p>
          <p className="text-3xl font-bold text-blue-900">{posts.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Published</p>
          <p className="text-3xl font-bold text-green-900">{publishedCount}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">Drafts</p>
          <p className="text-3xl font-bold text-yellow-900">{draftCount}</p>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Post title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief summary of the post"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (min)</label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Post
            </button>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">No posts found</div>
        ) : (
          posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{post.author}</span>
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    post.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="border-t pt-3 flex gap-2">
                <button
                  onClick={() => handleTogglePublish(post.slug, post.published)}
                  className="flex-1 text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDeletePost(post.slug)}
                  className="flex-1 text-sm px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
