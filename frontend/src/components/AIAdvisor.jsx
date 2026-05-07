import React, { useState, useRef, useEffect } from 'react';

const QUICK_QUESTIONS = [
  "How to grow rice?",
  "Best fertilizer for wheat?",
  "When should I irrigate potato?",
  "How to control aphids?",
  "What season is good for maize?",
  "How to prevent fungal disease?",
  "Tell me about organic farming",
  "How to improve soil pH?",
  "Best crop for sandy soil?",
  "Market price tips",
];

function renderMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('- '))
        return <li key={i} style={{ marginLeft: '1rem', marginBottom: '0.25rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{parseBold(line.slice(2))}</li>;
      if (line === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '0.3rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{parseBold(line)}</p>;
    });
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{p}</strong> : p
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem', animation: 'fadeIn 0.3s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', marginRight: '0.6rem', marginTop: '0.1rem',
          boxShadow: '0 0 12px rgba(16,185,129,0.4)',
        }}>🌾</div>
      )}
      <div style={{
        maxWidth: '82%',
        padding: '0.9rem 1.15rem',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #10b981, #059669)'
          : 'rgba(16,185,129,0.07)',
        border: isUser ? 'none' : '1px solid rgba(16,185,129,0.2)',
        color: isUser ? '#fff' : 'var(--text-main)',
        fontSize: '0.9rem',
        lineHeight: 1.65,
      }}>
        {isUser ? (
          <span>{msg.content}</span>
        ) : (
          <div>
            {msg.answers?.map((ans, ai) => (
              <div key={ai} style={{
                paddingBottom: ai < msg.answers.length - 1 ? '0.875rem' : 0,
                borderBottom: ai < msg.answers.length - 1 ? '1px solid rgba(16,185,129,0.12)' : 'none',
                marginBottom: ai < msg.answers.length - 1 ? '0.875rem' : 0,
              }}>
                {renderMarkdown(ans)}
              </div>
            ))}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {msg.suggestions.map((s, si) => (
                  <span key={si} style={{
                    padding: '0.2rem 0.5rem', borderRadius: 999,
                    border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: '0.7rem', color: 'var(--emerald)',
                    cursor: 'pointer', background: 'rgba(16,185,129,0.05)',
                  }}
                    onClick={() => msg.onSuggest && msg.onSuggest(s)}
                  >💬 {s}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', marginLeft: '0.6rem', marginTop: '0.1rem',
        }}>👨‍🌾</div>
      )}
    </div>
  );
}

