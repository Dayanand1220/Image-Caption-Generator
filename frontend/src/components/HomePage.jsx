import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = ({ onGetStarted, onSignOut, theme, onToggleTheme, userName, userEmail, isLoggedIn }) => {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState('home');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavClick = (section) => {};
  const handleViewChange = (view) => setActiveView(view);
  const handleNavHover = (nav) => setHoveredNav(nav);
  const handleNavLeave = () => setHoveredNav(null);
  const handleGetStarted = () => {
    // This will be handled by the parent component to navigate to dashboard
    onGetStarted();
  };

  return (
    <div className="home-page">
      <div className="home-bg-overlay"></div>

      {/* Floating background elements */}
      <div className="floating-elements">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
        <div className="floating-orb floating-orb-3"></div>
        <div className="floating-orb floating-orb-4"></div>
      </div>

      {/* HEADER */}
      <header className="home-header">
        <div className="home-logo-section">
          <img
            src="/image.png"
            alt="AI Logo"
            className="home-logo"
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1) rotate(5deg)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1) rotate(0deg)')}
          />
          <div className="home-title">AI - Caption Generator</div>
        </div>

        <nav style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          animation: 'slideInDown 1s ease-out 0.2s both'
        }}>
          {['Home', 'About', 'Contact'].map((navItem) => (
            <a
              key={navItem}
              href={`#${navItem.toLowerCase()}`}
              onClick={() => handleViewChange(navItem.toLowerCase())}
              style={{
                color: 'var(--foreground)',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px 0',
                '&:hover': { color: 'var(--primary)', transform: 'translateY(-2px)' },
              }}
              onMouseEnter={() => setHoveredNav(navItem)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              {navItem}
            </a>
          ))}
        </nav>

        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          animation: 'slideInRight 1s ease-out 0.4s both'
        }}>
          <div style={{ position: 'relative' }}>
            <details>
              <summary
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '2px solid var(--border)',
                  background: 'var(--input)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  listStyle: 'none',
                  display: 'inline-block',
                  backdropFilter: 'blur(10px)'
                }}
              >
                👤 {userName} ▾
              </summary>
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  minWidth: '250px',
                  padding: '16px',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{userName}</div>
                  <div
                    style={{
                      fontWeight: '400',
                      fontSize: '12px',
                      color: 'var(--foreground)',
                      opacity: 0.7,
                      marginTop: '4px'
                    }}
                  >
                    {userEmail}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    background: 'var(--destructive)',
                    color: 'var(--foreground)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    padding: '8px 16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' }
                  }}
                >
                  Sign Out
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      {activeView === 'home' && (
        <main style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          padding: '60px',
          maxWidth: '1400px',
          margin: 'auto',
          position: 'relative',
          zIndex: 5,
          '@media (max-width: 1024px)': { gridTemplateColumns: '1fr', gap: '40px', padding: '40px' }
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '32px',
            animation: 'slideInLeft 1s ease-out 0.6s both'
          }}>
            <div
              style={{
                padding: '20px',
                background: 'var(--card)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <h1
                style={{
                  fontSize: '3.5rem',
                  fontWeight: '900',
                  lineHeight: '1.1',
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: 'var(--primary)', // Explicitly set to primary blue
                  // animation: 'titleGlow 2s ease-in-out infinite alternate',
                  '@media (max-width: 768px)': { fontSize: '2.5rem' }
                }}
              >
                AI Caption Generator
              </h1>
              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  textAlign: 'center',
                  marginBottom: '25px',
                  color: 'var(--foreground)',
                  opacity: 0.9,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.5px',
                  animation: 'fadeInUp 1s ease-out 0.8s both',
                  '@media (max-width: 768px)': { fontSize: '1rem' }
                }}
              >
                Transform Images into Engaging Captions
              </p>
              <div style={{ maxWidth: '550px', margin: '0 auto' }}>
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    opacity: 0.8,
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: 'var(--foreground)',
                    animation: 'fadeInUp 1s ease-out 1s both'
                  }}
                >
                  Our <b>AI-powered caption generator</b> analyzes your images and
                  creates compelling, platform-optimized captions that boost engagement.
                  Perfect for social media, marketing, and content creation.
                </p>
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    opacity: 0.8,
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: 'var(--foreground)',
                    animation: 'fadeInUp 1s ease-out 1.2s both'
                  }}
                >
                  Upload any image and get professional captions in seconds. Choose your
                  tone, target platform, and let AI do the rest.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <button 
                    style={{
                      padding: '20px 40px',
                      borderRadius: '15px',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      color: 'var(--foreground)',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-glow-primary)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'buttonPulse 2s ease-in-out infinite',
                      // Removed &:hover style as it will be handled by onMouseEnter/onMouseLeave
                    }}
                    onClick={handleGetStarted}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow-primary)';
                    }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            animation: 'slideInRight 1s ease-out 1s both'
          }}>
            <img
              src="/image.png"
              alt="AI process illustration"
              style={{
                width: '450px',
                height: '450px',
                borderRadius: '25px',
                boxShadow: 'var(--shadow-lg)',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                animation: 'imageFloat 4s ease-in-out infinite',
                '&:hover': { transform: 'scale(1.05)' }
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            />
          </div>
        </main>
      )}

      {/* ABOUT PAGE */}
      {activeView === 'about' && (
        <section
          style={{
            padding: '80px 60px',
            background: 'var(--card)',
            backdropFilter: 'blur(25px)',
            color: 'var(--foreground)',
            textAlign: 'center',
            animation: 'fadeInUp 1s ease-out both',
            '@media (max-width: 768px)': { padding: '40px 20px' }
          }}
        >
          <h2
            style={{
              fontSize: '2.8rem',
              fontWeight: '800',
              marginBottom: '40px',
              background: 'linear-gradient(135deg, var(--foreground) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              '@media (max-width: 768px)': { fontSize: '2rem' }
            }}
          >
            ABOUT THE PROJECT
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '40px',
              marginBottom: '60px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {[
              {
                title: 'Our Mission',
                desc: 'We aim to simplify creative storytelling by enabling AI to understand and describe visuals with emotional intelligence and contextual relevance.'
              },
              {
                title: 'Innovation in Action',
                desc: 'Harnessing the power of BLIP AI to generate human-like captions that blend technology with creativity.'
              },
              {
                title: 'AI Vision',
                desc: 'We believe in building AI systems that not only analyze data but understand emotions, tone, and human connection through visual intelligence.'
              },
              {
                title: 'Future Goals',
                desc: 'Expanding our model to support video captioning, multilingual description generation, and content accessibility for all users.'
              }
            ].map((box, i) => (
              <div
                key={i}
                style={{
                  flex: '1 1 400px',
                  background: 'var(--input)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animation: `fadeInUp 0.8s ease ${i * 0.2}s both`,
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: 'var(--shadow-glow-primary)' } // Keep for consistency but use handlers
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', fontWeight: '700', color: 'var(--primary)' }}>{box.title}</h3>
                <p style={{ opacity: 0.85, fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--foreground)' }}>{box.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT PAGE */}
      {activeView === 'contact' && (
        <section
          style={{
            padding: '80px 60px',
            background: 'var(--card)',
            backdropFilter: 'blur(25px)',
            color: 'var(--foreground)',
            textAlign: 'center',
            animation: 'fadeInUp 1s ease-out both',
            minHeight: '80vh',
            '@media (max-width: 768px)': { padding: '40px 20px' }
          }}
        >
          {/* Header Section */}
          <div style={{ marginBottom: '60px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '30px'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: 'var(--shadow-md)',
                  animation: 'logoFloat 3s ease-in-out infinite'
                }}
              >
                👥
              </div>
              <h2
                style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--foreground) 0%, var(--primary-glow) 50%, var(--secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px hsla(var(--primary), 0.3)',
                  '@media (max-width: 768px)': { fontSize: '2.2rem' }
                }}
              >
                OUR TEAM
              </h2>
            </div>
            <p
              style={{
                fontSize: '1.2rem',
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
                color: 'var(--foreground)'
              }}
            >
              Meet the brilliant minds behind the AI Caption Generator project
            </p>
          </div>

          {/* Team Members Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {[
              {
                usn: '4NI23IS253',
                name: 'Chandan Shridhar Hegde',
                email: '2023ec_chandanshridharhegde_a@nie.ac.in',
                // mobile: '7795226695',
                role: 'Core Developer',
                avatar: '🧑‍💻'
              },
              {
                usn: '4NI23IS252',
                name: 'Dayanand Shivanand Sagar',
                email: '2023ee_dayanandshivanandasagar_a@nie.ac.in',
                // mobile: '7760360888',
                role: 'Backend Engineer',
                avatar: '👨‍💻'
              },
              {
                usn: '4NI24IS408',
                name: 'Harsha S',
                email: '2024lis_harshas_b@nie.ac.in',
                // mobile: '7204793570',
                role: 'Frontend Developer',
                avatar: '👩‍💻'
              },
              {
                usn: '4NI24IS412',
                name: 'Mohammad Masood Hassan H A',
                email: '2024lis_mohammadmasoodhassanha_b@nie.ac.in',
                // mobile: '9113850326',
                role: 'AI Specialist',
                avatar: '🧑‍🔬'
              }
            ].map((member, i) => (
              <div
                key={i}
                style={{
                  flex: '1 1 400px',
                  background: 'var(--input)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animation: `fadeInUp 0.8s ease ${i * 0.2}s both`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: 'var(--shadow-glow-primary)' }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Background Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, hsla(var(--primary), 0.1) 0%, hsla(var(--secondary), 0.1) 100%)',
                    borderRadius: '25px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = 0;
                  }}
                />

                {/* Avatar */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '0 auto 20px',
                    boxShadow: 'var(--shadow-md)',
                    animation: 'logoFloat 3s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  {member.avatar}
                </div>

                {/* Member Info */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      marginBottom: '8px',
                      background: 'linear-gradient(135deg, var(--foreground) 0%, var(--primary-glow) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {member.name}
                  </h3>
                  
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--primary)',
                      marginBottom: '20px',
                      padding: '6px 16px',
                      background: 'hsla(var(--primary), 0.1)',
                      borderRadius: '20px',
                      border: '1px solid hsla(var(--primary), 0.3)',
                      display: 'inline-block'
                    }}
                  >
                    {member.role}
                  </div>

                  {/* Contact Details */}
                  <div style={{ textAlign: 'left', marginTop: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>📧</span>
                      <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{member.email}</span>
                    </div>
                    
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                        color: 'var(--foreground)'
                      }}
                    >
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>🆔</span>
                      <span style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '600' }}>{member.usn}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: '20px',
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      color: 'var(--foreground)',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      display: 'inline-block',
                      textDecoration: 'none',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div
            style={{
              marginTop: '60px',
              padding: '30px',
              background: 'var(--card)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '15px',
                background: 'linear-gradient(135deg, var(--foreground) 0%, var(--primary-glow) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              🤝 Let's Connect!
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.6, color: 'var(--foreground)' }}>
              We're passionate about AI and always excited to collaborate on innovative projects. 
              Feel free to reach out to any of our team members!
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
