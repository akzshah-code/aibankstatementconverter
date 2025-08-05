import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AdSlot from './components/AdSlot';
import UsageTiers from './components/UsageTiers';
import Features from './components/Features';
import BankSupport from './components/BankSupport';
import UnlockPdf from './components/UnlockPdf';
import Footer from './components/Footer';
import DemoView from './components/DemoView';
import Pricing from './components/Pricing';
import Login from './components/Login';
import Register from './components/Register';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

type View = 'main' | 'pricing' | 'demo' | 'login' | 'register' | 'unlock' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const heroRef = useRef<HTMLElement>(null);

  const handleEnterDemo = () => setView('demo');
  const handleExitDemo = () => setView('main');

  const showLoginPage = () => {
    setView('login');
    window.scrollTo(0, 0);
  };

  const showRegisterPage = () => {
    setView('register');
    window.scrollTo(0, 0);
  };

  const showPricingPage = () => {
    setView('pricing');
    window.scrollTo(0, 0);
  };

  const showUnlockPage = () => {
    setView('unlock');
    window.scrollTo(0, 0);
  };

  const showPrivacyPage = () => {
    setView('privacy');
    window.scrollTo(0, 0);
  };

  const showTermsPage = () => {
    setView('terms');
    window.scrollTo(0, 0);
  };

  const navigateToMainPage = (andScrollToRef?: React.RefObject<HTMLElement>) => {
    if (view !== 'main') {
      setView('main');
      // Use timeout to allow the main view to render before scrolling
      setTimeout(() => {
        if (andScrollToRef?.current) {
          andScrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 50);
    } else if (andScrollToRef?.current) {
      // Already on main page, just scroll
      andScrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'pricing':
        return <Pricing />;
      case 'demo':
        return <DemoView onExitDemo={handleExitDemo} />;
      case 'login':
        return <Login onNavigateToRegister={showRegisterPage} />;
      case 'register':
        return <Register onNavigateToLogin={showLoginPage} />;
      case 'unlock':
        return <UnlockPdf />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'main':
      default:
        return (
          <>
            <Hero ref={heroRef} onTryDemo={handleEnterDemo} />
            <UsageTiers onNavigateToPricing={showPricingPage} onNavigateToRegister={showRegisterPage} />
            <Features />
            <section className="py-8 bg-gray-50 flex justify-center">
              <AdSlot id="ad-rect" width={300} height={250} />
            </section>
            <BankSupport />
            <section className="py-8 bg-gray-50 flex justify-center">
               <AdSlot id="ad-leaderboard" width={728} height={90} isResponsive={true} />
            </section>
          </>
        );
    }
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header
        onShowPricingPage={showPricingPage}
        onNavigateToLogin={showLoginPage}
        onNavigateToRegister={showRegisterPage}
        onNavigateToUnlock={showUnlockPage}
        onNavigateToConvert={() => navigateToMainPage(heroRef)}
        onNavigateHome={() => navigateToMainPage()}
      />
      <main className="pt-20"> {/* Adjusted padding for fixed header */}
        {renderContent()}
      </main>
      <Footer onNavigateToPrivacy={showPrivacyPage} onNavigateToTerms={showTermsPage} />
    </div>
  );
};

export default App;
