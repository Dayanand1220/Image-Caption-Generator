import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import './ImageUploaderPage.css';

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
    radial-gradient(circle at 15% 85%, hsla(var(--primary), 0.07) 0%, transparent 50%),
    radial-gradient(circle at 85% 15%, hsla(var(--destructive), 0.07) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, hsla(var(--accent), 0.05) 0%, transparent 50%)
  `,
  animation: 'none' 
};

const floatingElementsStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  pointerEvents: 'none'
};

const floatingElement = (delay, size, color) => ({
  position: 'absolute',
  width: size,
  height: size,
  background: color,
  borderRadius: '50%',
  opacity: 0.04, /* Even more subtle opacity */
  animation: 'none' /* Removed animation */
});

const heroStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginBottom: '30px', 
  animation: 'none' 
};

const titleStyle = {
  fontSize: '42px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  marginTop: '15px',
  color: '#ffffff',
  textShadow: 'none', 
  animation: 'none' 
};

const logoStyle = {
  width: '100px', 
  height: '100px',
  objectFit: 'contain',
  borderRadius: '15px',
  boxShadow: 'var(--shadow-sm)',
  animation: 'none' 
};

const panelStyle = {
  width: '100%',
  maxWidth: '1000px', 
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px', 
  position: 'relative',
  zIndex: 5,
  '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
};

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '25px',
  boxShadow: 'var(--shadow-md)',
  color: 'var(--foreground)',
  transition: 'all 0.2s ease',
  animation: 'none',
  '&:hover': { transform: 'translateY(-5px)', boxShadow: 'var(--shadow-lg)' }
};

const topBarStyle = {
  width: '100%',
  maxWidth: '1000px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '30px', 
  position: 'relative',
  zIndex: 10,
  animation: 'none' 
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

const sectionTitleStyle = {
  fontSize: '18px', 
  fontWeight: '600',
  marginBottom: '12px', 
  color: 'var(--primary)',
  WebkitBackgroundClip: 'unset',
  WebkitTextFillColor: 'unset',
  backgroundClip: 'unset',
  textShadow: 'none'
};

const selectStyle = {
  width: '100%',
  padding: '10px 14px', 
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--input)', 
  color: 'var(--foreground)',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)',
  '&:focus': { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px hsla(var(--primary), 0.3)' }
};

const toggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px', 
  marginTop: '10px',
  padding: '6px 0'
};

const uploaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '250px', 
  border: '2px dashed var(--primary)',
  background: 'hsla(var(--primary), 0.1)',
  color: 'var(--primary)',
  borderRadius: '12px',
  cursor: 'pointer',
  padding: '15px', 
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': { background: 'hsla(var(--primary), 0.2)', boxShadow: 'var(--shadow-md)' }
};

const previewStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid var(--primary)',
  height: '250px',
  background: 'var(--input)',
  boxShadow: 'var(--shadow-md)',
  animation: 'none' 
};

const removeButton = {
  position: 'absolute', 
  top: '10px', 
  right: '10px', 
  background: 'var(--destructive)', 
  color: 'var(--foreground)', 
  border: 'none', 
  borderRadius: '50%', 
  width: '30px', 
  height: '30px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  cursor: 'pointer', 
  fontSize: '18px', 
  fontWeight: 'bold',
  boxShadow: 'var(--shadow-sm)',
  transition: 'background-color 0.2s ease',
  '&:hover': { background: 'hsla(var(--destructive), 0.8)' }
};

const buttonStyle = {
  marginTop: '15px', 
  padding: '14px 22px', 
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  color: 'var(--foreground)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-md)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-lg)' }
};

const copyButtonStyle = {
  background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
  boxShadow: 'var(--shadow-md)',
  '&:hover': { background: 'linear-gradient(135deg, hsla(var(--secondary), 0.8) 0%, hsla(var(--primary), 0.8) 100%)' }
};

const outputStyle = {
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  color: 'var(--foreground)',
  fontSize: '15px',
  padding: '18px', 
  background: 'var(--input)',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  minHeight: '100px', 
  animation: 'none' 
};

const errorStyle = {
  marginTop: '16px', 
  color: 'var(--destructive)',
  fontSize: '14px',
  padding: '10px',
  background: 'hsla(var(--destructive), 0.1)',
  borderRadius: '8px',
  border: '1px solid var(--destructive)',
  animation: 'none' 
};

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml'
];

function buildHashtagsFromCaption(caption) {
  try {
    const words = caption
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter(w => w.length > 3)
      .slice(0, 6);
    const tags = Array.from(new Set(words)).map(w => `#${w}`);
    return tags.length ? `\n\n${tags.join(' ')}` : '';
  } catch {
    return '';
  }
}

