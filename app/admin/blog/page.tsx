'use client'

import { useState, useEffect, useCallback } from 'react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  readTime: number
  published: boolean
  featured: boolean
  publishedAt: string | null
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
  title: '',
  excerpt: '',
  content: '',
  author: 'Amanuel Travel',
  category: 'travel',
  tags: '',
  readTime: 5,
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog')
      if (res.ok) {
        const d = await res.json()
        setPosts(d.posts || [])
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          readTime: Number(formData.readTime),
        }),
      })
      if (res.ok) {
        setFormData({ ...EMPTY_FORM })
        setShowForm(false)
        load()
      }
    } catch (err) {
      console.error('Failed to create post:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async (slug: string, current: boolean) => {
    try {
      await fetch(`/api/admin/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current }),
      })
      setPosts(prev => prev.map(p => p.slug === slug ? { ...p, published: !current } : p))
    } catch (err) {
      console.error('Failed to toggle publish:', err)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
      setPosts(prev => prev.filter(p => p.slug !== slug))
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const openEdit = (post: BlogPost) => {
    setEditPost(post)
    setEditForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', '),
      readTime: post.readTime,
    })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPost) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blog/${editPost.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          excerpt: editForm.excerpt,
          content: editForm.content,
          author: editForm.author,
          category: editForm.category,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          readTime: Number(editForm.readTime),
        }),
      })
      if (res.ok) {
        setEditPost(null)
        load()
      }
    } catch (err) {
      console.error('Failed to update post:', err)
    } finally {
      setSaving(false)
    }
  }

  const publishedCount = posts.filter(p => p.published).length
  const draftCount = posts.filter(p => !p.published).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Blog Management</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Create and manage blog posts</p>
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
          {showForm ? '✕ Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Posts', value: posts.length, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Published', value: publishedCount, color: '#10b981', bg: '#d1fae5' },
          { label: 'Drafts', value: draftCount, color: '#f59e0b', bg: '#fef3c7' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${card.bg}`, padding: '18px 20px' }}>
            <p style={{ fontSize: 12, color: card.color, fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: navy, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: navy, margin: '0 0 20px' }}>Create New Post</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Post title" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Author</label>
                <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Excerpt *</label>
              <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Content *</label>
              <textarea required rows={8} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Full article content (markdown supported)" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                  <option value="travel">Travel</option>
                  <option value="culture">Culture</option>
                  <option value="visa">Visa</option>
                  <option value="tips">Tips</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="ethiopia, travel" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Read Time (min)</label>
                <input type="number" min={1} value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '9px 22px', borderRadius: 8, border: 'none', background: navy, color: '#fff', fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Create Post'}
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
      {editPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: navy, margin: '0 0 20px' }}>Edit Post</h2>
            <form onSubmit={handleEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input type="text" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input type="text" value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Excerpt *</label>
                <textarea required rows={2} value={editForm.excerpt} onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Content *</label>
                <textarea required rows={8} value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={inputStyle}>
                    <option value="travel">Travel</option>
                    <option value="culture">Culture</option>
                    <option value="visa">Visa</option>
                    <option value="tips">Tips</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma-separated)</label>
                  <input type="text" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Read Time (min)</label>
                  <input type="number" min={1} value={editForm.readTime} onChange={e => setEditForm({ ...editForm, readTime: parseInt(e.target.value) || 5 })} style={inputStyle} />
                </div>
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
                  onClick={() => setEditPost(null)}
                  style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            No posts yet.{' '}
            <button onClick={() => setShowForm(true)} style={{ color: gold, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              Create the first one.
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                {['Title', 'Author', 'Category', 'Read Time', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.slug} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 600, color: navy, maxWidth: 240 }}>
                    {post.title}
                    {post.excerpt && <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginTop: 2 }}>{post.excerpt.slice(0, 60)}{post.excerpt.length > 60 ? '…' : ''}</div>}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{post.author}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{post.category}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8' }}>{post.readTime} min</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      color: post.published ? '#10b981' : '#64748b',
                      background: post.published ? '#d1fae5' : '#f1f5f9',
                    }}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleTogglePublish(post.slug, post.published)}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          borderRadius: 6,
                          border: `1px solid ${post.published ? '#94a3b8' : '#10b981'}`,
                          background: 'transparent',
                          color: post.published ? '#94a3b8' : '#10b981',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => openEdit(post)}
                        style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: `1px solid ${gold}`, background: 'transparent', color: gold, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
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
