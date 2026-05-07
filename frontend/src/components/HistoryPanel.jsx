import React from 'react';

export default function HistoryPanel({ history, onClear, onNavigatePredict }) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  const gradeFromScore = (s) => s >= 80 ? { g:'Excellent', c:'#10b981' } : s >= 60 ? { g:'Good', c:'#84cc16' } : s >= 40 ? { g:'Fair', c:'#f59e0b' } : { g:'Poor', c:'#ef4444' };

  if (history.length === 0) {
    return (
      <div className="anim-fade" style={{ paddingTop:'2.5rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div className="badge badge-blue" style={{ marginBottom:'0.75rem' }}>📊 PREDICTION HISTORY</div>
          <h1 className="heading-lg">Your <span className="gradient-text">History</span></h1>
        </div>
        <div className="glass" style={{ padding:'4rem 2rem', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.4 }}>📋</div>
          <p style={{ color:'var(--text-muted)', fontSize:'1rem', marginBottom:'0.5rem' }}>No predictions yet</p>
          <p style={{ color:'var(--text-faint)', fontSize:'0.82rem', marginBottom:'1.5rem' }}>Make your first crop prediction to see it here</p>
          <button onClick={onNavigatePredict} className="btn-primary">🚀 Make a Prediction</button>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fade" style={{ paddingTop:'2.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom:'0.75rem' }}>📊 PREDICTION HISTORY</div>
          <h1 className="heading-lg">Your <span className="gradient-text">History</span></h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'0.25rem' }}>{history.length} prediction{history.length !== 1 ? 's' : ''} saved locally</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button onClick={onNavigatePredict} className="btn-primary" style={{ padding:'0.6rem 1.25rem', fontSize:'0.85rem' }}>+ New Prediction</button>
          <button onClick={onClear} className="btn-secondary" style={{ padding:'0.6rem 1.25rem', fontSize:'0.85rem', color:'#ef4444', borderColor:'rgba(239,68,68,0.3)' }}>🗑️ Clear All</button>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {history.map((entry, idx) => {
          const sg = gradeFromScore(entry.soilScore);
          return (
            <div key={entry.id} className="glass anim-fade" style={{ padding:'1.25rem 1.5rem', animationDelay:`${Math.min(idx*0.05,0.3)}s`, opacity:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
                {/* Left: crop info */}
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                    {entry.recommendations?.[0]?.icon || '🌱'}
                  </div>
                  <div>
                    <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'1.05rem', textTransform:'capitalize' }}>
                      {entry.topCrop}
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-faint)' }}>{formatDate(entry.timestamp)}</div>
                  </div>
                </div>

                {/* Right: stats */}
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, color:'#10b981', fontSize:'1.1rem' }}>{entry.topConfidence}%</div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text-faint)' }}>Confidence</div>
                  </div>
                  <div style={{ width:1, height:30, background:'var(--border)' }} />
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, color:sg.c, fontSize:'1.1rem' }}>{entry.soilScore}</div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text-faint)' }}>Soil Score</div>
                  </div>
                  <div style={{ width:1, height:30, background:'var(--border)' }} />
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, color:'#3b82f6', fontSize:'1.1rem' }}>{entry.yieldPerHa}</div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text-faint)' }}>qtl/ha</div>
                  </div>
                  {entry.revenue > 0 && (
                    <>
                      <div style={{ width:1, height:30, background:'var(--border)' }} />
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, color:'#f59e0b', fontSize:'0.95rem' }}>₹{entry.revenue.toLocaleString()}</div>
                        <div style={{ fontSize:'0.65rem', color:'var(--text-faint)' }}>Revenue</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Input summary */}
              {entry.input && (
                <div style={{ marginTop:'0.875rem', paddingTop:'0.75rem', borderTop:'1px solid var(--border)', display:'flex', gap:'0.75rem', flexWrap:'wrap', fontSize:'0.73rem', color:'var(--text-faint)' }}>
                  <span>N:{entry.input.N}</span><span>P:{entry.input.P}</span><span>K:{entry.input.K}</span>
                  <span>🌡️{entry.input.temperature}°C</span><span>💧{entry.input.humidity}%</span>
                  <span>pH:{entry.input.ph}</span><span>🌧️{entry.input.rainfall}mm</span>
                  {entry.input.season && <span>📅{entry.input.season}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
