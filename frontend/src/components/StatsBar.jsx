import React from 'react';

const stats = [
  { icon: '🌾', value: '22', label: 'Crop Types' },
  { icon: '🧪', value: '7+', label: 'Soil Parameters' },
  { icon: '📊', value: '95%', label: 'Accuracy' },
  { icon: '⚡', value: '<1s', label: 'Prediction Time' },
  { icon: '🌍', value: '3', label: 'Growing Seasons' },
];

export default function StatsBar() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.75rem',
      marginTop: '0.5rem',
    }}>
      {stats.map((s, i) => (
        <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
          <div style={{
            fontFamily: 'Outfit,sans-serif',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#10b981',
            lineHeight: 1
          }}>{s.value}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
