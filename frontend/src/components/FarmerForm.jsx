import React, { useState } from 'react';

const API = 'http://localhost:8000';
const SEASONS    = ['Kharif', 'Rabi', 'Zaid'];
const SOIL_TYPES = ['Sandy', 'Loamy', 'Clayey'];

const FIELD_GROUPS = [
  {
    title: '🧪 Soil Nutrients (kg/ha)',
    subtitle: 'Enter the NPK values from your soil test report',
    fields: [
      { name: 'N', label: 'Nitrogen (N)', placeholder: '0 – 200', tip: 'Primary nutrient for leaf & stem growth', unit: 'kg/ha', min: 0, max: 200 },
      { name: 'P', label: 'Phosphorus (P)', placeholder: '0 – 200', tip: 'Promotes root growth and flowering', unit: 'kg/ha', min: 0, max: 200 },
      { name: 'K', label: 'Potassium (K)', placeholder: '0 – 300', tip: 'Strengthens stems and disease resistance', unit: 'kg/ha', min: 0, max: 300 },
    ]
  },
  {
    title: '🌡️ Climate Conditions',
    subtitle: 'Average values for your region — or use Weather Auto-Fill',
    fields: [
      { name: 'temperature', label: 'Temperature', placeholder: '-10 – 60', tip: 'Average temperature during growing season', unit: '°C', min: -10, max: 60, step: 0.1 },
      { name: 'humidity', label: 'Humidity', placeholder: '0 – 100', tip: 'Relative humidity percentage', unit: '%', min: 0, max: 100, step: 0.1 },
      { name: 'rainfall', label: 'Annual Rainfall', placeholder: '0 – 500', tip: 'Total annual rainfall or irrigation equivalent', unit: 'mm', min: 0, max: 500, step: 1 },
    ]
  },
  {
    title: '🌱 Soil Properties',
    subtitle: 'Soil pH and type classification',
    fields: [
      { name: 'ph', label: 'Soil pH', placeholder: '0 – 14', tip: '7 is neutral; <7 acidic; >7 alkaline', unit: 'pH', min: 0, max: 14, step: 0.1 },
    ]
  }
];

function Tooltip({ text }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        title={text}
        style={{
          width: 16, height: 16,
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.2)',
          border: '1px solid rgba(16,185,129,0.4)',
          color: '#10b981',
          fontSize: '0.65rem',
          fontWeight: 700,
          cursor: 'help',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, lineHeight: 1, padding: 0,
        }}
      >?</button>
    </span>
  );
}

