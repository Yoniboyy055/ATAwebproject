'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, blogPosts } from '@/lib/blog'
import StructuredData from '@/components/StructuredData'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Related posts
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  // Schema markup for blog post
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Amanuel Travel Agency',
    },
  }

  return (
    <>
      <StructuredData data={articleSchema} />

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
              <span>•</span>
              <span>{post.publishedAt.toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Article Image */}
          <div className="mb-8 h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-2">📸</div>
              <p className="text-slate-600">{post.imageAlt}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="text-sm font-semibold uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {post.category.replace('-', ' ')}
            </span>
            {post.tags.map((tag) => (
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
    </>
  )
}

// Generate static params for blog posts (SEO friendly)
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}
