import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';

function App() {
  // Simple hash-based routing
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    // Set initial route
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (route) {
      case '#pricing':
        return <PricingPage />;
      default:
        return <LandingPage />;
    }
  };

  return renderPage();
}

export default App;
