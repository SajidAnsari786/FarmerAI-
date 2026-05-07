import React, { useState, useEffect } from 'react';

const FARMING_WEATHER_TIPS = {
  hot:   { icon: '🌡️', title: 'Hot Weather Advisory', tips: ['Irrigate early morning or late evening to minimize evaporation', 'Apply mulch to conserve soil moisture', 'Consider shade nets for sensitive crops', 'Monitor for heat stress in standing crops'] },
  cold:  { icon: '❄️', title: 'Cold Weather Advisory', tips: ['Cover seedlings with polythene tunnels', 'Avoid irrigation during frost-prone hours (midnight to dawn)', 'Apply potash to improve frost tolerance', 'Delay sowing if severe frost is expected'] },
  rainy: { icon: '🌧️', title: 'Rainy Weather Advisory', tips: ['Ensure proper field drainage to prevent waterlogging', 'Delay fertilizer application until rain subsides', 'Watch for fungal disease outbreaks', 'Harvest mature crops immediately to prevent damage'] },
  dry:   { icon: '☀️', title: 'Dry Weather Advisory', tips: ['Use drip irrigation for water efficiency', 'Plant drought-tolerant varieties', 'Increase organic mulch layer to 4-6 inches', 'Consider rainwater harvesting for future use'] },
  humid: { icon: '💧', title: 'High Humidity Advisory', tips: ['Increase spacing between plants for air circulation', 'Apply preventive fungicide sprays', 'Avoid overhead irrigation—use drip instead', 'Monitor for pest buildup in humid conditions'] },
  mild:  { icon: '🌿', title: 'Ideal Growing Conditions', tips: ['Great time for sowing new crops', 'Apply balanced NPK fertilizers', 'Perform weeding and intercultural operations', 'Good conditions for transplanting seedlings'] },
};

function getWeatherAdvice(temp, humidity, description) {
  const desc = (description || '').toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('thunderstorm')) return FARMING_WEATHER_TIPS.rainy;
  if (temp > 38) return FARMING_WEATHER_TIPS.hot;
  if (temp < 10) return FARMING_WEATHER_TIPS.cold;
  if (humidity > 85) return FARMING_WEATHER_TIPS.humid;
  if (humidity < 30) return FARMING_WEATHER_TIPS.dry;
  return FARMING_WEATHER_TIPS.mild;
}

function WeatherMetricCard({ icon, label, value, unit, color, delay }) {
  return (
    <div className="stat-card anim-fade" style={{
      textAlign: 'center', padding: '1.25rem 1rem',
      animationDelay: `${delay}s`, opacity: 0,
    }}>
      <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{icon}</div>
      <div style={{
        fontFamily: 'Outfit,sans-serif', fontWeight: 800,
        fontSize: '1.5rem', color, lineHeight: 1, marginBottom: '0.2rem',
      }}>
        {value}<span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}

function SeasonIndicator({ temp }) {
  let season, color, icon;
  if (temp >= 30) { season = 'Summer / Zaid'; color = '#f59e0b'; icon = '☀️'; }
  else if (temp >= 20) { season = 'Kharif Season'; color = '#10b981'; icon = '🌿'; }
  else if (temp >= 10) { season = 'Rabi Season'; color = '#3b82f6'; icon = '❄️'; }
  else { season = 'Winter'; color = '#8b5cf6'; icon = '🌨️'; }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.5rem 1rem', borderRadius: 999,
      background: `${color}15`, border: `1px solid ${color}30`,
      fontSize: '0.82rem', fontWeight: 600, color,
    }}>
      {icon} Recommended: {season}
    </div>
  );
}

