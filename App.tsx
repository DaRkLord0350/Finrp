import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash.substring(1) || '/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useCallback((path: string) => {
    setRoute(path);
    window.location.hash = path;
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    navigate('/dashboard/overview');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/');
  }, [navigate]);

  // Basic routing logic
  let content;
  
  if (route.startsWith('/dashboard')) {
    if (isAuthenticated) {
      content = <DashboardLayout currentPath={route} navigate={navigate} onLogout={handleLogout} />;
    } else {
      // Redirect to login if trying to access dashboard while not authenticated
      content = <LoginPage onLogin={handleLogin} navigate={navigate} />;
    }
  } else if (route === '/login') {
    content = <LoginPage onLogin={handleLogin} navigate={navigate} />;
  } else {
    // Default to HomePage
    content = <HomePage navigate={navigate} />;
  }

  return <>{content}</>;
};

export default App;