export default function FarmerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
    season: 'Kharif', soil_type: 'Loamy', farm_area: '1', city: '',
  });
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const set = (name, val) => setForm(prev => ({ ...prev, [name]: val }));
  const handleChange = e => set(e.target.name, e.target.value);

  const fetchWeather = async () => {
    if (!form.city.trim()) {
      alert('Please enter a city name');
      return;
    }
    setWeatherLoading(true);
    try {
      const res = await fetch(`${API}/weather?city=${encodeURIComponent(form.city)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Weather API error');
      }
      const data = await res.json();
      setWeatherData(data);
      setForm(prev => ({
        ...prev,
        temperature: String(data.temperature),
        humidity: String(data.humidity),
        rainfall: String(data.rainfall || 100),
      }));
    } catch (e) {
      alert('Weather fetch failed: ' + e.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fillExample = () => {
    setForm({
      N: '80', P: '45', K: '40', temperature: '22', humidity: '82',
      ph: '6.8', rainfall: '230', season: 'Kharif', soil_type: 'Clayey',
      farm_area: '2', city: '',
    });
    setWeatherData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { season, soil_type, farm_area, city, ...numeric } = form;
    for (const [k, v] of Object.entries(numeric)) {
      if (v === '' || isNaN(parseFloat(v))) {
        alert(`Please enter a valid value for "${k}"`);
        return;
      }
    }
    onSubmit({
      N: parseFloat(form.N), P: parseFloat(form.P), K: parseFloat(form.K),
      temperature: parseFloat(form.temperature), humidity: parseFloat(form.humidity),
      ph: parseFloat(form.ph), rainfall: parseFloat(form.rainfall),
      season, soil_type, farm_area: parseFloat(farm_area) || 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass anim-fade" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="heading-md" style={{ marginBottom: '0.25rem' }}>📋 Farm Details</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Provide your soil test report and local climate data for accurate predictions
          </p>
        </div>
        <button type="button" onClick={fillExample} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
          🧪 Load Example
        </button>
      </div>

      {/* Weather Auto-Fill */}
      <div className="glass-flat" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem' }}>
          🌤️ Weather Auto-Fill
          <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
            (enter city to auto-fill temperature, humidity, rainfall)
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label className="lbl">City Name</label>
            <input
              type="text" name="city" value={form.city}
              onChange={handleChange} className="inp"
              placeholder="e.g. Mumbai, Delhi, Lucknow"
            />
          </div>
          <button
            type="button" onClick={fetchWeather} disabled={weatherLoading}
            className="btn-secondary"
            style={{ height: 44, padding: '0 1.25rem', whiteSpace: 'nowrap' }}
          >
            {weatherLoading ? (
              <span className="anim-spin" style={{
                width: 16, height: 16, border: '2px solid rgba(16,185,129,0.3)',
                borderTopColor: '#10b981', borderRadius: '50%', display: 'inline-block',
              }} />
            ) : '🌤️'} {weatherLoading ? 'Fetching...' : 'Auto-Fill'}
          </button>
        </div>
        {weatherData && (
          <div style={{
            marginTop: '0.75rem', padding: '0.625rem 0.875rem',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8, display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
            fontSize: '0.8rem', color: 'var(--text-muted)',
          }}>
            <span>🏙️ {weatherData.city}</span>
            <span>🌡️ {weatherData.temperature}°C</span>
            <span>💧 {weatherData.humidity}%</span>
            <span>🌬️ {weatherData.wind_speed} m/s</span>
            <span>☁️ {weatherData.description}</span>
          </div>
        )}
      </div>

      {/* Season + Soil Type + Farm Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label className="lbl">Growing Season</label>
          <select name="season" value={form.season} onChange={handleChange} className="inp">
            {SEASONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl">Soil Type</label>
          <select name="soil_type" value={form.soil_type} onChange={handleChange} className="inp">
            {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl">Farm Area (hectares)</label>
          <input
            type="number" name="farm_area" value={form.farm_area}
            onChange={handleChange} className="inp"
            placeholder="e.g. 2.5" min="0.1" step="0.1"
          />
        </div>
      </div>

      {/* Field groups */}
      {FIELD_GROUPS.map((group, gi) => (
        <div key={gi} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{group.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{group.subtitle}</div>
          </div>
          <div className="divider" style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {group.fields.map(field => (
              <div key={field.name}>
                <label className="lbl" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {field.label}
                  <Tooltip text={field.tip} />
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number" name={field.name}
                    value={form[field.name]} onChange={handleChange}
                    className="inp" placeholder={field.placeholder}
                    min={field.min} max={field.max} step={field.step || 1}
                    style={{ paddingRight: '3rem' }}
                  />
                  <span style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.7rem', color: 'var(--text-faint)',
                    fontWeight: 600, pointerEvents: 'none'
                  }}>{field.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick hints */}
      <div style={{
        background: 'rgba(16,185,129,0.05)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 10, padding: '0.875rem 1.125rem',
        marginBottom: '1.75rem', fontSize: '0.8rem', color: 'var(--text-muted)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem'
      }}>
        <span>💡 Optimal pH: 6.0 – 7.5</span>
        <span>💡 Good Humidity: &gt; 60%</span>
        <span>💡 Balanced N: 60 – 120 kg/ha</span>
      </div>

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
        {loading ? (
          <>
            <span className="anim-spin" style={{
              width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block'
            }} />
            Analyzing your farm data...
          </>
        ) : (
          <>🚀 Get AI Crop Recommendations</>
        )}
      </button>
    </form>
  );
}
