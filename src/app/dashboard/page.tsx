'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function DashboardPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false })
    setBookmarks(data || [])
  }

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      setUserEmail(session.user.email || '')
      await fetchBookmarks(session.user.id)
      setLoading(false)

      // Real-time subscription — syncs other tabs
      const channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchBookmarks(session.user.id)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    init()
  }, [])

  const addBookmark = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')
    if (!title || !url) return setError('Title & URL are required')
    setError(null)
    setAdding(true)

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: session.user.id,
    } as any)

    if (error) {
      setError('Failed to add bookmark: ' + error.message)
      setAdding(false)
      return
    }

    setTitle('')
    setUrl('')
    // Fetch immediately for current tab; real-time handles other tabs
    await fetchBookmarks(session.user.id)
    setAdding(false)
  }

  const deleteBookmark = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')
    setDeletingId(id)

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) {
      setError('Failed to delete: ' + error.message)
      setDeletingId(null)
      return
    }

    // Update current tab instantly; real-time handles other tabs
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    setDeletingId(null)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '32px', height: '32px', border: '2px solid #c8f65d', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b6b7b', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; background: #0a0a0f; font-family: 'Syne', sans-serif; }

        .page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e8f0;
          position: relative;
        }

        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(200, 246, 93, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 246, 93, 0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          max-width: 740px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
        }

        .logo-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c8f65d;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .logo-title {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #e8e8f0;
          line-height: 1;
        }

        .logo-title span { color: #c8f65d; }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #16161f;
          border: 1px solid #2a2a3a;
          border-radius: 100px;
          padding: 6px 14px 6px 8px;
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8f65d, #7bf5a0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #0a0a0f;
          flex-shrink: 0;
        }

        .user-email {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #6b6b7b;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid #2a2a3a;
          color: #6b6b7b;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          border-color: #ff5f57;
          color: #ff5f57;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(200, 246, 93, 0.07);
          border: 1px solid rgba(200, 246, 93, 0.18);
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 32px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f65d;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .live-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #c8f65d;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .add-section {
          background: #16161f;
          border: 1px solid #2a2a3a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .add-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #c8f65d;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .input-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .input-wrap {
          flex: 1;
          min-width: 140px;
        }

        .input-wrap input {
          width: 100%;
          background: #0a0a0f;
          border: 1px solid #2a2a3a;
          border-radius: 10px;
          padding: 12px 16px;
          color: #e8e8f0;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrap input::placeholder { color: #3a3a4a; }
        .input-wrap input:focus { border-color: #c8f65d; }

        .add-btn {
          background: #c8f65d;
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-btn:hover {
          background: #d8ff6d;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(200, 246, 93, 0.25);
        }

        .add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-msg {
          margin-top: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #ff5f57;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .list-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6b6b7b;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .list-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c8f65d;
          background: rgba(200, 246, 93, 0.1);
          padding: 3px 10px;
          border-radius: 100px;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          border: 1px dashed #2a2a3a;
          border-radius: 16px;
        }

        .empty-icon { font-size: 40px; margin-bottom: 16px; }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #4a4a5a;
          margin-bottom: 8px;
        }

        .empty-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #3a3a4a;
        }

        .bookmark-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .bookmark-card {
          background: #16161f;
          border: 1px solid #2a2a3a;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bookmark-card:hover {
          border-color: #3a3a4a;
          background: #1a1a25;
        }

        .bookmark-favicon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #0a0a0f;
          border: 1px solid #2a2a3a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .bookmark-favicon img { width: 20px; height: 20px; }
        .bookmark-favicon-fallback { font-size: 14px; }

        .bookmark-info {
          flex: 1;
          min-width: 0;
        }

        .bookmark-title {
          font-size: 15px;
          font-weight: 600;
          color: #e8e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-decoration: none;
          display: block;
          transition: color 0.2s;
        }

        .bookmark-title:hover { color: #c8f65d; }

        .bookmark-domain {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4a4a5a;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .delete-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #3a3a4a;
          font-size: 14px;
          cursor: pointer;
          padding: 7px 9px;
          border-radius: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .delete-btn:hover {
          color: #ff5f57;
          border-color: rgba(255, 95, 87, 0.3);
          background: rgba(255, 95, 87, 0.1);
        }

        .delete-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 520px) {
          .header { flex-direction: column; gap: 16px; }
          .header-right { align-items: flex-start; }
          .input-row { flex-direction: column; }
          .add-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="page">
        <div className="grid-bg" />
        <div className="content">

          {/* Header */}
          <div className="header">
            <div>
              <div className="logo-tag">// your collection</div>
              <div className="logo-title">Book<span>marks</span></div>
            </div>
            <div className="header-right">
              {userEmail && (
                <div className="user-pill">
                  <div className="user-avatar">{userEmail[0].toUpperCase()}</div>
                  <div className="user-email">{userEmail}</div>
                </div>
              )}
              <button className="logout-btn" onClick={logout}>Sign out</button>
            </div>
          </div>

          {/* Live badge */}
          <div className="live-badge">
            <div className="live-dot" />
            <span className="live-text">Live — updates in real-time</span>
          </div>

          {/* Add Bookmark */}
          <div className="add-section">
            <div className="add-section-label">+ Add new bookmark</div>
            <div className="input-row">
              <div className="input-wrap">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBookmark()}
                />
              </div>
              <div className="input-wrap">
                <input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBookmark()}
                />
              </div>
              <button className="add-btn" onClick={addBookmark} disabled={adding}>
                {adding
                  ? <><span className="spinner" style={{ borderColor: '#0a0a0f', borderTopColor: 'transparent' }} /> Adding</>
                  : <>＋ Add</>
                }
              </button>
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
          </div>

          {/* List */}
          <div className="list-header">
            <div className="list-label">Saved links</div>
            {bookmarks.length > 0 && (
              <div className="list-count">{bookmarks.length}</div>
            )}
          </div>

          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔖</div>
              <div className="empty-title">Nothing saved yet</div>
              <div className="empty-sub">Add your first bookmark above</div>
            </div>
          ) : (
            <ul className="bookmark-list">
              {bookmarks.map((b) => {
                const favicon = getFavicon(b.url)
                const domain = getDomain(b.url)
                return (
                  <li key={b.id} className="bookmark-card">
                    <div className="bookmark-favicon">
                      {favicon
                        ? <img src={favicon} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        : <span className="bookmark-favicon-fallback">🔗</span>
                      }
                    </div>
                    <div className="bookmark-info">
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bookmark-title"
                      >
                        {b.title}
                      </a>
                      <div className="bookmark-domain">{domain}</div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBookmark(b.id)}
                      disabled={deletingId === b.id}
                      title="Delete"
                    >
                      {deletingId === b.id
                        ? <span className="spinner" style={{ color: '#ff5f57' }} />
                        : '✕'
                      }
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

        </div>
      </div>
    </>
  )
}