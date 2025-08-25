import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { User } from './lib/types';
import { users } from './lib/mock-data';

function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogin = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      window.location.hash = foundUser.role === 'admin' ? '#admin' : '#dashboard';
    } else {
      // For demo purposes, log in any other email as a standard user
      const standardUser: User = {
        id: 'usr_new',
        name: 'New User',
        email: email,
        role: 'user',
        plan: 'Free',
        usage: { used: 0, total: 5 },
        planRenews: 'N/A',
      };
      setUser(standardUser);
      window.location.hash = '#dashboard';
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    window.location.hash = '#login';
  };

  const renderPage = () => {
    // Redirect to login if trying to access protected routes without a user
    if (!user && (route === '#dashboard' || route === '#admin')) {
      return <LoginPage onLogin={handleLogin} />;
    }

    // Admin access control
    if (user?.role !== 'admin' && route === '#admin') {
      return <DashboardPage user={user} onLogout={handleLogout} />;
    }

    switch (route) {
      case '#pricing':
        return <PricingPage user={user} onLogout={handleLogout} />;
      case '#login':
        return <LoginPage onLogin={handleLogin} />;
      case '#register':
        return <RegisterPage />;
      case '#dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} />;
      case '#admin':
        return <AdminPage user={user} onLogout={handleLogout} />;
      default:
        return <LandingPage user={user} onLogout={handleLogout} />;
    }
  };

  return renderPage();
}

export default App;