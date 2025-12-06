// App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ImageUploaderPage from './components/ImageUploaderPage';
import DashboardPage from './components/DashboardPage';
import './GlobalStyles.css';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'home', 'dashboard', 'uploader'
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignOut = () => {
    setCurrentView('login');
    setIsLoggedIn(false);
    setUserName('User');
    setUserEmail('');
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.username || 'User');
    setUserEmail(userData.email || '');
    setCurrentView('home');
  };

  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  const handleNavigateToUploader = () => {
    setCurrentView('uploader');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentView('login')}
          />
        );
      case 'home':
        return (
          <HomePage 
            onGetStarted={handleGetStarted}
            onSignOut={handleSignOut}
            userName={userName}
            userEmail={userEmail}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage 
            onBackToHome={() => setCurrentView('home')}
            onSignOut={handleSignOut}
            userName={userName}
            onNavigateToUploader={handleNavigateToUploader}
          />
        );
      case 'uploader':
        return (
          <ImageUploaderPage 
            onBackToHome={() => setCurrentView('dashboard')}
            onSignOut={handleSignOut}
            userName={userName}
          />
        );
      default:
        return (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentView('login')}
          />
        );
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {renderCurrentView()}
    </div>
  );
}

export default App;