import React, { useState, useMemo } from 'react';

const CROPS = [
  { name:'rice', icon:'🌾', season:'Kharif', soil:'Clayey', baseYield:45, price:2000, water:'High', duration:'120-150 days', temp:'20-27°C', ph:'5.5-7.5', rain:'150-300mm', tip:'Ensure standing water 5-10cm during seedling stage. Apply split doses of Nitrogen.' },
  { name:'wheat', icon:'🌿', season:'Rabi', soil:'Loamy', baseYield:35, price:2150, water:'Medium', duration:'120-150 days', temp:'15-25°C', ph:'6.0-7.5', rain:'50-100mm', tip:'Irrigate at CRI (21 days), tillering, jointing, and grain-filling stages.' },
  { name:'maize', icon:'🌽', season:'Kharif', soil:'Sandy', baseYield:55, price:1850, water:'Medium', duration:'80-110 days', temp:'25-32°C', ph:'5.5-7.5', rain:'50-100mm', tip:'Plant at 20cm spacing. Use 30kg/ha Zinc Sulphate for micronutrient boost.' },
  { name:'chickpea', icon:'🫘', season:'Rabi', soil:'Sandy', baseYield:18, price:5200, water:'Low', duration:'90-120 days', temp:'20-30°C', ph:'6.0-8.0', rain:'60-90mm', tip:'No irrigation needed if rainfall is over 500mm. Avoid waterlogging.' },
  { name:'kidneybeans', icon:'🫘', season:'Kharif', soil:'Loamy', baseYield:15, price:5800, water:'Medium', duration:'90-120 days', temp:'18-27°C', ph:'5.5-7.0', rain:'80-120mm', tip:'Provide trellis support. Harvest pods when fully dry.' },
  { name:'pigeonpeas', icon:'🫛', season:'Kharif', soil:'Sandy', baseYield:14, price:6300, water:'Low', duration:'140-180 days', temp:'20-35°C', ph:'5.0-7.0', rain:'60-150mm', tip:'Deep-rooted, drought tolerant. Good for intercropping.' },
  { name:'mothbeans', icon:'🌱', season:'Kharif', soil:'Sandy', baseYield:10, price:5500, water:'Very Low', duration:'60-90 days', temp:'24-32°C', ph:'6.0-7.5', rain:'30-75mm', tip:'Extremely drought tolerant. Grows well in sandy soils.' },
  { name:'mungbean', icon:'🫛', season:'Kharif', soil:'Sandy', baseYield:12, price:6000, water:'Low', duration:'60-75 days', temp:'25-35°C', ph:'6.0-7.5', rain:'50-75mm', tip:'Short duration (60-75 days). Excellent for crop rotation.' },
  { name:'blackgram', icon:'🌿', season:'Kharif', soil:'Loamy', baseYield:13, price:5700, water:'Medium', duration:'70-90 days', temp:'25-35°C', ph:'6.0-7.5', rain:'40-60mm', tip:'Sensitive to waterlogging. Ensure good field drainage.' },
  { name:'lentil', icon:'🫘', season:'Rabi', soil:'Sandy', baseYield:11, price:5400, water:'Low', duration:'100-120 days', temp:'15-25°C', ph:'5.5-8.0', rain:'25-50mm', tip:'Inoculate seeds with Rhizobium before sowing.' },
  { name:'sugarcane', icon:'🎋', season:'Kharif', soil:'Loamy', baseYield:700, price:315, water:'Very High', duration:'10-18 months', temp:'20-35°C', ph:'6.0-8.0', rain:'150-250mm', tip:'Ratoon cropping for 2-3 seasons.' },
  { name:'cotton', icon:'☁️', season:'Kharif', soil:'Loamy', baseYield:20, price:6600, water:'Medium', duration:'150-180 days', temp:'20-30°C', ph:'6.0-8.0', rain:'80-160mm', tip:'Use drip irrigation. Monitor for bollworm.' },
  { name:'jute', icon:'🌿', season:'Kharif', soil:'Clayey', baseYield:25, price:4200, water:'High', duration:'120-150 days', temp:'24-37°C', ph:'6.0-7.5', rain:'120-150mm', tip:'Requires humid climate for fiber extraction.' },
  { name:'coffee', icon:'☕', season:'Zaid', soil:'Loamy', baseYield:22, price:8000, water:'Medium', duration:'3-4 years', temp:'15-28°C', ph:'5.0-6.0', rain:'150-250mm', tip:'Shade-grown coffee has superior flavor.' },
  { name:'banana', icon:'🍌', season:'Kharif', soil:'Loamy', baseYield:400, price:2500, water:'High', duration:'9-12 months', temp:'20-35°C', ph:'5.5-7.0', rain:'100-200mm', tip:'Apply 200g N, 60g P2O5, 300g K2O per plant.' },
  { name:'mango', icon:'🥭', season:'Zaid', soil:'Sandy', baseYield:80, price:4500, water:'Low', duration:'3-6 years', temp:'24-30°C', ph:'5.5-7.5', rain:'25-75mm', tip:'Requires dry weather at flowering.' },
  { name:'grapes', icon:'🍇', season:'Rabi', soil:'Sandy', baseYield:200, price:5500, water:'Medium', duration:'2-3 years', temp:'15-35°C', ph:'5.5-7.0', rain:'25-75mm', tip:'Train on trellis. Prune annually.' },
  { name:'watermelon', icon:'🍉', season:'Zaid', soil:'Sandy', baseYield:300, price:1800, water:'Medium', duration:'80-100 days', temp:'22-30°C', ph:'6.0-7.5', rain:'40-60mm', tip:'Use black plastic mulch to retain moisture.' },
  { name:'apple', icon:'🍎', season:'Rabi', soil:'Loamy', baseYield:120, price:8500, water:'Medium', duration:'4-8 years', temp:'10-22°C', ph:'5.5-7.0', rain:'100-125mm', tip:'Requires 1000+ chilling hours below 7°C.' },
  { name:'orange', icon:'🍊', season:'Zaid', soil:'Loamy', baseYield:150, price:4000, water:'Medium', duration:'3-5 years', temp:'15-30°C', ph:'6.0-7.5', rain:'75-125mm', tip:'Apply Zinc and Boron for fruit quality.' },
  { name:'papaya', icon:'🍈', season:'Zaid', soil:'Sandy', baseYield:350, price:2800, water:'Medium', duration:'6-9 months', temp:'22-32°C', ph:'6.0-7.0', rain:'100-150mm', tip:'Fast-growing. Protect from frost.' },
  { name:'coconut', icon:'🥥', season:'Kharif', soil:'Sandy', baseYield:100, price:3200, water:'High', duration:'5-7 years', temp:'20-32°C', ph:'5.0-8.0', rain:'100-300mm', tip:'Plant at 7.5m x 7.5m spacing.' },
];

