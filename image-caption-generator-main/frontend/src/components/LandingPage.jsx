import React from 'react';

const container = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)',
  color: '#fff'
};

const nav = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 28px',
  maxWidth: '1100px',
  width: '100%',
  margin: '0 auto'
};

const logoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: 800,
  letterSpacing: '0.5px'
};

const pill = {
  display: 'inline-block',
  padding: '10px 16px',
  background: '#f59e0b',
  color: '#111827',
  borderRadius: '10px',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none'
};

const hero = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '24px',
  alignItems: 'center',
  maxWidth: '1100px',
  width: '100%',
  margin: '30px auto',
  padding: '0 28px'
};

const h1 = {
  fontSize: '44px',
  lineHeight: 1.1,
  fontWeight: 900,
  marginBottom: '16px'
};

const sub = {
  opacity: 0.9,
  lineHeight: 1.7
};

const ctas = {
  marginTop: '22px',
  display: 'flex',
  gap: '12px'
};

const outline = {
  padding: '10px 16px',
  background: 'transparent',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600
};

const screen = {
  background: '#0b1220',
  borderRadius: '18px',
  padding: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
};

const codeLine = (w, c) => ({
  height: '10px',
  width: w,
  background: c,
  borderRadius: '6px'
});

const LandingPage = ({ onExplore, onStart }) => {
  return (
    <div style={container}>
      <nav style={nav}>
        <div style={logoRow}>
          <img src="/chat-bot.png" alt="Logo" style={{ width: 32, height: 32 }} />
          <span>AI Captioning</span>
        </div>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <a href="#about" style={{ color: '#c7d2fe', textDecoration: 'none' }}>About</a>
          <a href="#news" style={{ color: '#c7d2fe', textDecoration: 'none' }}>News</a>
          <span style={{ ...pill, background: '#f59e0b' }}>Projects</span>
          <a href="#contact" style={{ color: '#c7d2fe', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      <section style={hero}>
        <div>
          <h1 style={h1}>Frontend Website Development</h1>
          <p style={sub}>
            Build beautiful, responsive UIs powered by our AI captioning engine. 
            Upload images, generate platform‑ready captions, and integrate seamlessly.
          </p>
          <div style={ctas}>
            <button style={pill} onClick={onExplore}>Explore</button>
            <button style={{ ...pill, background: '#10b981', color: '#062b1f' }} onClick={onStart}>Start</button>
          </div>
        </div>
        <div style={screen}>
          <div style={{ background: '#0e162a', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={codeLine('80%', '#60a5fa')} />
              <div style={codeLine('65%', '#34d399')} />
              <div style={codeLine('72%', '#f59e0b')} />
              <div style={codeLine('55%', '#c084fc')} />
              <div style={codeLine('70%', '#f472b6')} />
              <div style={codeLine('62%', '#93c5fd')} />
              <div style={codeLine('58%', '#86efac')} />
            </div>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', opacity: 0.7, padding: '16px' }}>
        JavaScript • HTML • CSS
      </div>
    </div>
  );
};

export default LandingPage;


