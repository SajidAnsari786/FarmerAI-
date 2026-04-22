import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FarmerForm from './components/FarmerForm';
import ResultsPanel from './components/ResultsPanel';
import SoilHealthCard from './components/SoilHealthCard';
import StatsBar from './components/StatsBar';

const API = 'http://localhost:8000';

export default function App() {
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null);
  const [yieldData, setYieldData]       = useState(null);
  const [soilHealth, setSoilHealth]     = useState(null);
  const [error, setError]               = useState('');
  const [activeView, setActiveView]     = useState('form'); // 'form' | 'results'

  const handlePredict = async (formData) => {
    setLoading(true);
    setError('');
    setResults(null);
    setYieldData(null);
    setSoilHealth(null);

    try {
      // 1. Crop Prediction
      const predRes = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!predRes.ok) {
        const err = await predRes.json();
        throw new Error(err.detail || 'Prediction failed');
      }
      const predData = await predRes.json();
      setResults(predData);

      // 2. Yield for top crop
      if (predData.recommendations?.length > 0) {
        const topCrop = predData.recommendations[0].crop;
        const yieldRes = await fetch(`${API}/yield`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, crop: topCrop }),
        });
        if (yieldRes.ok) {
          const yData = await yieldRes.json();
          setYieldData(yData);
        }
      }

      // 3. Soil Health
      const soilRes = await fetch(`${API}/soil-health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (soilRes.ok) {
        const sData = await soilRes.json();
        setSoilHealth(sData);
      }

      setActiveView('results');
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
    setActiveView('form');
  };

  return (
    <>
      <div className="bg-scene" />
      <div className="bg-grid" />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 1.5rem 4rem' }}>
          {activeView === 'form' ? (
            <>
              <HeroSection />
              <StatsBar />
              <div style={{ marginTop: '2.5rem' }}>
                <FarmerForm onSubmit={handlePredict} loading={loading} />
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
          ) : (
            <ResultsPanel
              results={results}
              yieldData={yieldData}
              soilHealth={soilHealth}
              onBack={handleReset}
            />
          )}
        </main>

        <footer style={{
          borderTop: '1px solid rgba(16,185,129,0.12)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-faint)',
          fontSize: '0.82rem'
        }}>
          🌾 Farmer AI — Empowering every farmer with AI intelligence &nbsp;|&nbsp; Built with ❤️ for Agriculture
        </footer>
      </div>
    </>
  );
}
