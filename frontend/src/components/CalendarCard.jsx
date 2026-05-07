import React from 'react';

const STAGE_COLORS = {
  sow: '#10b981',
  transplant: '#3b82f6',
  fertilize: '#f59e0b',
  irrigate: '#06b6d4',
  spray: '#8b5cf6',
  harvest: '#ef4444',
};

const STAGE_ICONS = {
  sow: '🌱',
  transplant: '🪴',
  fertilize: '🧪',
  irrigate: '💧',
  spray: '🚿',
  harvest: '🌾',
};

export default function CalendarCard({ calData }) {
  if (!calData) {
    return (
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>📅 Crop calendar loading…</p>
      </div>
    );
  }

  const { crop, season, calendar = {}, tips = [] } = calData;

  const stages = Object.entries(calendar);

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className="heading-md">📅 Crop Calendar</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {crop && <span className="badge badge-green" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>🌾 {crop}</span>}
          {season && <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>🗓 {season}</span>}
        </div>
      </div>

      {stages.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {stages.map(([stage, timing]) => {
            const color = STAGE_COLORS[stage] || '#6b7280';
            const icon = STAGE_ICONS[stage] || '📌';
            return (
              <div key={stage} style={{
                padding: '0.875rem',
                borderRadius: 10,
                background: `${color}12`,
                border: `1px solid ${color}33`,
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{icon}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color, letterSpacing: '0.05em' }}>{stage}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{timing}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No calendar stages available for this crop.</p>
      )}

      {tips.length > 0 && (
        <div style={{
          padding: '0.875rem 1rem',
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.5rem' }}>💡 Seasonal Tips</div>
          <ul style={{ margin: 0, padding: '0 0 0 1rem', listStyle: 'disc' }}>
            {tips.map((tip, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem', lineHeight: 1.5 }}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
