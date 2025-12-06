import { useState } from 'react';
import axios from 'axios';
import RegisterPage from './RegisterPage.jsx';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
    const API_BASE_URL = 'http://localhost:5123';

    const [view, setView] = useState('login'); 
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const [resetData, setResetData] = useState({ 
        user_id: null, 
        question: '', 
        new_password: '', 
        confirm_new_password: '' 
    });

    const handleResetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setSecurityAnswer('');
        setMessage('');
        setMessageType('');
        setIsProcessing(false);
        setResetData({ user_id: null, question: '', new_password: '', confirm_new_password: '' });
    };

    const showMessage = (msg, type = '') => {
        setMessage(msg);
        setMessageType(type);
    };

    const callApiWithRetry = async (method, url, data, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await axios({ method, url, data });
            } catch (error) {
                if (i === retries - 1) throw error; 
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        showMessage('Signing In...', 'processing');
        
        try {
            const payload = { username, password };
            const response = await callApiWithRetry('post', `${API_BASE_URL}/api/auth/login`, payload);
            
            showMessage(response.data.message, 'success');
            if (response.status === 200 && typeof onLoginSuccess === 'function') {
                setTimeout(() => {
                    onLoginSuccess({
                        username: response.data.username,
                        email: response.data.email
                    });
                }, 1000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Network error occurred.';
            showMessage(errorMessage, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGetQuestion = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        showMessage('Searching for account...', 'processing');
        
        try {
            const response = await callApiWithRetry('post', `${API_BASE_URL}/api/auth/get_security_question`, { email });
            
            setResetData({
                ...resetData,
                user_id: response.data.user_id,
                question: response.data.question
            });
            setView('forgot_challenge');
            showMessage('Please answer your security question below.', 'success');
        } catch (error) {
            showMessage(error.response?.data?.message || 'Account not found.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleResetFinal = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (resetData.new_password !== resetData.confirm_new_password) {
            showMessage("New passwords do not match.", 'error');
            setIsProcessing(false);
            return;
        }

        showMessage('Verifying answer and resetting password...', 'processing');
        
        try {
            const payload = {
                user_id: resetData.user_id,
                answer: securityAnswer,
                new_password: resetData.new_password,
                confirm_password: resetData.confirm_new_password
            };
            const response = await callApiWithRetry('post', `${API_BASE_URL}/api/auth/reset_password_challenge`, payload);

            showMessage(response.data.message, 'success');
            setTimeout(() => {
                setView('login');
                handleResetForm();
            }, 2000);
        } catch (error) {
            showMessage(error.response?.data?.message || 'Reset failed. Please check your answer.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const getFormTitle = () => {
        switch(view) {
            case 'login': return 'Welcome Back';
            case 'register': return 'Create Account';
            case 'forgot_email': return 'Reset Password';
            case 'forgot_challenge': return 'Security Challenge';
            default: return 'Authentication';
        }
    };

    const renderLoginContent = () => {
        if (view === 'forgot_email') {
            return (
                <form onSubmit={handleGetQuestion}>
                    <div className="input-group">
                        <span className="icon">📧</span>
                        <input 
                            type="email" 
                            className="input"
                            placeholder="Enter your email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`button-primary ${isProcessing ? 'processing' : ''}`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Searching...' : 'Find Account'}
                    </button>
                    <button 
                        type="button" 
                        className="link-button"
                        onClick={() => { handleResetForm(); setView('login'); }}
                        disabled={isProcessing}
                    >
                        ← Back to Login
                    </button>
                </form>
            );
        } else if (view === 'forgot_challenge') {
            return (
                <form onSubmit={handleResetFinal}>
                    <div className="security-question-box">
                        <strong>Security Question:</strong>
                        <p>{resetData.question}</p>
                    </div>
                    
                    <div className="input-group">
                        <span className="icon">🔑</span>
                        <input 
                            type="text" 
                            className="input"
                            placeholder="Your secret answer" 
                            value={securityAnswer} 
                            onChange={(e) => setSecurityAnswer(e.target.value)} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    
                    <div className="input-group">
                        <span className="icon">🔒</span>
                        <input 
                            type="password" 
                            className="input"
                            placeholder="New password" 
                            value={resetData.new_password} 
                            onChange={(e) => setResetData({ ...resetData, new_password: e.target.value })} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    
                    <div className="input-group">
                        <span className="icon">🔒</span>
                        <input 
                            type="password" 
                            className="input"
                            placeholder="Confirm new password" 
                            value={resetData.confirm_new_password} 
                            onChange={(e) => setResetData({ ...resetData, confirm_new_password: e.target.value })} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`button-primary ${isProcessing ? 'processing' : ''}`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <button 
                        type="button" 
                        className="link-button"
                        onClick={() => { handleResetForm(); setView('login'); }}
                        disabled={isProcessing}
                    >
                        ← Back to Login
                    </button>
                </form>
            );
        } else {
            return (
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <span className="icon">👤</span>
                        <input 
                            type="text" 
                            className="input"
                            placeholder="Username or Email" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            disabled={isProcessing}
                        />
                    </div>
                    
                    <div className="input-group password-wrapper">
                        <span className="icon">🔒</span>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            className="input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isProcessing}
                        />
                        <button 
                            type="button" 
                            className="visibility-toggle"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            disabled={isProcessing}
                        >
                            {passwordVisible ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <button 
                        type="button" 
                        className="forgot-password-link"
                        onClick={() => { handleResetForm(); setView('forgot_email'); }}
                        disabled={isProcessing}
                    >
                        Forgot Password?
                    </button>
                    
                    <button 
                        type="submit" 
                        className={`button-primary ${isProcessing ? 'processing' : ''}`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                </form>
            );
        }
    };
    
    const isRegisterView = view === 'register';

    return (
        <div className="auth-split-container">
            <div>
                {/* Left Panel */}
                <div className="left-panel">
                    <div className="diagonal-overlay"></div>
                    
                    <img 
                        src="/image.png"
                        alt="AI Caption Generator"
                        style={{ width: '100px', height: '100px', borderRadius: '20px', marginBottom: '24px' }}
                    />
                    
                    <h2>AI Caption Generator</h2>
                    <p>Transform your images into engaging captions with the power of AI</p>

                    <div className="content-tabs">
                        <button 
                            className={`auth-tab ${!isRegisterView ? 'active' : ''}`}
                            onClick={() => { handleResetForm(); setView('login'); }}
                            disabled={isProcessing}
                        >
                            LOGIN
                        </button>
                        <button 
                            className={`auth-tab ${isRegisterView ? 'active' : ''}`}
                            onClick={() => { handleResetForm(); setView('register'); }}
                            disabled={isProcessing}
                        >
                            SIGN UP
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <div className="logo-container">
                        <img
                            src="/image.png"
                            alt="Logo"
                            style={{ width: '80px', height: '80px', borderRadius: '16px' }}
                        />
                    </div>

                    <h2 className="heading">{getFormTitle()}</h2>

                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
                        </div>
                    )}

                    {isRegisterView ? (
                        <RegisterPage 
                            showMessage={showMessage}
                            setIsProcessing={setIsProcessing}
                            isProcessing={isProcessing}
                            onRegistrationSuccess={() => {
                                setTimeout(() => {
                                    setView('login');
                                    handleResetForm();
                                }, 2000);
                            }}
                        />
                    ) : (
                        renderLoginContent()
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
