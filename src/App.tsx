import React, { useState, useRef, lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AdSlot from './components/AdSlot';
import UsageTiers from './components/UsageTiers';
import Features from './components/Features';
import BankSupport from './components/BankSupport';
import Footer from './components/Footer';

// Lazy load components for different views to enable code-splitting
const Pricing = lazy(() => import('./components/Pricing'));
const DemoView = lazy(() => import('./components/DemoView'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const UnlockPdf = lazy(() => import('./components/UnlockPdf'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

type View = 'main' | 'pricing' | 'demo' | 'login' | 'register' | 'unlock' | 'privacy' | 'terms';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-20 min-h-[calc(100vh-160px)]">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
);

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
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
      </main>
      <Footer onNavigateToPrivacy={showPrivacyPage} onNavigateToTerms={showTermsPage} />
    </div>
  );
};

export default App;
