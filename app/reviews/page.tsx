'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  packageId: string
  packageName: string
  rating: number
  title: string
  content: string
  authorName: string
  authorEmail: string
  verified: boolean
  helpfulCount: number
  createdAt: string
}

interface NewReview {
  packageId: string
  packageName: string
  rating: number
  title: string
  content: string
}

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState<Partial<NewReview>>({
    rating: 5,
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          authorName: session?.user?.name,
          authorEmail: session?.user?.email,
        }),
      })
      if (response.ok) {
        fetchReviews()
        setNewReview({ rating: 5 })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error)
    }
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traveler Reviews</h1>
          <p className="text-gray-600 mt-1">Share your experience and help other travelers</p>
        </div>
        {session && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            {showForm ? 'Cancel' : '+ Write Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && session && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                <input
                  type="text"
                  value={newReview.packageName || ''}
                  onChange={(e) => setNewReview({ ...newReview, packageName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Which package did you book?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={newReview.rating || 5}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Fair</option>
                  <option value={1}>⭐ Poor</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
              <input
                type="text"
                value={newReview.title || ''}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={newReview.content || ''}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share details about your trip..."
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Publish Review
            </button>
          </form>
        </div>
      )}

      {/* Review Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold text-yellow-500">{averageRating}</p>
              <div>
                <p className="text-sm text-gray-600">out of 5</p>
                <p className="text-xs text-gray-500">{reviews.length} reviews</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-8">{stars}⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviews.length > 0 ? (ratingDistribution[stars as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {ratingDistribution[stars as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
            {!session && (
              <a
                href="/auth/signin"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign in to review
              </a>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{review.title}</h3>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{review.authorName}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="text-lg">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-600 mb-3">
                Package: <span className="font-medium">{review.packageName}</span>
              </p>
              <p className="text-gray-700 mb-4">{review.content}</p>
              <button
                onClick={() => handleHelpful(review.id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                👍 Helpful ({review.helpfulCount})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
