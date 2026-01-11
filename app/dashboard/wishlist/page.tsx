'use client'

import { useState, useEffect } from 'react'

interface WishlistItem {
  id: string
  packageId: string
  packageName: string
  destination: string
  price: number
  addedAt: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleShareWishlist = async () => {
    try {
      const url = `${window.location.origin}/shared-wishlist/${localStorage.getItem('userId')}`
      navigator.clipboard.writeText(url)
      alert('Wishlist link copied to clipboard!')
    } catch (error) {
      console.error('Failed to share wishlist:', error)
    }
  }

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Save and organize your dream travel packages</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading wishlist...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <a
            href="/packages"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Packages
          </a>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">Total Items</p>
              <p className="text-3xl font-bold text-blue-900">{wishlist.length}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">Total Value</p>
              <p className="text-3xl font-bold text-green-900">${totalValue.toLocaleString()}</p>
            </div>
            <div>
              <button
                onClick={handleShareWishlist}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-medium"
              >
                📤 Share Wishlist
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-sm opacity-80">Destination</p>
                    <p className="text-white text-xl font-bold">{item.destination}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.packageName}</h3>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">${item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded font-medium text-sm"
                    >
                      Remove
                    </button>
                    <button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded font-medium text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
