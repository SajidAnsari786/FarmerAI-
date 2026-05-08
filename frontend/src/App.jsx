import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FarmerForm from './components/FarmerForm';
import ResultsPanel from './components/ResultsPanel';
import SoilHealthCard from './components/SoilHealthCard';
import StatsBar from './components/StatsBar';
import WeatherDashboard from './components/WeatherDashboard';
import CropEncyclopedia from './components/CropEncyclopedia';
import HistoryPanel from './components/HistoryPanel';
import MarketPrices from './components/MarketPrices';
import AIAdvisor from './components/AIAdvisor';

const API = 'http://localhost:8000';

export default function App() {
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null);
  const [yieldData, setYieldData]       = useState(null);
  const [soilHealth, setSoilHealth]     = useState(null);
  const [error, setError]               = useState('');
  const [currentPage, setCurrentPage]   = useState('home');
  const [showResults, setShowResults]   = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [history, setHistory]           = useState([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('farmer_ai_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) { /* ignore */ }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((input, predictions, yieldInfo, soil) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      input,
      topCrop: predictions?.recommendations?.[0]?.crop || 'Unknown',
      topConfidence: predictions?.recommendations?.[0]?.confidence || 0,
      soilScore: soil?.soil_health_score || 0,
      yieldPerHa: yieldInfo?.predicted_yield_quintals_per_hectare || 0,
      revenue: yieldInfo?.estimated_revenue_inr || 0,
      recommendations: predictions?.recommendations || [],
    };
    const updated = [entry, ...history].slice(0, 50); // keep last 50
    setHistory(updated);
    try {
      localStorage.setItem('farmer_ai_history', JSON.stringify(updated));
    } catch (e) { /* ignore */ }
  }, [history]);

  // Check backend health
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(data.crop_model && data.yield_model ? 'ready' : 'no-models');
        } else {
          setBackendStatus('error');
        }
      } catch {
        setBackendStatus('offline');
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError('');
    setResults(null);
    setYieldData(null);
    setSoilHealth(null);

    try {
      // 1. Crop Prediction
      let predData;
      try {
        const predRes = await fetch(`${API}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!predRes.ok) throw new Error('Backend error');
        predData = await predRes.json();
      } catch (e) {
        console.warn("Backend offline - Using Demo Mode data");
        // MOCK DATA for Demo Mode
        predData = {
          recommendations: [
            { crop: 'rice', confidence: 92.5, icon: '🌾', season: 'Kharif', market_price_per_quintal: 2300, tip: 'Ensure standing water 5-10cm during seedling stage.' },
            { crop: 'maize', confidence: 84.1, icon: '🌽', season: 'Kharif', market_price_per_quintal: 2225, tip: 'Plant at 20cm spacing for optimal yield.' },
            { crop: 'cotton', confidence: 76.8, icon: '☁️', season: 'Kharif', market_price_per_quintal: 7121, tip: 'Monitor for bollworm infestation regularly.' }
          ],
          soil_health_score: 85,
          soil_advice: ['Apply Urea at 65kg/acre', 'Soil is well-balanced']
        };
      }
      setResults(predData);

      let yData = null;
      let sData = null;

      // 2. Yield for top crop
      if (predData.recommendations?.length > 0) {
        const topCrop = predData.recommendations[0].crop;
        try {
          const yieldRes = await fetch(`${API}/yield`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, crop: topCrop }),
          });
          if (yieldRes.ok) {
            yData = await yieldRes.json();
          } else {
            throw new Error();
          }
        } catch (e) {
          yData = {
            predicted_yield_quintals_per_hectare: 45.2,
            total_yield_quintals: 45.2 * (formData.farm_area || 1),
            estimated_revenue_inr: 45.2 * (formData.farm_area || 1) * 2300,
            market_price_per_quintal: 2300
          };
        }
        setYieldData(yData);
      }

      // 3. Soil Health
      try {
        const soilRes = await fetch(`${API}/soil-health`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (soilRes.ok) {
          sData = await soilRes.json();
        } else {
          throw new Error();
        }
      } catch (e) {
        sData = {
          soil_health_score: 85,
          grade: 'Excellent',
          color: 'green',
          nutrient_levels: {
            nitrogen: { value: formData.N, status: 'optimal' },
            phosphorus: { value: formData.P, status: 'optimal' },
            potassium: { value: formData.K, status: 'optimal' },
            ph: { value: formData.ph, status: 'optimal' }
          },
          recommendations: ['Soil is in great condition.']
        };
      }
      setSoilHealth(sData);

      // Save to history
      saveToHistory(formData, predData, yData, sData);
      setShowResults(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setYieldData(null);
    setSoilHealth(null);
    setError('');
    setShowResults(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('farmer_ai_history');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page !== 'home') {
      setShowResults(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'advisor':
        return <AIAdvisor apiBase={API} />;

      case 'weather':
        return <WeatherDashboard apiBase={API} />;

      case 'market':
        return <MarketPrices apiBase={API} />;

      case 'crops':
        return <CropEncyclopedia />;

      case 'history':
        return (
          <HistoryPanel
            history={history}
            onClear={handleClearHistory}
            onNavigatePredict={() => navigateTo('home')}
          />
        );

      case 'home':
      default:
        if (showResults && results) {
          return (
            <ResultsPanel
              results={results}
              yieldData={yieldData}
              soilHealth={soilHealth}
              onBack={handleReset}
            />
          );
        }
        return (
          <>
            <HeroSection />
            <StatsBar />
            <div style={{ marginTop: '2.5rem' }}>
              <FarmerForm onSubmit={handlePredict} loading={loading} apiBase={API} />
              {error && (
                <div style={{
                  marginTop: '1rem', padding: '1rem 1.25rem',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 10, color: '#f87171', fontSize: '0.9rem'
                }}>
                  ⚠️ {error}. Make sure the backend is running (<code>python main.py</code>).
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="bg-scene" />
      <div className="bg-grid" />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          backendStatus={backendStatus}
          historyCount={history.length}
        />

        <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 1.5rem 4rem' }}>
          {renderPage()}
        </main>

        <footer style={{
          borderTop: '1px solid rgba(16,185,129,0.12)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-faint)',
          fontSize: '0.82rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            Farmer AI — Empowering every farmer with intelligent crop analytics&nbsp;|&nbsp;Built for Indian Agriculture
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem' }}>
            {['home:Predict','advisor:AI Advisor','weather:Weather','market:Market','crops:Crop Guide','history:History'].map((item,i) => {
              const [id, label] = item.split(':');
              return <span key={i} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigateTo(id)} onMouseEnter={e=>e.target.style.color='#10b981'} onMouseLeave={e=>e.target.style.color='var(--text-faint)'}>{label}</span>;
            })}
          </div>
        </footer>
      </div>
    </>
  );
}