// Removed theme and onToggleTheme props
const ImageUploaderPage = ({ onBackToHome, onSignOut, userName = 'User' }) => {

  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('medium'); // Set default to 'medium'
  const [platform, setPlatform] = useState('instagram'); // Set default to 'instagram' for initial Gemini model
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [aiModel, setAiModel] = useState('gemini'); // State for AI model selection

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');

  const dropLabel = useMemo(() => (
    isDragging ? 'Drop the image here' : 'Drag & drop an image here, or click to browse'
  ), [isDragging]);

  const onPickFile = useCallback((picked) => {
    if (!picked) return;
    const chosen = Array.isArray(picked) ? picked[0] : picked;
    if (!chosen) return;
    if (!SUPPORTED_IMAGE_TYPES.includes(chosen.type)) {
      setError('Unsupported file type. Please select an image.');
      return;
    }
    setError('');
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
  }, []);

  const onInputChange = useCallback((e) => {
    onPickFile(e.target.files && e.target.files[0]);
  }, [onPickFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      onPickFile(e.dataTransfer.files[0]);
    }
  }, [onPickFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setFile(null);
    setPreviewUrl('');
    setCaption('');
    setError('');
  }, []);

  const handleCopyCaption = useCallback(async () => {
    if (caption) {
      try {
        await navigator.clipboard.writeText(caption);
        alert('Caption copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy caption:', err);
        alert('Failed to copy caption. Please try again manually.');
      }
    }
  }, [caption]);

  const handleGenerate = useCallback(async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }
    setIsGenerating(true);
    setError('');
    setCaption('');

    console.log(`Sending to backend: AI Model = ${aiModel}, Platform = ${platform}, Tone = ${tone}, Length = ${length}`);

    try {
      const form = new FormData();
      form.append('image', file);
      // Send extra preferences for backend support
      form.append('tone', tone);
      form.append('length', length); // LENGTH PREFERENCE IS SENT HERE
      form.append('platform', platform);
      form.append('ai_model', aiModel);
      form.append('includeHashtags', includeHashtags); // Send hashtag preference to backend
      form.append('user_id', userName); // Assuming userName is a unique identifier for the user

      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5123';
      const response = await axios.post(`${apiUrl}/api/caption/generate`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let text = response?.data?.caption || '';
      // For BLIP model, add hashtags client-side if requested
      if (includeHashtags && aiModel === 'blip') {
        text += buildHashtagsFromCaption(text);
      }
      setCaption(text || '');

    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to generate caption.';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [file, tone, length, platform, includeHashtags, aiModel, userName]);

  const handleAiModelChange = useCallback((e) => {
    const newAiModel = e.target.value;
    setAiModel(newAiModel);
    // Adjust platform selection based on the chosen AI model
    if (newAiModel === 'blip') {
      // BLIP model doesn't support platform-specific prompting, so default to 'general'
      setPlatform('general');
      setTone('casual'); // Set tone to casual when BLIP is selected
    } else if (newAiModel === 'gemini') {
      // If switching to Gemini and platform was 'general' (from BLIP), set a more relevant default
      if (platform === 'general') {
        setPlatform('instagram');
      }
    }
  }, [platform]);

  // Determine if the platform selection should be disabled
  const isPlatformDisabled = aiModel === 'blip';
  const isToneDisabled = aiModel === 'blip'; // Disable tone selection for BLIP


  return (
    <div style={pageStyle}>
      <div style={backgroundPattern}></div>
      
      {/* Floating background elements */}
      <div style={floatingElementsStyle}>
        <div style={floatingElement(0, '80px', 'hsla(var(--primary), 0.6)')}></div>
        <div style={floatingElement(1, '60px', 'hsla(var(--secondary), 0.6)')}></div>
        <div style={floatingElement(2, '100px', 'hsla(var(--accent), 0.6)')}></div>
        <div style={floatingElement(0.5, '40px', 'hsla(var(--primary-glow), 0.6)')}></div>
        <div style={floatingElement(1.5, '70px', 'hsla(var(--foreground), 0.3)')}></div>
      </div>

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
      
      <div style={heroStyle}>
        <img src="/chat-bot.png" alt="AI Bot" style={logoStyle} />
        <div style={titleStyle}>AI -Caption Generator</div>
      </div>

      <div style={panelStyle}>
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={sectionTitleStyle}>📸 Image Upload</div>
          {previewUrl ? (
            <div style={previewStyle}>
              <img 
                src={previewUrl} 
                alt="preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  borderRadius: '10px', 
                  boxShadow: 'var(--shadow-sm)'
                }} 
              />
              <button 
                onClick={handleRemovePhoto} 
                style={removeButton}
                onMouseEnter={(e) => e.target.style.background = 'hsla(var(--destructive), 0.8)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--destructive)'} 
              >
                ×
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-input"
              style={{
                ...uploaderStyle,
                borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
                background: isDragging ? 'hsla(var(--primary), 0.1)' : 'var(--input)',
                boxShadow: isDragging ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: 'var(--primary)' }}>
                  {isDragging ? '🎯 Drop the image here!' : '📁 Drag & drop an image here'}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '10px', color: 'var(--foreground)' }}>
                  or click to browse files
                </div>
                <div style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.7, marginTop: '6px' }}>
                  JPG, PNG, WEBP, GIF, BMP, TIFF, SVG
                </div>
              </div>
              <input id="image-input" type="file" accept="image/*" onChange={onInputChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={sectionTitleStyle}>⚙️ Preferences</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Tone</div>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)} 
                style={{ ...selectStyle, opacity: isToneDisabled ? 0.6 : 1 }}
                disabled={isToneDisabled} // Disable if BLIP is selected
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px hsla(var(--primary), 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <option value="casual">😊 Casual</option>
                <option value="professional" disabled={isToneDisabled}>💼 Professional</option>
                <option value="creative" disabled={isToneDisabled}>🎨 Creative</option>
                <option value="funny" disabled={isToneDisabled}>😂 Funny</option>
              </select>
              {isToneDisabled && (
                <div style={{ fontSize: '11px', color: 'var(--foreground)', opacity: 0.6, marginTop: '4px' }}>
                  (Tone only applies to Gemini)
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Length</div>
              <select 
                value={length} 
                onChange={(e) => setLength(e.target.value)} 
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px hsla(var(--primary), 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <option value="short">📝 Short (1-2 sentences)</option>
                <option value="medium">📄 Medium (2-3 sentences)</option>
                <option value="long">📖 Long (3-5 sentences)</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>Platform</div>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)} 
                style={{ ...selectStyle, opacity: isPlatformDisabled ? 0.6 : 1 }}
                disabled={isPlatformDisabled} // Disable if BLIP is selected
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px hsla(var(--primary), 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <option value="general">🌐 General</option>
                <option value="instagram" disabled={isPlatformDisabled}>📸 Instagram</option>
                <option value="twitter" disabled={isPlatformDisabled}>🐦 Twitter</option>
                <option value="facebook" disabled={isPlatformDisabled}>📘 Facebook</option>
                <option value="linkedin" disabled={isPlatformDisabled}>💼 LinkedIn</option>
              </select>
              {isPlatformDisabled && (
                <div style={{ fontSize: '11px', color: 'var(--foreground)', opacity: 0.6, marginTop: '4px' }}>
                  (Platform only applies to Gemini)
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>AI Model</div>
              <select 
                value={aiModel} 
                onChange={handleAiModelChange} /* Use the new handler */
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px hsla(var(--primary), 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <option value="gemini">✨ Gemini API</option>
                <option value="blip">🧠 BLIP Model</option>
              </select>
            </div>

            <div style={toggleRowStyle}>
              <input 
                id="hashtags-toggle" 
                type="checkbox" 
                checked={includeHashtags} 
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                style={{
                  width: '18px', 
                  height: '18px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="hashtags-toggle" style={{ userSelect: 'none', fontSize: '14px', color: 'var(--foreground)' }}>
                # Include hashtags
              </label>
            </div>
          </div>

          <button 
            style={buttonStyle} 
            onClick={handleGenerate} 
            disabled={isGenerating}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }
            }}
          >
            {isGenerating ? '🔄 Generating...' : '✨ Generate Caption'}
          </button>

          {caption && (
            <button 
              style={{ 
                ...buttonStyle, 
                ...copyButtonStyle,
                marginTop: '10px',
                '&:hover': { background: 'linear-gradient(135deg, hsla(var(--secondary), 0.8) 0%, hsla(var(--primary), 0.8) 100%)' }
              }} 
              onClick={handleCopyCaption} 
              disabled={!caption}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              📋 Copy Caption
            </button>
          )}

          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}
        </div>

        <div 
          style={{ 
            ...cardStyle, 
            gridColumn: '1 / span 2',
            '@media (max-width: 768px)': { gridColumn: '1 / span 1' }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={sectionTitleStyle}>📝 Generated Caption</div>
          <div style={outputStyle}>
            {caption || 'Your AI-generated caption will appear here... 🚀'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderPage;