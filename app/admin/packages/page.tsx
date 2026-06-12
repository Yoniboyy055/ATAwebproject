'use client'

import { useState, useEffect, useCallback } from 'react'

interface Package {
  id: string
  type: 'Local' | 'Diaspora'
  title: string
  description: string
  price: number | null
  recommended: boolean
  includes: string[]
  note: string | null
  createdAt: string
}

const navy = '#0A1628'
const gold = '#C9A84C'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  color: navy,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#64748b',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const EMPTY_FORM = {
  type: 'Local' as 'Local' | 'Diaspora',
  title: '',
  description: '',
  price: '',
  includes: '',
  note: '',
  recommended: false,
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [editPkg, setEditPkg] = useState<Package | null>(null)
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/packages')
      if (res.ok) {
        const d = await res.json()
        setPackages(d.packages || [])
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          includes: formData.includes.split(',').map(s => s.trim()).filter(Boolean),
          note: formData.note || null,
          recommended: formData.recommended,
        }),
      })
      if (res.ok) {
        setFormData({ ...EMPTY_FORM })
        setShowForm(false)
        load()
      }
    } catch (err) {
      console.error('Failed to create package:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this package?')) return
    try {
      await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
      setPackages(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete package:', err)
    }
  }

  const openEdit = (pkg: Package) => {
    setEditPkg(pkg)
    setEditForm({
      type: pkg.type,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price != null ? String(pkg.price) : '',
      includes: pkg.includes.join(', '),
      note: pkg.note || '',
      recommended: pkg.recommended,
    })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPkg) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/packages/${editPkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editForm.type,
          title: editForm.title,
          description: editForm.description,
          price: editForm.price ? parseFloat(editForm.price) : null,
          includes: editForm.includes.split(',').map(s => s.trim()).filter(Boolean),
          note: editForm.note || null,
          recommended: editForm.recommended,
        }),
      })
      if (res.ok) {
        setEditPkg(null)
        load()
      }
    } catch (err) {
      console.error('Failed to update package:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Packages</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Manage travel packages shown on your website</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: `2px solid ${gold}`,
            background: showForm ? gold : 'transparent',
            color: showForm ? '#fff' : gold,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Package'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 20px' }}>Create New Package</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as 'Local' | 'Diaspora' })}
                  style={inputStyle}
                >
                  <option value="Local">Local</option>
                  <option value="Diaspora">Diaspora</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Package title"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Package description"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Price (USD, optional)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 1500"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Includes (comma-separated)</label>
                <input
                  type="text"
                  value={formData.includes}
                  onChange={e => setFormData({ ...formData, includes: e.target.value })}
                  placeholder="Flight, Hotel, Visa support"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Note (optional)</label>
              <textarea
                rows={2}
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                placeholder="Additional note"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="recommended"
                checked={formData.recommended}
                onChange={e => setFormData({ ...formData, recommended: e.target.checked })}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="recommended" style={{ fontSize: 14, color: '#475569', cursor: 'pointer' }}>
                Mark as Recommended
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  border: 'none',
                  background: navy,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Create Package'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editPkg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: navy, margin: '0 0 20px' }}>Edit Package</h2>
            <form onSubmit={handleEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select
                    value={editForm.type}
                    onChange={e => setEditForm({ ...editForm, type: e.target.value as 'Local' | 'Diaspora' })}
                    style={inputStyle}
                  >
                    <option value="Local">Local</option>
                    <option value="Diaspora">Diaspora</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Price (USD, optional)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Includes (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.includes}
                    onChange={e => setEditForm({ ...editForm, includes: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Note (optional)</label>
                <textarea
                  rows={2}
                  value={editForm.note}
                  onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="edit-recommended"
                  checked={editForm.recommended}
                  onChange={e => setEditForm({ ...editForm, recommended: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="edit-recommended" style={{ fontSize: 14, color: '#475569', cursor: 'pointer' }}>
                  Mark as Recommended
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '9px 22px', borderRadius: 8, border: 'none', background: navy, color: '#fff', fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditPkg(null)}
                  style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : packages.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            No packages yet.{' '}
            <button onClick={() => setShowForm(true)} style={{ color: gold, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              Create the first one.
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Type', 'Title', 'Price', 'Includes', 'Recommended', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      color: pkg.type === 'Local' ? '#3b82f6' : '#7c3aed',
                      background: pkg.type === 'Local' ? '#eff6ff' : '#f5f3ff',
                    }}>
                      {pkg.type}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 600, color: navy }}>
                    {pkg.title}
                    {pkg.description && <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginTop: 2 }}>{pkg.description.slice(0, 60)}{pkg.description.length > 60 ? '…' : ''}</div>}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                    {pkg.price != null ? `$${pkg.price.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                    {pkg.includes.length} item{pkg.includes.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {pkg.recommended ? (
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: gold, background: `${gold}1a` }}>
                        Yes
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => openEdit(pkg)}
                        style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: `1px solid ${gold}`, background: 'transparent', color: gold, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #fca5a5', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
