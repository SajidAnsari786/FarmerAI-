import React from 'react';

const RISK_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

export default function PestRiskCard({ pestData }) {
  if (!pestData) {
    return (
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>🐛 Pest risk data loading…</p>
      </div>
    );
  }

  const { alert, pests = [] } = pestData;
  const alertLevel = alert?.includes('High') ? 'High' : alert?.includes('Medium') ? 'Medium' : 'Low';
  const alertColor = RISK_COLOR[alertLevel];

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <h3 className="heading-md" style={{ marginBottom: '1rem' }}>🐛 Pest & Disease Risk</h3>

      {/* Alert banner */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: 10,
        background: `${alertColor}18`,
        border: `1px solid ${alertColor}44`,
        color: alertColor,
        fontWeight: 600,
        fontSize: '0.85rem',
        marginBottom: '1rem',
      }}>
        ⚠️ {alert || 'No alerts'}
      </div>

      {/* Pest list */}
      {pests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {pests.map((p, i) => {
            const riskPct = p.risk_percent ?? 0;
            const color = riskPct >= 60 ? '#ef4444' : riskPct >= 35 ? '#f59e0b' : '#10b981';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 500 }}>{p.pest}</span>
                  <span style={{ color, fontWeight: 600 }}>{riskPct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${riskPct}%`, background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
                </div>
                {p.prevention && (
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--text-faint)' }}>💊 {p.prevention}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No specific pest risks detected.</p>
      )}
    </div>
  );
}