const SC = { Kharif:{bg:'rgba(16,185,129,0.12)',brd:'rgba(16,185,129,0.3)',c:'#10b981'}, Rabi:{bg:'rgba(59,130,246,0.12)',brd:'rgba(59,130,246,0.3)',c:'#3b82f6'}, Zaid:{bg:'rgba(245,158,11,0.12)',brd:'rgba(245,158,11,0.3)',c:'#f59e0b'} };

export default function CropEncyclopedia() {
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('All');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const filtered = useMemo(() => {
    let list = CROPS.filter(c => {
      if (search && !c.name.includes(search.toLowerCase())) return false;
      if (season !== 'All' && c.season !== season) return false;
      return true;
    });
    if (sortBy === 'price') list.sort((a,b) => b.price - a.price);
    else if (sortBy === 'yield') list.sort((a,b) => b.baseYield - a.baseYield);
    else list.sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [search, season, sortBy]);

  return (
    <div className="anim-fade" style={{ paddingTop: '1rem' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', marginBottom: '1.5rem',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/crops-bg.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,10,6,0.3) 0%, rgba(4,10,6,0.85) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '3.5rem 1.5rem 3rem',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.7rem', borderRadius: 999,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            fontSize: '0.68rem', fontWeight: 600, color: '#10b981',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            CROP DATABASE
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff',
          }}>
            Crop <span style={{
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Encyclopedia</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto' }}>
            Browse all {CROPS.length} supported crops with ideal conditions, prices & expert tips
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding:'1.25rem', marginBottom:'1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'0.75rem', alignItems:'end' }}>
          <div><label className="lbl">Search</label><input type="text" value={search} onChange={e=>setSearch(e.target.value)} className="inp" placeholder="🔍 Search..." /></div>
          <div><label className="lbl">Season</label><select value={season} onChange={e=>setSeason(e.target.value)} className="inp">{['All','Kharif','Rabi','Zaid'].map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label className="lbl">Sort By</label><select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="inp"><option value="name">Name</option><option value="price">Price ↓</option><option value="yield">Yield ↓</option></select></div>
        </div>
        <div style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'var(--text-faint)' }}>Showing {filtered.length} of {CROPS.length} crops</div>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'0.875rem' }}>
        {filtered.map((crop, i) => {
          const s = SC[crop.season];
          return (
            <div key={crop.name} onClick={()=>setSelected(crop)} className="glass anim-fade"
              style={{ padding:'1.25rem', cursor:'pointer', animationDelay:`${Math.min(i*0.04,0.4)}s`, opacity:0, transition:'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(16,185,129,0.15)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <div style={{ width:48,height:48,borderRadius:12, background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0 }}>{crop.icon}</div>
                <div>
                  <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, textTransform:'capitalize' }}>{crop.name}</div>
                  <span style={{ padding:'0.1rem 0.45rem',borderRadius:999,background:s.bg,border:`1px solid ${s.brd}`,fontSize:'0.65rem',fontWeight:600,color:s.c }}>{crop.season}</span>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.35rem', fontSize:'0.75rem', color:'var(--text-faint)' }}>
                <span>💰 <b style={{color:'#f59e0b'}}>₹{crop.price.toLocaleString()}</b>/qtl</span>
                <span>📊 <b style={{color:'#10b981'}}>{crop.baseYield}</b> qtl/ha</span>
                <span>💧 {crop.water}</span>
                <span>⏱️ {crop.duration}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass" style={{ padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem', opacity:0.4 }}>🔍</div>
          <p style={{ color:'var(--text-muted)' }}>No crops match your filters</p>
          <button onClick={()=>{setSearch('');setSeason('All');}} className="btn-secondary" style={{marginTop:'1rem'}}>Reset</button>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.2s ease' }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:'100%',maxWidth:560,maxHeight:'85vh',overflowY:'auto',background:'var(--bg-dark)',border:'1px solid var(--border-h)',borderRadius:20,padding:'2rem',boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ width:56,height:56,borderRadius:14,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem' }}>{selected.icon}</div>
                <div>
                  <h2 className="heading-lg" style={{ textTransform:'capitalize' }}>{selected.name}</h2>
                  <span style={{ padding:'0.15rem 0.5rem',borderRadius:999,background:SC[selected.season].bg,border:`1px solid ${SC[selected.season].brd}`,fontSize:'0.7rem',fontWeight:600,color:SC[selected.season].c }}>{selected.season}</span>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',borderRadius:8,padding:'0.4rem 0.6rem',color:'var(--text-muted)',cursor:'pointer',fontSize:'1rem' }}>✕</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.5rem',marginBottom:'1.25rem' }}>
              {[{l:'Yield',v:`${selected.baseYield} qtl/ha`,c:'#10b981'},{l:'Price',v:`₹${selected.price.toLocaleString()}/qtl`,c:'#f59e0b'},{l:'Duration',v:selected.duration,c:'#3b82f6'},{l:'Temp',v:selected.temp,c:'#ef4444'},{l:'pH',v:selected.ph,c:'#8b5cf6'},{l:'Rainfall',v:selected.rain,c:'#06b6d4'}].map((m,i)=>(
                <div key={i} className="stat-card" style={{textAlign:'center',padding:'0.75rem'}}>
                  <div style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'0.85rem',color:m.c}}>{m.v}</div>
                  <div style={{fontSize:'0.65rem',color:'var(--text-faint)'}}>{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'1.25rem' }}>
              <div className="glass-flat" style={{padding:'0.875rem'}}><div style={{fontSize:'0.68rem',color:'var(--text-faint)',textTransform:'uppercase',fontWeight:600,marginBottom:'0.2rem'}}>Soil</div><div style={{fontWeight:700}}>🪨 {selected.soil}</div></div>
              <div className="glass-flat" style={{padding:'0.875rem'}}><div style={{fontSize:'0.68rem',color:'var(--text-faint)',textTransform:'uppercase',fontWeight:600,marginBottom:'0.2rem'}}>Revenue</div><div style={{fontWeight:700,color:'#f59e0b'}}>₹{(selected.baseYield*selected.price).toLocaleString()}/ha</div></div>
            </div>
            <div style={{ padding:'1rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:12,fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6 }}>
              <div style={{fontWeight:700,color:'var(--emerald)',marginBottom:'0.3rem',fontSize:'0.75rem'}}>💡 EXPERT TIP</div>
              {selected.tip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
