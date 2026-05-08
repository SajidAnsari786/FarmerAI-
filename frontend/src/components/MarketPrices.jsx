import React, { useState, useEffect } from 'react';

const TREND_ICONS  = { up: '📈', down: '📉', stable: '➡️' };
const TREND_COLORS = { up: '#10b981', down: '#ef4444', stable: '#f59e0b' };

const CATEGORY_ICONS = {
  'Cereals':    '🌾',
  'Pulses':     '🫘',
  'Oilseeds':   '🌻',
  'Fibers':     '🪢',
  'Cash Crops': '💰',
  'Fruits':     '🍎',
  'Vegetables': '🥦',
  'Spices':     '🌶️',
  'Plantation': '🌿',
  'All':        '📊',
};

const SEASON_COLORS = {
  'Kharif': { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10b981' },
  'Rabi':   { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', color: '#60a5fa' },
  'Annual': { bg: 'rgba(167,139,250,0.12)',border: 'rgba(167,139,250,0.3)', color: '#a78bfa' },
  'Summer': { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24' },
};

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 130,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '1rem 1.25rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.4rem', fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: color || 'var(--text-main)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  );
}

function PriceCard({ p, i }) {
  const tc = TREND_COLORS[p.trend];
  const sc = SEASON_COLORS[p.season] || SEASON_COLORS['Annual'];
  const aboveMSP = p.above_msp;

  return (
    <div
      className="glass anim-fade"
      style={{
        padding: '1.1rem 1.25rem',
        animationDelay: `${Math.min(i * 0.025, 0.4)}s`,
        opacity: 0,
        border: aboveMSP
          ? '1px solid rgba(16,185,129,0.25)'
          : '1px solid rgba(239,68,68,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Above/Below MSP glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: aboveMSP
          ? 'linear-gradient(90deg, #10b981, #059669)'
          : 'linear-gradient(90deg, #ef4444, #dc2626)',
      }} />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.97rem', textTransform: 'capitalize' }}>
            {p.crop.replace(/_/g, ' ')}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.1rem 0.45rem', borderRadius: 999,
              background: sc.bg, border: `1px solid ${sc.border}`,
              fontSize: '0.62rem', fontWeight: 700, color: sc.color,
            }}>{p.season}</span>
            <span style={{
              padding: '0.1rem 0.45rem', borderRadius: 999,
              background: aboveMSP ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
              border: aboveMSP ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.25)',
              fontSize: '0.62rem', fontWeight: 700,
              color: aboveMSP ? '#10b981' : '#f87171',
            }}>{aboveMSP ? '✓ Above MSP' : '⚠ Below MSP'}</span>
          </div>
        </div>
        <span style={{
          padding: '0.25rem 0.55rem', borderRadius: 999,
          background: `${tc}18`, border: `1px solid ${tc}35`,
          fontSize: '0.72rem', fontWeight: 700, color: tc, whiteSpace: 'nowrap',
        }}>
          {TREND_ICONS[p.trend]} {p.change_pct > 0 ? '+' : ''}{p.change_pct}%
        </span>
      </div>

      {/* Price Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.6rem' }}>
        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.1rem' }}>Market Price</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.45rem', color: tc, lineHeight: 1 }}>
            ₹{p.current_inr.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.1rem' }}>Govt MSP 2024-25</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-muted)' }}>₹{p.msp_inr.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.67rem', color: 'var(--text-faint)' }}>{p.unit}</div>
        <div style={{ fontSize: '0.67rem', color: p.msp_hike_pct > 0 ? '#10b981' : 'var(--text-faint)', fontWeight: 600 }}>
          MSP hike: {p.msp_hike_pct > 0 ? '+' : ''}{p.msp_hike_pct}% vs prev year
        </div>
      </div>
    </div>
  );
}

export default function MarketPrices({ apiBase }) {
  const [data, setData]       = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy]   = useState('category');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${apiBase}/market-prices`).then(r => r.ok ? r.json() : null),
      fetch(`${apiBase}/market-summary`).then(r => r.ok ? r.json() : null),
    ]).then(([d, s]) => {
      setData(d);
      setSummary(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [apiBase]);

  const categories = data ? ['All', ...(summary?.categories || [])] : ['All'];

  const filtered = (data?.prices || []).filter(p => {
    const matchSearch = !search || p.crop.replace(/_/g, ' ').toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeTab === 'All' || p.category === activeTab;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (sortBy === 'price_desc') return b.current_inr - a.current_inr;
    if (sortBy === 'price_asc')  return a.current_inr - b.current_inr;
    if (sortBy === 'msp_hike')   return b.msp_hike_pct - a.msp_hike_pct;
    return a.category.localeCompare(b.category); // default: category
  });

  return (
    <div className="anim-fade" style={{ paddingTop: '1rem' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/market-bg.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,10,6,0.2) 0%, rgba(4,10,6,0.88) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '3.5rem 1.5rem 2.75rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.75rem', borderRadius: 999,
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)',
            fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', animation: 'pulse-dot 1.5s ease infinite' }} />
            LIVE MANDI PRICES · GOVT MSP 2024-25
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '0.6rem', color: '#fff',
          }}>
            Crop Market <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #10b981)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Prices</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', maxWidth: 520, margin: '0 auto 0.75rem' }}>
            Real Government of India MSP 2024-25 data with current mandi prices, trend analysis & above/below MSP indicators
          </p>
          {data?.last_updated && (
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              🕐 {data.last_updated} &nbsp;•&nbsp; 📋 Source: {data.source}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary Bar */}
      {summary && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <StatBox label="Total Crops" value={summary.total_crops} sub="tracked" />
          <StatBox label="Above MSP" value={summary.above_msp_count} sub="crops" color="#10b981" />
          <StatBox label="Below MSP" value={summary.below_msp_count} sub="crops" color="#f87171" />
          <StatBox
            label="Highest Price"
            value={`₹${summary.highest_price?.current?.toLocaleString('en-IN')}`}
            sub={summary.highest_price?.crop?.replace(/_/g, ' ')}
            color="#f59e0b"
          />
          <StatBox
            label="Lowest Price"
            value={`₹${summary.lowest_price?.current?.toLocaleString('en-IN')}`}
            sub={summary.lowest_price?.crop?.replace(/_/g, ' ')}
            color="#60a5fa"
          />
        </div>
      )}

      {/* Controls Row */}
      <div className="glass" style={{ padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          className="inp"
          placeholder="🔍 Search crop name..."
          style={{ flex: 1, minWidth: 180 }}
        />
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="inp"
          style={{ minWidth: 160, flex: '0 0 auto' }}
        >
          <option value="category">Sort: By Category</option>
          <option value="price_desc">Sort: Price ↓ High</option>
          <option value="price_asc">Sort: Price ↑ Low</option>
          <option value="msp_hike">Sort: MSP Hike %</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: '0.35rem 0.85rem', borderRadius: 999,
              border: activeTab === cat ? '1px solid rgba(245,158,11,0.5)' : '1px solid var(--border)',
              background: activeTab === cat ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
              color: activeTab === cat ? '#f59e0b' : 'var(--text-muted)',
              fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {CATEGORY_ICONS[cat] || '•'} {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="anim-spin" style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#f59e0b', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading real market prices...</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.75rem' }}>
            {filtered.map((p, i) => <PriceCard key={p.crop} p={p} i={i} />)}
          </div>

          {filtered.length === 0 && (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No matching crops found</p>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.9rem 1.2rem',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
            borderRadius: 12, fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
          }}>
            <strong style={{ color: '#f59e0b' }}>📋 Data Sources & Disclaimer:</strong>&nbsp;
            MSP values are official <strong>Government of India (CACP) 2024-25</strong> figures.
            Current market prices are indicative mandi rates from <strong>Agmarknet / eNAM</strong> network, updated daily.
            Horticultural crops (Fruits, Vegetables, Spices) use market reference prices as they do not have official Govt MSP.
            Prices may vary by state, mandi, and grade. Always verify with your local APMC mandi before selling.
          </div>
        </>
      )}
    </div>
  );
}
