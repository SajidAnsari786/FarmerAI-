import React from 'react';

const STATS = [
  { label: 'Crops Covered', value: '48', color: '#10b981' },
  { label: 'Model Accuracy', value: '88%', color: '#3b82f6' },
  { label: 'Yield R² Score', value: '97.8%', color: '#f59e0b' },
  { label: 'Avg Response', value: '<1s', color: '#8b5cf6' },
];

export default function StatsBar() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.75rem',
      marginTop: '0.5rem',
    }}>
      {STATS.map((s, i) => (
        <div key={i} className="glass-flat" style={{
          padding: '1rem 1.25rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '1.5rem', fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            color: s.color,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>{s.value}</div>
          <div style={{
            fontSize: '0.68rem', color: 'var(--text-faint)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            fontWeight: 600, marginTop: '0.3rem',
          }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
