import React, { useEffect, useState } from 'react';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginTop: '1rem',
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        filter: 'brightness(0.45)',
      }} />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(4,10,6,0.6) 0%, rgba(4,10,6,0.85) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: '4rem 1.5rem 3.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 0.8rem', borderRadius: 999,
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
          fontSize: '0.7rem', fontWeight: 600, color: '#10b981',
          letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#10b981',
            boxShadow: '0 0 8px #10b981',
          }} />
          AI-POWERED CROP INTELLIGENCE
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          color: '#fff',
        }}>
          Grow <span style={{
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Smarter</span>,<br />
          Harvest <span style={{
            background: 'linear-gradient(135deg, #f59e0b, #10b981)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Better</span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: '1rem',
          maxWidth: 520,
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          Enter your soil and climate data to get AI-powered crop recommendations,
          yield predictions, and personalized farming advice across India.
        </p>

        {/* Metric Strip */}
        <div style={{
          display: 'inline-flex', gap: '0', borderRadius: 12,
          overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
        }}>
          {[
            { value: '48', label: 'Crops' },
            { value: '88%', label: 'Accuracy' },
            { value: '5.4K', label: 'Data Points' },
            { value: '97.8%', label: 'R² Score' },
          ].map((f, i, arr) => (
            <div key={i} style={{
              padding: '0.9rem 1.5rem',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '1.3rem', fontWeight: 800, color: '#10b981',
                fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>{f.value}</div>
              <div style={{
                fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontWeight: 600, marginTop: '0.25rem',
              }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
