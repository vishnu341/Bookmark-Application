'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://bookmark-app-coral-six.vercel.app/auth/callback',
      },
    })
    if (error) console.error('OAuth error:', error.message)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Noise */
        .login-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Glow blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: #c8f65d;
          top: -150px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: #7bf5a0;
          bottom: -100px;
          left: -100px;
          animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Grid lines */
        .grid-lines {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(200, 246, 93, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 246, 93, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Left panel */
        .left-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c8f65d;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #c8f65d;
        }

        .headline {
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #e8e8f0;
          margin-bottom: 24px;
        }

        .headline em {
          font-style: normal;
          color: #c8f65d;
          display: block;
        }

        .subline {
          font-size: 16px;
          color: #6b6b7b;
          line-height: 1.6;
          max-width: 380px;
          margin-bottom: 48px;
        }

        /* Feature pills */
        .features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #4a4a5a;
        }

        .feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f65d;
          flex-shrink: 0;
        }

        /* Right panel */
        .right-panel {
          width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          z-index: 1;
        }

        .login-card {
          width: 100%;
          background: #16161f;
          border: 1px solid #2a2a3a;
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          background: rgba(200, 246, 93, 0.1);
          border: 1px solid rgba(200, 246, 93, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 24px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          color: #e8e8f0;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .card-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #4a4a5a;
          margin-bottom: 36px;
        }

        .divider {
          height: 1px;
          background: #2a2a3a;
          margin-bottom: 36px;
        }

        .google-btn {
          width: 100%;
          background: #e8e8f0;
          color: #0a0a0f;
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .google-btn:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(232, 232, 240, 0.15);
        }

        .google-btn:active {
          transform: translateY(0);
        }

        .google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .card-footer {
          margin-top: 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #3a3a4a;
          letter-spacing: 0.05em;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .left-panel { display: none; }
          .right-panel { width: 100%; padding: 24px; }
          .login-card { padding: 36px 28px; }
        }
      `}</style>

      <div className="login-page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-lines" />

        {/* Left */}
        <div className="left-panel">
          <div className="eyebrow">Bookmark Manager</div>
          <h1 className="headline">
            Save what
            <em>matters.</em>
          </h1>
          <p className="subline">
            A minimal, fast place to collect the links you actually want to keep. No noise, just your bookmarks.
          </p>
          <div className="features">
            <div className="feature-item"><div className="feature-dot" /> Save links instantly</div>
            <div className="feature-item"><div className="feature-dot" /> Access from anywhere</div>
            <div className="feature-item"><div className="feature-dot" /> Secure with Google</div>
          </div>
        </div>

        {/* Right */}
        <div className="right-panel">
          <div className="login-card">
            <div className="card-icon">🔖</div>
            <div className="card-title">Welcome back</div>
            <div className="card-sub">// sign in to continue</div>
            <div className="divider" />
            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <div className="card-footer">By signing in you agree to our terms of service</div>
          </div>
        </div>
      </div>
    </>
  )

}

