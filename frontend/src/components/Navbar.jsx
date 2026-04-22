import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 4px 14px rgba(16,185,129,0.4)'
        }}>🌾</div>
        <div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>
            Farmer<span style={{ color: '#10b981' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
            SMART CROP INTELLIGENCE
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
          AI Online
        </div>
        <div style={{
          padding: '0.35rem 0.9rem',
          borderRadius: 999,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          fontSize: '0.78rem',
          color: '#10b981',
          fontWeight: 600
        }}>
          v2.0
        </div>
      </div>
    </nav>
  );
}