export default function WeatherDashboard({ apiBase }) {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState({});
  const [locLoading, setLocLoading] = useState(true);

  // Fetch India locations
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/india-locations`);
        if (res.ok) {
          const data = await res.json();
          setLocations(data.states || {});
        }
      } catch { /* fallback */ }
      finally { setLocLoading(false); }
    })();
  }, [apiBase]);

  const stateNames = Object.keys(locations).sort();
  const cityNames = state ? (locations[state] || []) : [];

  const fetchWeather = async (cityName) => {
    const query = (cityName || city || customCity).trim();
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const [res, fRes] = await Promise.all([
        fetch(`${apiBase}/weather?city=${encodeURIComponent(query)}`),
        fetch(`${apiBase}/weather/forecast?city=${encodeURIComponent(query)}`),
      ]);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Weather API error');
      }
      const data = await res.json();
      setWeather(data);
      if (fRes.ok) {
        const fData = await fRes.json();
        setForecast(fData.forecast || []);
      }
    } catch (e) {
      setError(e.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchWeather(customCity);
    }
  };

  const advice = weather ? getWeatherAdvice(weather.temperature, weather.humidity, weather.description) : null;

  return (
    <div className="anim-fade" style={{ paddingTop: '1rem' }}>
      {/* Hero Banner with Background Image */}
      <div style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', marginBottom: '1.5rem',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/weather-bg.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
          filter: 'brightness(0.4)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,10,6,0.3) 0%, rgba(4,10,6,0.8) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '3.5rem 1.5rem 3rem',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.7rem', borderRadius: 999,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            fontSize: '0.68rem', fontWeight: 600, color: '#60a5fa',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 6px #60a5fa' }} />
            LIVE WEATHER DATA
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff',
          }}>
            Weather <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Intelligence</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto' }}>
            Get real-time weather data and AI-powered farming recommendations for any location in India
          </p>
        </div>
      </div>

      {/* Search - State/City based */}
      <div className="glass" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📍 Select Location
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label className="lbl">State / UT</label>
            {locLoading ? (
              <div className="inp" style={{ color: 'var(--text-faint)' }}>Loading...</div>
            ) : (
              <select value={state} onChange={e => { setState(e.target.value); setCity(''); }} className="inp">
                <option value="">— Select State —</option>
                {stateNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="lbl">City / District</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="inp" disabled={!state}>
              <option value="">— Select City —</option>
              {cityNames.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => fetchWeather(city)}
            disabled={loading || !city}
            className="btn-primary"
            style={{ height: 44, padding: '0 1.5rem', whiteSpace: 'nowrap' }}
          >
            {loading ? (
              <span className="anim-spin" style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
              }} />
            ) : '🔍'} {loading ? 'Searching...' : 'Get Weather'}
          </button>
        </div>

        {/* Or search manually */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>Or type any city name directly:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
            <input
              type="text" value={customCity} onChange={e => setCustomCity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="inp" placeholder="e.g. Mumbai, Delhi, Lucknow, Shimla..."
            />
            <button
              onClick={() => fetchWeather(customCity)}
              disabled={loading || !customCity.trim()}
              className="btn-secondary"
              style={{ height: 44, padding: '0 1.25rem', whiteSpace: 'nowrap' }}
            >
              🌍 Search
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '1rem', padding: '0.75rem 1rem',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 8, color: '#f87171', fontSize: '0.85rem',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Weather Results */}
      {weather && (
        <div className="anim-fade">
          {/* City header */}
          <div className="glass" style={{
            padding: '2rem', marginBottom: '1.5rem', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {weather.description?.includes('cloud') ? '☁️' :
               weather.description?.includes('rain') ? '🌧️' :
               weather.description?.includes('clear') ? '☀️' :
               weather.description?.includes('snow') ? '🌨️' :
               weather.description?.includes('mist') || weather.description?.includes('fog') ? '🌫️' :
               weather.description?.includes('thunder') ? '⛈️' : '🌤️'}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: '0.25rem' }}>
              {weather.city}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              {weather.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <SeasonIndicator temp={weather.temperature} />
              <div style={{
                padding: '0.5rem 1rem', borderRadius: 999,
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                fontSize: '0.78rem', fontWeight: 600, color: '#3b82f6',
              }}>
                📡 {weather.source}
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <WeatherMetricCard icon="🌡️" label="Temperature" value={weather.temperature} unit="°C" color="#ef4444" delay={0.1} />
            <WeatherMetricCard icon="🤒" label="Feels Like" value={weather.feels_like} unit="°C" color="#f97316" delay={0.15} />
            <WeatherMetricCard icon="💧" label="Humidity" value={weather.humidity} unit="%" color="#3b82f6" delay={0.2} />
            <WeatherMetricCard icon="🌬️" label="Wind Speed" value={weather.wind_speed} unit=" m/s" color="#06b6d4" delay={0.25} />
            <WeatherMetricCard icon="📊" label="Pressure" value={weather.pressure} unit=" hPa" color="#8b5cf6" delay={0.3} />
            <WeatherMetricCard icon="🌧️" label="Rainfall (1h)" value={weather.rainfall || 0} unit=" mm" color="#10b981" delay={0.35} />
          </div>

          {/* 5-Day Forecast */}
          {forecast && forecast.length > 0 && (
            <div className="glass anim-fade" style={{ padding: '1.75rem', marginBottom: '1.5rem', animationDelay: '0.35s', opacity: 0 }}>
              <h3 className="heading-md" style={{ marginBottom: '1rem' }}>📅 5-Day Forecast</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {forecast.map((day, i) => {
                  const dateObj = new Date(day.date + 'T12:00:00');
                  const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
                  const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                  const weatherEmoji =
                    day.description?.includes('rain') || day.description?.includes('drizzle') ? '🌧️' :
                    day.description?.includes('thunder') ? '⛈️' :
                    day.description?.includes('snow') ? '🌨️' :
                    day.description?.includes('cloud') ? '☁️' :
                    day.description?.includes('fog') || day.description?.includes('mist') ? '🌫️' : '☀️';
                  return (
                    <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '1rem 0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: i === 0 ? 'var(--emerald)' : 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dayName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>{dateStr}</div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{weatherEmoji}</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#ef4444' }}>{day.temp_max}°</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#3b82f6' }}>{day.temp_min}°</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginTop: '0.4rem', textTransform: 'capitalize', lineHeight: 1.3 }}>{day.description}</div>
                      {day.rainfall > 0 && (
                        <div style={{ fontSize: '0.68rem', color: '#60a5fa', marginTop: '0.3rem' }}>💧 {Math.round(day.rainfall)}mm</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Farming advice */}
          {advice && (
            <div className="glass anim-fade" style={{ padding: '1.75rem', animationDelay: '0.4s', opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{advice.icon}</span>
                <h3 className="heading-md">{advice.title}</h3>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.625rem',
              }}>
                {advice.tips.map((tip, i) => (
                  <div key={i} style={{
                    padding: '0.875rem 1rem',
                    background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 10,
                    fontSize: '0.83rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.55,
                    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!weather && !loading && !error && (
        <div className="glass" style={{
          padding: '4rem 2rem', textAlign: 'center',
          background: 'rgba(16,185,129,0.03)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🌍</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>
            Select a state & city or search any location for live weather
          </p>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem' }}>
            Weather data powers auto-fill for accurate crop predictions
          </p>
        </div>
      )}
    </div>
  );
}
