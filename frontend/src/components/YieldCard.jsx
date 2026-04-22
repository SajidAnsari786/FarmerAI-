import React, { useEffect, useState } from 'react';

function AnimatedNumber({ target, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 45;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(parseFloat(start.toFixed(2)));
      if (start >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export default function YieldCard({ yieldData }) {
  if (!yieldData) {
    return (
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>Yield prediction unavailable</p>
      </div>
    );
  }

  const {
    crop, predicted_yield_quintals_per_hectare: yph,
    total_yield_quintals: total, farm_area_hectares: area,
    estimated_revenue_inr: revenue, market_price_per_quintal: price
  } = yieldData;

  const metrics = [
    { label: 'Yield per Hectare', value: yph, suffix: ' qtl/ha', color: '#10b981' },
    { label: 'Total Yield', value: total, suffix: ' quintals', color: '#3b82f6' },
    { label: 'Farm Area', value: area, suffix: ' ha', color: '#8b5cf6' },
    { label: 'Est. Revenue', value: revenue, prefix: '₹', suffix: '', color: '#f59e0b' },
  ];

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>📈 Yield Prediction</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span className="badge badge-green" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
          🌾 {crop}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          @ ₹{price?.toLocaleString()}/qtl
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {metrics.map((m, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              fontFamily: 'Outfit,sans-serif', fontWeight: 800,
              fontSize: i === 3 ? '1.15rem' : '1.4rem',
              color: m.color, lineHeight: 1, marginBottom: '0.3rem'
            }}>
              <AnimatedNumber target={m.value} prefix={m.prefix || ''} suffix={m.suffix} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1rem',
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 10,
        fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5
      }}>
        ⚠️ Estimates based on historical data and ML model predictions. Actual yields may vary based on farming practices.
      </div>
    </div>
  );
}
