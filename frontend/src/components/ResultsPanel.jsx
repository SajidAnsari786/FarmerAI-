import React, { useEffect, useState } from 'react';
import SoilHealthCard from './SoilHealthCard';
import YieldCard from './YieldCard';

const RANK_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];
const RANK_LABELS = ['🥇 Best Pick', '🥈 2nd Choice', '🥉 3rd Choice', '4th', '5th'];

function ConfidenceBar({ pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(pct), 100); }, [pct]);
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
      />
    </div>
  );
}

function CropCard({ rec, rank, onClick, selected }) {
  const color = RANK_COLORS[rank] || '#6b7280';
  return (
    <div
      onClick={onClick}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${color}18, ${color}08)`
          : 'rgba(255,255,255,0.025)',
        border: `1px solid ${selected ? color : 'var(--border)'}`,
        borderRadius: 14,
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: selected ? 'scale(1.01)' : 'scale(1)',
        boxShadow: selected ? `0 4px 20px ${color}30` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.8rem' }}>{rec.icon}</span>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.05rem', textTransform: 'capitalize' }}>
              {rec.crop}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{RANK_LABELS[rank]}</div>
          </div>
        </div>
        <div style={{
          fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem',
          color: color,
        }}>
          {rec.confidence}%
        </div>
      </div>
      <ConfidenceBar pct={rec.confidence} color={color} />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
          📅 {rec.season}
        </span>
        <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
          ₹{rec.market_price_per_quintal?.toLocaleString()}/qtl
        </span>
      </div>
      {selected && (
        <div style={{
          marginTop: '0.875rem',
          padding: '0.625rem 0.875rem',
          background: `${color}12`,
          border: `1px solid ${color}30`,
          borderRadius: 8,
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          💡 {rec.tip}
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ results, yieldData, soilHealth, onBack }) {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const recs = results?.recommendations || [];

  return (
    <div className="anim-fade" style={{ paddingTop: '2rem' }}>
      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          ← Back
        </button>
        <div>
          <h2 className="heading-lg">🎯 AI Recommendations</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Click any crop to see farming tips</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Top 5 crop recommendations */}
        <div className="glass" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge badge-green">TOP {recs.length} RECOMMENDATIONS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
            {recs.map((rec, i) => (
              <CropCard
                key={rec.crop}
                rec={rec}
                rank={i}
                selected={selectedCrop === i}
                onClick={() => setSelectedCrop(i)}
              />
            ))}
          </div>
        </div>

        {/* Bottom grid: Soil Health + Yield */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <SoilHealthCard soilHealth={soilHealth} />
          <YieldCard yieldData={yieldData} />
        </div>

        {/* Soil advice */}
        {results?.soil_advice?.length > 0 && (
          <div className="glass" style={{ padding: '1.75rem' }}>
            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>🧪 Soil Improvement Advice</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {results.soil_advice.map((tip, i) => (
                <div key={i} style={{
                  padding: '0.875rem 1rem',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 10,
                  fontSize: '0.83rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}>
                  🌱 {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
