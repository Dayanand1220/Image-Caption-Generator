import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '32px 16px',
  background: 'var(--background)',
  color: 'var(--foreground)',
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  overflow: 'hidden',
  position: 'relative'
};

const backgroundPattern = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(circle at 20% 80%, hsla(var(--primary), 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, hsla(var(--secondary), 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, hsla(var(--accent), 0.04) 0%, transparent 50%)
  `,
  animation: 'none'
};

const topBarStyle = {
  width: '100%',
  maxWidth: '1000px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '30px',
  position: 'relative',
  zIndex: 10
};

const iconButton = {
  padding: '10px 18px',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '500',
  color: 'var(--foreground)',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

const headerContentStyle = {
  textAlign: 'center',
  marginBottom: '40px',
  position: 'relative',
  zIndex: 5
};

const titleStyle = {
  fontSize: '42px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  marginBottom: '10px',
  color: '#ffffff',
  textShadow: 'none'
};

const subtitleStyle = {
  fontSize: '18px',
  color: 'var(--foreground)',
  opacity: 0.8,
  fontWeight: '400',
  maxWidth: '600px',
  margin: '0 auto'
};

const actionButtonStyle = {
  padding: '14px 28px',
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  color: 'var(--foreground)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-md)',
  marginTop: '25px',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-lg)' }
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  width: '100%',
  maxWidth: '1000px',
  marginBottom: '40px',
  position: 'relative',
  zIndex: 5
};

const statCardStyle = {
  background: 'var(--card)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: 'var(--shadow-md)',
  textAlign: 'center',
  border: '1px solid var(--border)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': { transform: 'translateY(-5px)', boxShadow: 'var(--shadow-lg)' }
};

const statValueStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: 'var(--primary)',
  marginBottom: '5px'
};

const statLabelStyle = {
  fontSize: '14px',
  color: 'var(--foreground)',
  opacity: 0.7,
  fontWeight: '500'
};

const platformsTabStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px',
  width: '100%',
  maxWidth: '1000px',
  position: 'relative',
  zIndex: 5
};

const platformButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  color: 'var(--foreground)',
  opacity: 0.7,
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': { color: 'var(--primary)', opacity: 1 }
};

const platformButtonActiveStyle = {
  color: 'var(--primary)',
  opacity: 1,
  borderBottom: '2px solid var(--primary)'
};

const captionListStyle = {
  width: '100%',
  maxWidth: '1000px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
  position: 'relative',
  zIndex: 5
};

const captionCardStyle = {
  background: 'var(--card)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: 'var(--shadow-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  border: '1px solid var(--border)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': { transform: 'translateY(-5px)', boxShadow: 'var(--shadow-lg)' }
};

const captionTextStyle = {
  fontSize: '15px',
  color: 'var(--foreground)',
  lineHeight: '1.6'
};

const captionMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: 'var(--foreground)',
  opacity: 0.7,
  borderTop: '1px solid var(--border)',
  paddingTop: '10px'
};

const captionActionsStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const actionButtonStyleSmall = {
  padding: '8px 15px',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  background: 'var(--input)',
  color: 'var(--foreground)',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)',
  '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
};

const deleteButtonStyleSmall = {
  background: 'var(--destructive)',
  color: 'var(--foreground)',
  border: '1px solid var(--destructive)',
  '&:hover': { background: 'hsla(var(--destructive), 0.8)', borderColor: 'hsla(var(--destructive), 0.8)' }
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '50px 20px',
  background: 'var(--card)',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-md)',
  color: 'var(--foreground)',
  maxWidth: '800px',
  margin: '20px auto'
};

const DashboardPage = ({ onBackToHome, onSignOut, userName = 'User', onNavigateToUploader }) => {
  const API_BASE_URL = 'http://localhost:5123';
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePlatform, setActivePlatform] = useState('all'); // 'all', 'instagram', 'facebook', etc.

  const fetchCaptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/caption/user_captions/${userName}`);
      const fetchedCaptions = response.data.captions.map(caption => ({
        ...caption,
        id: caption._id, // Map MongoDB's _id to id for frontend usage
        createdAt: new Date(caption.createdAt).toLocaleString()
      }));
      setCaptions(fetchedCaptions);
    } catch (err) {
      console.error('Error fetching captions:', err);
      setError('Failed to load captions. Please try again later.');
      setCaptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptions();
  }, [userName]);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Caption copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text:', err);
      alert('Failed to copy caption.');
    });
  };

  const handleDeleteCaption = async (captionId) => {
    if (window.confirm('Are you sure you want to delete this caption?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/caption/caption/${captionId}`);
        alert('Caption deleted successfully!');
        fetchCaptions(); // Refresh the list
      } catch (err) {
        console.error('Error deleting caption:', err);
        alert('Failed to delete caption.');
      }
    }
  };

  const filteredCaptions = activePlatform === 'all'
    ? captions
    : captions.filter(c => c.platform.toLowerCase() === activePlatform);

  // Calculate stats
  const totalCaptions = captions.length;
  const uniquePlatforms = new Set(captions.map(c => c.platform)).size;
  const longestCaptionLength = captions.reduce((max, c) => Math.max(max, c.caption.length), 0);

  return (
    <div style={pageStyle}>
      <div style={backgroundPattern}></div>

      <div style={topBarStyle}>
        <button 
          style={iconButton} 
          onClick={onBackToHome}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          ← Back to Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <details>
              <summary style={{ ...iconButton, listStyle: 'none', display: 'inline-block' }}>
                👤 {userName} ▾
              </summary>
              <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  marginTop: '8px', 
                  background: 'var(--card)', 
                  color: 'var(--foreground)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  boxShadow: 'var(--shadow-md)', 
                  minWidth: '200px', 
                  padding: '16px',
                  backdropFilter: 'blur(10px)'
              }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: '12px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{userName}</div>
                  <div style={{ fontWeight: '400', fontSize: '12px', color: 'var(--foreground)', opacity: 0.7, marginTop: '4px' }}>Signed in</div>
                </div>
                <button 
                  onClick={onSignOut} 
                  style={{ 
                    ...iconButton, 
                    width: '100%', 
                    marginTop: '8px', 
                    background: 'var(--destructive)', 
                    color: 'var(--foreground)', 
                    border: 'none',
                    '&:hover': { background: 'hsla(var(--destructive), 0.8)' }
                  }}
                >
                  Sign out
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div style={headerContentStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
          <img 
            src="/chat-bot.png" // Placeholder, replace with your actual logo image
            alt="Dashboard Logo"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div style={titleStyle}>Caption Dashboard</div>
        </div>
        <p style={subtitleStyle}>Manage and review your AI-generated captions.</p>
        <button 
          style={actionButtonStyle} 
          onClick={onNavigateToUploader}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; // Added scale transform
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-lg)'; // Enhanced shadow
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          ✨ Generate New Caption
        </button>
      </div>

      <div style={statsGridStyle}>
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={statValueStyle}>{totalCaptions}</div>
          <div style={statLabelStyle}>Total Captions</div>
        </div>
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={statValueStyle}>{uniquePlatforms}</div>
          <div style={statLabelStyle}>Unique Platforms</div>
        </div>
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={statValueStyle}>{longestCaptionLength}</div>
          <div style={statLabelStyle}>Longest Caption Chars</div>
        </div>
      </div>

      <div style={platformsTabStyle}>
        {[ 'all', 'instagram', 'twitter', 'facebook', 'linkedin', 'general' ].map(platform => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            style={activePlatform === platform ? 
              { ...platformButtonStyle, ...platformButtonActiveStyle } : 
              platformButtonStyle
            }
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--primary)';
              e.target.style.opacity = 1;
            }}
            onMouseLeave={(e) => {
              if (activePlatform !== platform) {
                e.target.style.color = 'var(--foreground)';
                e.target.style.opacity = 0.7;
              }
            }}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div style={emptyStateStyle}>
          <p>Loading captions...</p>
        </div>
      )}

      {error && !loading && (
        <div style={emptyStateStyle}>
          <p style={{ color: 'var(--destructive)' }}>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && filteredCaptions.length === 0 && (
        <div style={emptyStateStyle}>
          <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            No captions yet! 🤷‍♀️
          </p>
          <p style={{ fontSize: '16px', color: 'var(--foreground)', opacity: 0.8 }}>
            Generate your first caption to see it here.
          </p>
          <button 
            style={{ ...actionButtonStyle, marginTop: '30px', width: 'auto' }} 
            onClick={onNavigateToUploader}
          >
            Start Generating Captions ✨
          </button>
        </div>
      )}

      {!loading && !error && filteredCaptions.length > 0 && (
        <div style={captionListStyle}>
          {filteredCaptions.map(caption => (
            <div 
              key={caption.id} 
              style={captionCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <p style={captionTextStyle}>{caption.caption}</p>
              <div style={captionMetaStyle}>
                <span>Platform: {caption.platform}</span>
                {/* <span>Generated: {caption.createdAt}</span> */}
              </div>
              <div style={captionActionsStyle}>
                <button 
                  style={actionButtonStyleSmall} 
                  onClick={() => handleCopyToClipboard(caption.caption)}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.color = 'var(--foreground)';
                  }}
                >
                  Copy
                </button>
                <button 
                  style={{ 
                    ...actionButtonStyleSmall,
                    ...deleteButtonStyleSmall
                  }} 
                  onClick={() => handleDeleteCaption(caption.id)}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'hsla(0, 84%, 60%, 0.8)';
                    e.target.style.borderColor = 'hsla(0, 84%, 60%, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--destructive)';
                    e.target.style.borderColor = 'var(--destructive)';
                  }}
                >
                  Delete
                </button>
              </div>
              {caption.image_url && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <img 
                    src={caption.image_url} 
                    alt="Caption Source"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
