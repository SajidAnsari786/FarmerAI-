import React from 'react';

// Reuse same rank labels and colors as in ResultsPanel for consistency
const RANK_LABELS = ['🥇 Best Pick', '🥈 2nd Choice', '🥉 3rd Choice', '4th', '5th'];
const RANK_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function CropCard({ rec, rank, selected, onClick }) {
  // rec expected fields: crop (string), confidence (number), maybe icon
  const label = RANK_LABELS[rank] || `${rank + 1}`;
  const color = RANK_COLORS[rank] || '#6b7280';

  return (
    <div
      onClick={onClick}
      className="glass anim-fade"
      style={{
        padding: '1rem',
        cursor: 'pointer',
        border: selected ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
        transform: selected ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.2s, border 0.2s, box-shadow 0.2s',
        boxShadow: selected ? `0 8px 30px ${color}33` : 'none',
        position: 'relative',
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: 'absolute',
          top: '-0.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: color,
          color: '#fff',
          padding: '0.25rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          boxShadow: `0 2px 6px ${color}66`,
        }}
      >
        {label}
      </div>
      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize' }}>{rec.crop}</h3>
        {rec.confidence !== undefined && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Confidence: {rec.confidence}%
          </p>
        )}
      </div>
    </div>
  );
}
