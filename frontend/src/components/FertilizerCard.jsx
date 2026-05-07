import React from 'react';

export default function FertilizerCard({ fertData }) {
  if (!fertData) {
    return (
      <div className="glass" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>🧪 Fertilizer data loading…</p>
      </div>
    );
  }

  const { fertilizer_qty = {}, notes = [], soil_ph_advice } = fertData;
  const items = [
    { label: 'Urea', key: 'urea_kg', color: '#10b981', icon: '🟢' },
    { label: 'DAP (Phosphorus)', key: 'dap_kg', color: '#3b82f6', icon: '🔵' },
    { label: 'MOP (Potassium)', key: 'mop_kg', color: '#f59e0b', icon: '🟡' },
  ];

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <h3 className="heading-md" style={{ marginBottom: '1rem' }}>🧪 Fertilizer Prescription</h3>

      {/* Fertilizer amounts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
        {items.map(({ label, key, color, icon }) => (
          <div key={key} style={{
            textAlign: 'center',
            padding: '0.875rem 0.5rem',
            background: `${color}12`,
            border: `1px solid ${color}33`,
            borderRadius: 10,
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{icon}</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', color }}>
              {fertilizer_qty[key] ?? '—'} kg
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* pH advice */}
      {soil_ph_advice && (
        <div style={{
          padding: '0.65rem 0.875rem',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 8,
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
        }}>
          🧑‍🔬 {soil_ph_advice}
        </div>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <ul style={{ margin: 0, padding: '0 0 0 1rem', listStyle: 'disc' }}>
          {notes.map((note, i) => (
            <li key={i} style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
