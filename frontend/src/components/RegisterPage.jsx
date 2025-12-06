import { useState } from 'react';
import axios from 'axios';

const RegisterPage = ({ showMessage, setIsProcessing, isProcessing, onRegistrationSuccess }) => {
    const API_BASE_URL = 'http://localhost:5123';
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [securityQuestion, setSecurityQuestion] = useState('What is your mother\'s maiden name?');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", 'error');
            setIsProcessing(false);
            return;
        }

        showMessage('Creating Account...', 'processing');
        
        try {
            const payload = { 
                username, 
                email, 
                password, 
                confirm_password: confirmPassword, 
                security_question: securityQuestion, 
                security_answer: securityAnswer 
            };
            const response = await callApiWithRetry('post', `${API_BASE_URL}/api/auth/register`, payload);
            
            showMessage(response.data.message, 'success');
            if (response.status === 201) {
                onRegistrationSuccess();
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Network error occurred.';
            showMessage(errorMessage, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <div className="input-group">
                <span className="icon">👤</span>
                <input 
                    type="text" 
                    className="input"
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    disabled={isProcessing}
                />
            </div>
            
            <div className="input-group">
                <span className="icon">📧</span>
                <input 
                    type="email" 
                    className="input"
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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

            <div className="input-group">
                <span className="icon">🔒</span>
                <input 
                    type="password" 
                    className="input"
                    placeholder="Confirm password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    disabled={isProcessing}
                />
            </div>
            
            <div className="input-group">
                <span className="icon">❓</span>
                <select 
                    value={securityQuestion} 
                    onChange={(e) => setSecurityQuestion(e.target.value)} 
                    className="select-input"
                    required
                    disabled={isProcessing}
                >
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                    <option value="In what city were you born?">In what city were you born?</option>
                    <option value="What is your favorite book?">What is your favorite book?</option>
                    <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                    <option value="What is the name of your favorite teacher?">What is the name of your favorite teacher?</option>
                    <option value="What street did you grow up on?">What street did you grow up on?</option>
                    <option value="What is your father's middle name?">What is your father's middle name?</option>
                    <option value="What was the make of your first car?">What was the make of your first car?</option>
                    <option value="What is your favorite movie?">What is your favorite movie?</option>
                </select>
            </div>
            
            <div className="input-group">
                <span className="icon">🔑</span>
                <input 
                    type="text" 
                    className="input"
                    placeholder="Security answer" 
                    value={securityAnswer} 
                    onChange={(e) => setSecurityAnswer(e.target.value)} 
                    required 
                    disabled={isProcessing}
                />
            </div>

            <button 
                type="submit" 
                className={`button-primary ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
            >
                {isProcessing ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
        </form>
    );
};

export default RegisterPage;
