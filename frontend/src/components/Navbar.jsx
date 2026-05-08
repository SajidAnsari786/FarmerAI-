import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'home',    label: 'Predict' },
  { id: 'advisor', label: 'AI Advisor' },
  { id: 'weather', label: 'Weather' },
  { id: 'market',  label: 'Market' },
  { id: 'crops',   label: 'Crop Guide' },
  { id: 'history', label: 'History' },
];

const STATUS_CONFIG = {
  ready:     { color: '#10b981', text: 'Online', pulse: true },
  checking:  { color: '#f59e0b', text: 'Connecting...', pulse: false },
  'no-models': { color: '#f59e0b', text: 'No Models', pulse: false },
  offline:   { color: '#ef4444', text: 'Offline', pulse: false },
  error:     { color: '#ef4444', text: 'Error', pulse: false },
};

export default function Navbar({ currentPage, onNavigate, backendStatus, historyCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [copied, setCopied] = useState('');
  const status = STATUS_CONFIG[backendStatus] || STATUS_CONFIG.checking;

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowRunModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const copyCmd = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const STEPS = [
    {
      step: '01',
      title: 'Start Backend (FastAPI)',
      cmds: [
        { label: 'Navigate to backend folder', cmd: 'cd backend' },
        { label: 'Install dependencies (first time)', cmd: 'pip install -r requirements.txt' },
        { label: 'Train ML models', cmd: 'python train_model.py' },
        { label: 'Launch API server', cmd: 'python main.py' },
      ],
    },
    {
      step: '02',
      title: 'Start Frontend (React)',
      cmds: [
        { label: 'Open a new terminal & navigate', cmd: 'cd frontend' },
        { label: 'Install Node packages (first time)', cmd: 'npm install' },
        { label: 'Start dev server', cmd: 'npm run dev' },
      ],
    },
  ];


  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        onClick={() => onNavigate('home')}
      >
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(16,185,129,0.3)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 20h10" /><path d="M10 20c5.5-2.5 8-8 8-14" /><path d="M6 20c-2.5-5 .5-12 6-16 1.5 4 .5 8-2 12" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1, color: 'var(--text-main)' }}>
            Farmer<span style={{ color: '#10b981' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-faint)', letterSpacing: '0.08em', fontWeight: 500 }}>
            CROP INTELLIGENCE
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="nav-links-desktop" style={{
        display: 'flex', alignItems: 'center', gap: '2px',
        background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '3px',
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.4rem 0.8rem',
              border: 'none',
              borderRadius: 7,
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: currentPage === item.id ? '#fff' : 'var(--text-muted)',
              background: currentPage === item.id
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'transparent',
              boxShadow: currentPage === item.id ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            {item.label}
            {item.id === 'history' && historyCount > 0 && (
              <span style={{
                minWidth: 16, height: 16,
                borderRadius: 999,
                background: currentPage === item.id ? 'rgba(255,255,255,0.25)' : 'rgba(16,185,129,0.2)',
                color: currentPage === item.id ? '#fff' : '#10b981',
                fontSize: '0.6rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px',
              }}>{historyCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Run Model Modal */}
      {showRunModal && (
        <div
          onClick={() => setShowRunModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 620,
              background: 'linear-gradient(160deg, #0a1a0f 0%, #081210 100%)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.1)',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(16,185,129,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(16,185,129,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', boxShadow: '0 0 16px rgba(16,185,129,0.4)',
                }}>⚡</div>
                <div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                    Run Model
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.1rem' }}>
                    Start backend + frontend servers
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRunModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)', borderRadius: 8, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >✕</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {STEPS.map((section) => (
                <div key={section.step}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.02em',
                    }}>{section.step}</div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{section.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {section.cmds.map((item, ci) => (
                      <div key={ci} style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, padding: '0.6rem 0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                      }}>
                        <div>
                          <div style={{ fontSize: '0.67rem', color: 'var(--text-faint)', marginBottom: '0.2rem' }}>{item.label}</div>
                          <code style={{
                            fontFamily: "'Courier New', monospace", fontSize: '0.82rem',
                            color: '#10b981', letterSpacing: '0.02em',
                          }}>{item.cmd}</code>
                        </div>
                        <button
                          onClick={() => copyCmd(item.cmd, `${section.step}-${ci}`)}
                          title="Copy command"
                          style={{
                            flexShrink: 0, padding: '0.3rem 0.6rem', borderRadius: 6,
                            border: '1px solid rgba(16,185,129,0.25)',
                            background: copied === `${section.step}-${ci}` ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.07)',
                            color: copied === `${section.step}-${ci}` ? '#10b981' : 'var(--text-muted)',
                            fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                          }}
                        >
                          {copied === `${section.step}-${ci}` ? '✓ Copied' : '⎘ Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tip */}
              <div style={{
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 10, padding: '0.75rem 1rem',
                fontSize: '0.78rem', color: 'rgba(245,158,11,0.85)', lineHeight: 1.6,
              }}>
                💡 <strong>Tip:</strong> Run each section in a <em>separate terminal window</em>. Backend runs on <code style={{ color: '#f59e0b' }}>port 8000</code>, frontend on <code style={{ color: '#f59e0b' }}>port 5173</code>.
              </div>

              {/* Status indicator */}
              <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color, display: 'inline-block', boxShadow: `0 0 6px ${status.color}` }} />
                  Backend is currently: <strong style={{ color: status.color }}>{status.text}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Run Model Button */}
        <button
          id="run-model-btn"
          onClick={() => setShowRunModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.9rem', borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', color: '#fff',
            fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 10px rgba(16,185,129,0.35)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(16,185,129,0.35)'; }}
        >
          <span>⚡</span> Run Model
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: status.color, display: 'inline-block',
            boxShadow: `0 0 4px ${status.color}`,
          }} />
          {status.text}
        </div>
        <div style={{
          padding: '0.25rem 0.6rem',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          fontSize: '0.7rem',
          color: 'var(--text-faint)',
          fontWeight: 600
        }}>
          v2.0
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 6, padding: '0.35rem 0.5rem',
            color: 'var(--text-main)', fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav overlay */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(4,10,6,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem', zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: '0.25rem',
        }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1rem', border: 'none', borderRadius: 6,
                fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
                color: currentPage === item.id ? '#fff' : 'var(--text-muted)',
                background: currentPage === item.id
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255,255,255,0.02)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
