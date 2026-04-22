import React, { useEffect, useState } from 'react';

const floatingCrops = ['🌾', '🌽', '🍅', '🥭', '🍌', '☕', '🥥', '🍊'];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1rem 2rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>
      {/* Floating emoji ring */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
        <div style={{
          width: 90, height: 90,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
          border: '2px solid rgba(16,185,129,0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 0 40px rgba(16,185,129,0.25), inset 0 0 20px rgba(16,185,129,0.1)',
          animation: 'pulse-glow 3s ease-in-out infinite',
          margin: '0 auto',
        }}>🌿</div>
        {floatingCrops.map((crop, i) => {
          const angle = (i / floatingCrops.length) * 360;
          const rad = (angle * Math.PI) / 180;
          const r = 70;
          return (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))`,
              fontSize: '1.1rem',
              opacity: 0.6,
              animation: `float ${3 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
              pointerEvents: 'none',
            }}>{crop}</div>
          );
        })}
      </div>

      <div className="badge badge-green" style={{ marginBottom: '1rem', fontSize: '0.7rem' }}>
        🤖 AI-POWERED CROP INTELLIGENCE
      </div>

      <h1 className="heading-xl" style={{ marginBottom: '1rem' }}>
        Grow <span className="gradient-text">Smarter</span>,<br />
        Harvest <span className="gradient-text">Better</span>
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1.05rem',
        maxWidth: 540,
        margin: '0 auto 1.5rem',
        lineHeight: 1.7
      }}>
        Enter your soil and climate data to get AI-powered crop recommendations,
        yield predictions, and personalized farming advice.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { icon: '🌱', text: '22 Crops Supported' },
          { icon: '🎯', text: '95%+ Accuracy' },
          { icon: '⚡', text: 'Instant Results' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.82rem', color: 'var(--text-muted)',
          }}>
            <span>{f.icon}</span> {f.text}
          </div>
        ))}
      </div>
    </div>
  );
}
