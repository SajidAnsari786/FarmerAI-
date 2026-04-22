import React, { useEffect, useState } from 'react';

function NutrientBar({ name, value, status }) {
  const maxValues = { nitrogen: 200, phosphorus: 200, potassium: 300, ph: 14 };
  const max = maxValues[name] || 100;
  const pct = Math.min((value / max) * 100, 100);

  const colorMap = { optimal: '#10b981', low: '#f59e0b', high: '#ef4444', acidic: '#f59e0b', alkaline: '#f59e0b' };
  const color = colorMap[status] || '#6b7280';

  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(pct), 200); }, [pct]);

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div className="nutrient-label">
        <span style={{ textTransform: 'capitalize' }}>{name.replace('_', ' ')}</span>
        <span style={{ color }}>{value} ({status})</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

export default function SoilHealthCard({ soilHealth }) {
  if (!soilHealth) {
    return (
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>Soil health data unavailable</p>
      </div>
    );
  }

  const { soil_health_score: score, grade, nutrient_levels } = soilHealth;
  const gradeColor = { Excellent: '#10b981', Good: '#84cc16', Fair: '#f59e0b', Poor: '#ef4444' }[grade] || '#6b7280';

  const [animScore, setAnimScore] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = score / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, score);
      setAnimScore(Math.round(start));
      if (start >= score) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <h3 className="heading-md" style={{ marginBottom: '1.25rem' }}>🌍 Soil Health</h3>

      {/* Score ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 90, height: 90, flexShrink: 0,
          borderRadius: '50%',
          background: `conic-gradient(${gradeColor} ${animScore}%, rgba(255,255,255,0.06) 0%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: 70, height: 70,
            borderRadius: '50%',
            background: 'var(--bg-deep)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '1.4rem', color: gradeColor, lineHeight: 1 }}>
              {animScore}
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-faint)' }}>/ 100</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: gradeColor }}>{grade}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Overall Soil Health</div>
          <div className={`badge ${grade === 'Excellent' ? 'badge-green' : grade === 'Poor' ? 'badge-red' : 'badge-gold'}`}
            style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
            {grade === 'Excellent' ? '✓ Ready to plant' : grade === 'Poor' ? '⚠ Needs treatment' : '⚡ Can improve'}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Nutrient breakdown */}
      {Object.entries(nutrient_levels).map(([name, data]) => (
        <NutrientBar key={name} name={name} value={data.value} status={data.status} />
      ))}
    </div>
  );
}
