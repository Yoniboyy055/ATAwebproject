'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    country: '',
    preferences: {
      newsletter: true,
      whatsappUpdates: true,
      dealsAlerts: true,
    },
  })

  const handleSave = () => {
    // Save profile data
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
        <p className="text-slate-600">Manage your account information and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
          >
            {isEditing ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="ER">Eritrea</option>
                  <option value="ET">Ethiopia</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Full Name</span>
              <span className="font-medium text-slate-900">{formData.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Email</span>
              <span className="font-medium text-slate-900">{formData.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-600">Member Since</span>
              <span className="font-medium text-slate-900">January 2024</span>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.newsletter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, newsletter: e.target.checked },
                })
              }
              className="w-4 h-4 accent-emerald-600"
            />
            <div>
              <p className="font-medium text-slate-900">Newsletter</p>
              <p className="text-sm text-slate-600">Receive travel tips and destination guides</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.dealsAlerts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, dealsAlerts: e.target.checked },
                })
              }
              className="w-4 h-4 accent-emerald-600"
            />
            <div>
              <p className="font-medium text-slate-900">Deal Alerts</p>
              <p className="text-sm text-slate-600">Get notified about special offers and discounts</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preferences.whatsappUpdates}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, whatsappUpdates: e.target.checked },
                })
              }
              className="w-4 h-4 accent-emerald-600"
            />
            <div>
              <p className="font-medium text-slate-900">WhatsApp Updates</p>
              <p className="text-sm text-slate-600">Receive booking updates via WhatsApp</p>
            </div>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Account Actions</h2>

        <div className="space-y-4">
          <button className="w-full px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            Change Password
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
