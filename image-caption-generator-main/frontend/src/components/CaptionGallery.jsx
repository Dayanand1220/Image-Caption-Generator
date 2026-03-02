import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CaptionGallery.css';

const CaptionGallery = ({ userId }) => {
    const [captions, setCaptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const API_BASE_URL = 'http://localhost:5123';

    // Fetch user captions
    const fetchCaptions = async () => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/caption/user_captions/${userId}`);
            if (response.data.status === 'success') {
                setCaptions(response.data.captions);
            }
        } catch (error) {
            console.error('Error fetching captions:', error);
            showMessage('Failed to load captions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaptions();
    }, [userId]);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // Delete caption
    const handleDelete = async (captionId) => {
        if (!window.confirm('Are you sure you want to delete this caption?')) {
            return;
        }

        try {
            const response = await axios.delete(`${API_BASE_URL}/api/caption/caption/${captionId}`);
            if (response.data.status === 'success') {
                showMessage('Caption deleted successfully!', 'success');
                // Remove from local state
                setCaptions(captions.filter(cap => cap._id !== captionId));
            }
        } catch (error) {
            console.error('Error deleting caption:', error);
            showMessage('Failed to delete caption', 'error');
        }
    };

    // Copy caption to clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showMessage('Caption copied to clipboard!', 'success');
    };

    if (loading) {
        return (
            <div className="gallery-loading">
                <div className="gallery-spinner"></div>
                <p>Loading your captions...</p>
            </div>
        );
    }

    return (
        <div className="caption-gallery">
            <div className="gallery-header">
                <h2 className="gallery-title">Your Captions</h2>
                <button className="gallery-refresh-btn" onClick={fetchCaptions}>
                    🔄 Refresh
                </button>
            </div>

            {message.text && (
                <div className={`gallery-message gallery-message-${message.type}`}>
                    {message.text}
                </div>
            )}

            {captions.length === 0 ? (
                <div className="gallery-empty">
                    <div className="gallery-empty-icon">📝</div>
                    <p>No captions yet. Start by uploading an image!</p>
                </div>
            ) : (
                <div className="gallery-grid">
                    {captions.map((caption) => (
                        <div key={caption._id} className="gallery-card">
                            {caption.image_url && (
                                <div className="gallery-image-container">
                                    <img 
                                        src={caption.image_url} 
                                        alt="Caption" 
                                        className="gallery-image"
                                    />
                                </div>
                            )}
                            
                            <div className="gallery-card-content">
                                <div className="gallery-meta">
                                    <span className="gallery-platform">{caption.platform || 'General'}</span>
                                    <span className="gallery-model">{caption.model_used || 'AI'}</span>
                                </div>
                                
                                <p className="gallery-caption-text">{caption.caption}</p>
                                
                                <div className="gallery-details">
                                    <span className="gallery-detail">Tone: {caption.tone}</span>
                                    <span className="gallery-detail">Length: {caption.length}</span>
                                </div>
                                
                                <div className="gallery-date">
                                    {new Date(caption.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                
                                <div className="gallery-actions">
                                    <button 
                                        className="gallery-action-btn gallery-copy-btn"
                                        onClick={() => handleCopy(caption.caption)}
                                        title="Copy caption"
                                    >
                                        📋 Copy
                                    </button>
                                    <button 
                                        className="gallery-action-btn gallery-delete-btn"
                                        onClick={() => handleDelete(caption._id)}
                                        title="Delete caption"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CaptionGallery;
