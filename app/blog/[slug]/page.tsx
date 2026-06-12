'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image?: string
  imageAlt?: string
  readTime: number
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch the specific post
        const res = await fetch(`/api/blog/${slug}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (res.ok) {
          const d = await res.json()
          const fetchedPost: BlogPost = d.post || d
          setPost(fetchedPost)

          // Fetch related posts (same category)
          try {
            const allRes = await fetch('/api/blog')
            if (allRes.ok) {
              const allData = await allRes.json()
              const all: BlogPost[] = allData.posts || []
              setRelatedPosts(
                all
                  .filter(p => p.category === fetchedPost.category && p.id !== fetchedPost.id && p.published)
                  .slice(0, 3)
              )
            }
          } catch {
            // related posts are optional
          }
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (slug) load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
        <Link href="/blog" className="text-emerald-600 hover:underline font-medium">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="text-emerald-100 hover:text-white mb-4 inline-flex items-center">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-emerald-100">
            <span>By {post.author}</span>
            {publishedDate && (
              <>
                <span>•</span>
                <span>{publishedDate}</span>
              </>
            )}
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Article Image */}
        <div className="mb-8 h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-2">📸</div>
            {post.imageAlt && <p className="text-slate-600">{post.imageAlt}</p>}
          </div>
        </div>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="text-sm font-semibold uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {post.category.replace('-', ' ')}
          </span>
          {(post.tags || []).map((tag) => (
            <Link
              key={tag}
              href={`/blog?search=${tag}`}
              className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-12 prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{post.content}</div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Plan Your Trip?</h3>
          <p className="text-slate-600 mb-6">
            Let our travel experts help you create the perfect itinerary based on this guide.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/dashboard/quotes"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Get a Quote
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <div className="text-4xl">📄</div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">
                      {relatedPost.category.replace('-', ' ')}
                    </p>
                    <h4 className="font-bold text-slate-900 mb-2 line-clamp-2">{relatedPost.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
