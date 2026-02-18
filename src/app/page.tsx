import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'Syne', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Noise overlay */
        .home::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Grid lines */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(200, 246, 93, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 246, 93, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Glow blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }

        .blob-1 {
          width: 600px;
          height: 600px;
          background: #c8f65d;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          animation: pulse 8s ease-in-out infinite;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          background: #7bf5a0;
          bottom: 0px;
          left: 10%;
          animation: pulse 10s ease-in-out infinite reverse;
        }

        .blob-3 {
          width: 300px;
          height: 300px;
          background: #c8f65d;
          bottom: 0px;
          right: 10%;
          animation: pulse 12s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.08); }
        }

        /* Content */
        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 680px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(200, 246, 93, 0.08);
          border: 1px solid rgba(200, 246, 93, 0.2);
          border-radius: 100px;
          padding: 8px 18px;
          margin-bottom: 40px;
          animation: fadeDown 0.6s ease both;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f65d;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .badge-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c8f65d;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .headline {
          font-size: clamp(52px, 9vw, 96px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: #e8e8f0;
          margin-bottom: 28px;
          animation: fadeUp 0.7s ease 0.1s both;
        }

        .headline em {
          font-style: normal;
          color: #c8f65d;
        }

        .subline {
          font-size: 17px;
          color: #6b6b7b;
          line-height: 1.65;
          max-width: 440px;
          margin-bottom: 52px;
          animation: fadeUp 0.7s ease 0.2s both;
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeUp 0.7s ease 0.3s both;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-primary {
          background: #c8f65d;
          color: #0a0a0f;
          border: none;
          border-radius: 12px;
          padding: 16px 36px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }

        .cta-primary:hover {
          background: #d8ff6d;
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(200, 246, 93, 0.3);
        }

        .cta-arrow {
          font-size: 18px;
          transition: transform 0.2s;
        }

        .cta-primary:hover .cta-arrow {
          transform: translateX(4px);
        }

        .cta-secondary {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #4a4a5a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .cta-secondary:hover {
          color: #6b6b7b;
        }

        /* Stats row */
        .stats {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-top: 80px;
          animation: fadeUp 0.7s ease 0.45s both;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #e8e8f0;
          letter-spacing: -0.03em;
        }

        .stat-value span {
          color: #c8f65d;
        }

        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #4a4a5a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #2a2a3a;
        }

        /* Bottom nav bar */
        .bottom-bar {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: #16161f;
          border: 1px solid #2a2a3a;
          border-radius: 100px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeUp 0.7s ease 0.5s both;
        }

        .bar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f65d;
        }

        .bar-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #4a4a5a;
          letter-spacing: 0.1em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .stats { gap: 24px; }
          .bottom-bar { bottom: 16px; }
        }
      `}</style>

      <div className="home">
        <div className="grid-bg" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="content">
          <div className="badge">
            <div className="badge-dot" />
            <span className="badge-text">Your personal web collection</span>
          </div>

          <h1 className="headline">
            Save links.<br />
            <em>Stay focused.</em>
          </h1>

          <p className="subline">
            A distraction-free bookmark manager. Collect the corners of the web that matter to you — all in one clean, fast place.
          </p>

          <div className="cta-row">
            <Link href="/login" className="cta-primary">
              Get Started <span className="cta-arrow">→</span>
            </Link>
            <Link href="/login" className="cta-secondary">
              // sign in
            </Link>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-value">∞<span>+</span></div>
              <div className="stat-label">Bookmarks</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-value">1<span>-click</span></div>
              <div className="stat-label">Save</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-value">100<span>%</span></div>
              <div className="stat-label">Yours</div>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <div className="bar-dot" />
          <span className="bar-text">Powered by Supabase + Next.js</span>
        </div>
      </div>
    </>
  )
}