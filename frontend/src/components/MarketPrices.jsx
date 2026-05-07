import React, { useState, useEffect } from 'react';

const TREND_ICONS = { up: '📈', down: '📉', stable: '➡️' };
const TREND_COLORS = { up: '#10b981', down: '#ef4444', stable: '#f59e0b' };

export default function MarketPrices({ apiBase }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/market-prices`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiBase]);

  const filtered = data?.prices?.filter(p => !search || p.crop.includes(search.toLowerCase())) || [];

  return (
    <div className="anim-fade" style={{ paddingTop: '1rem' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', marginBottom: '1.5rem',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/market-bg.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'brightness(0.35)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,10,6,0.3) 0%, rgba(4,10,6,0.85) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '3.5rem 1.5rem 3rem',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.7rem', borderRadius: 999,
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            fontSize: '0.68rem', fontWeight: 600, color: '#f59e0b',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            LIVE MARKET DATA
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff',
          }}>
            Market <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #10b981)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Prices</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto' }}>
            Today's crop prices with MSP comparison and trend analysis
          </p>
          {data?.date && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>{data.date}</div>}
        </div>
      </div>

      {/* Search */}
      <div className="glass" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="inp" placeholder="🔍 Search crop..." />
      </div>

      {loading ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="anim-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--emerald)', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Fetching market prices...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {filtered.map((p, i) => {
            const tc = TREND_COLORS[p.trend];
            return (
              <div key={p.crop} className="glass anim-fade" style={{ padding: '1.25rem', animationDelay: `${Math.min(i * 0.03, 0.3)}s`, opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, textTransform: 'capitalize', fontSize: '1rem' }}>{p.crop}</div>
                  <span style={{
                    padding: '0.2rem 0.5rem', borderRadius: 999,
                    background: `${tc}15`, border: `1px solid ${tc}30`,
                    fontSize: '0.7rem', fontWeight: 700, color: tc,
                  }}>{TREND_ICONS[p.trend]} {p.change_pct > 0 ? '+' : ''}{p.change_pct}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>Current</div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: tc }}>₹{p.current_inr.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>MSP</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹{p.msp_inr.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.3rem' }}>per quintal</div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No matching crops found</p>
        </div>
      )}
    </div>
  );
}
