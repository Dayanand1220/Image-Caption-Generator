import React from 'react';
import './AboutPage.css';

const AboutPage = ({ onGetStarted }) => {
  return (
    <div className="about-page">
      <div className="about-bg-pattern"></div>
      
      <div className="about-card">
        <div className="about-title-row">
          <img src="/image.png" alt="AI Bot" className="about-logo" />
          <h1 className="about-title" style={{ color: 'white' }}>AI - CAPTION GENERATOR</h1>
        </div>
        
        <div className="about-body">
          <p style={{ color: 'white' }}>
            This full‑stack application features a hybrid AI core that combines a fast, local
            Deep Learning model for general captions with a scalable Generative AI API for
            specialized requests. The result is a system that balances performance and
            cost‑efficiency while giving you the flexibility to produce highly customized,
            platform‑aware captions.
          </p>
          <p style={{ color: 'white' }}>
            Upload an image, choose tone and length, target a platform, and optionally append
            smart hashtags. Generate production‑ready captions in seconds.
          </p>
        </div>
        
        <div className="about-button-row">
          <button className="about-button about-button-primary" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