export default function AIAdvisor({ apiBase }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    answers: ["👋 **Namaste! Welcome to Farmer AI Advisor!**\n\nI'm your expert agricultural assistant powered by deep agronomic knowledge. I can help with:\n\n- 🌾 **Crop advice** — growing tips for 48+ Indian crops\n- 💧 **Irrigation** — scheduling and water management\n- 🧪 **Fertilizers** — NPK recommendations & application schedules\n- 🐛 **Pest & Disease** — identification, prevention & treatment\n- 🌱 **Soil Health** — pH correction, nutrient management\n- 📅 **Crop Calendar** — best sowing and harvest times\n- 🌤️ **Weather Advisory** — climate-smart farming tips\n- 💰 **Market & Finance** — MSP, subsidies, selling tips\n- 🌿 **Organic Farming** — natural methods & biofertilizers\n\nJust type your question! For example:\n*'How to grow rice?'* or *'Best fertilizer for wheat?'*"],
    suggestions: ["How to grow rice?", "Best fertilizer for wheat?", "When to sow potato?", "Tell me about organic farming"],
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ crop: '', N: '', P: '', K: '', ph: '', temperature: '', humidity: '', rainfall: '' });
  const [showContext, setShowContext] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const ask = async (question) => {
    if (!question.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const body = {
        question,
        crop: context.crop || undefined,
        N: context.N ? parseFloat(context.N) : undefined,
        P: context.P ? parseFloat(context.P) : undefined,
        K: context.K ? parseFloat(context.K) : undefined,
        ph: context.ph ? parseFloat(context.ph) : undefined,
        temperature: context.temperature ? parseFloat(context.temperature) : undefined,
        humidity: context.humidity ? parseFloat(context.humidity) : undefined,
        rainfall: context.rainfall ? parseFloat(context.rainfall) : undefined,
      };
      const res = await fetch(`${apiBase}/ai-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        answers: data.answers,
        suggestions: data.suggestions || [],
        onSuggest: (s) => ask(s),
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', answers: ['⚠️ Could not reach advisor. Make sure the backend is running on port 8000.'] }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="anim-fade" style={{ paddingTop: '1rem', maxWidth: 900, margin: '0 auto' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', marginBottom: '1.5rem',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/advisor-bg.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(4,10,6,0.4) 0%, rgba(4,10,6,0.9) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '3rem 1.5rem 2.5rem',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.7rem', borderRadius: 999,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            fontSize: '0.68rem', fontWeight: 600, color: '#10b981',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            INTELLIGENT AI ADVISOR
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff',
          }}>
            Farming <span style={{
              background: 'linear-gradient(135deg, #10b981, #f59e0b)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Expert Assistant</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', maxWidth: 480, margin: '0 auto' }}>
            Ask any farming question — get expert advice on 48+ crops, irrigation, fertilizers, pests, soil health & more
          </p>
        </div>
      </div>

      {/* Farm Context Panel */}
      <div className="glass" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setShowContext(!showContext)}
          style={{ background: 'none', border: 'none', color: 'var(--emerald)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}
        >
          🌾 {showContext ? '▾' : '▸'} Farm Context (optional — provides personalized advice)
        </button>
        {showContext && (
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { key: 'crop', label: 'Crop', placeholder: 'e.g. rice' },
              { key: 'N', label: 'Nitrogen (N)', placeholder: 'kg/ha' },
              { key: 'P', label: 'Phosphorus (P)', placeholder: 'kg/ha' },
              { key: 'K', label: 'Potassium (K)', placeholder: 'kg/ha' },
              { key: 'ph', label: 'Soil pH', placeholder: '0-14' },
              { key: 'temperature', label: 'Temperature', placeholder: '°C' },
              { key: 'humidity', label: 'Humidity', placeholder: '%' },
              { key: 'rainfall', label: 'Rainfall', placeholder: 'mm' },
            ].map(f => (
              <div key={f.key}>
                <label className="lbl">{f.label}</label>
                <input
                  type={f.key === 'crop' ? 'text' : 'number'}
                  value={context[f.key]} onChange={e => setContext(p => ({ ...p, [f.key]: e.target.value }))}
                  className="inp" placeholder={f.placeholder} style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1rem', minHeight: 400, maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg, i) => <Message key={i} msg={{...msg, onSuggest: (s) => ask(s)}} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌾</div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Thinking...</span>
              {[0, 0.15, 0.3].map((d, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: `pulse-dot 1.2s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.875rem' }}>
        {QUICK_QUESTIONS.map((q, i) => (
          <button key={i} onClick={() => ask(q)} disabled={loading}
            style={{
              padding: '0.35rem 0.75rem', borderRadius: 999,
              border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--emerald)'; e.target.style.color = 'var(--emerald)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
          >💬 {q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="glass" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          ref={inputRef}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && ask(input)}
          className="inp" placeholder="Ask anything about farming... (e.g. How to grow tomato? Best NPK for rice?)"
          style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '0.9rem' }}
          disabled={loading}
        />
        <button onClick={() => ask(input)} disabled={loading || !input.trim()} className="btn-primary"
          style={{ padding: '0.65rem 1.5rem', flexShrink: 0 }}>
          {loading ? <span className="anim-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> : '➤ Send'}
        </button>
      </div>

      {/* Info footer */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
        📊 Trained on 5,430+ data points across 48 Indian crops • Knowledge base covers irrigation, fertilizers, pests, soil, weather & market
      </div>
    </div>
  );
}
