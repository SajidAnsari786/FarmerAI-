import React, { useState } from 'react';

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
  const status = STATUS_CONFIG[backendStatus] || STATUS_CONFIG.checking;

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

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
