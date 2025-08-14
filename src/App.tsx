

import React, { useState, useRef, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AdSlot from '@/components/AdSlot';
import UsageTiers from '@/components/UsageTiers';
import Features from '@/components/Features';
import BankSupport from '@/components/BankSupport';
import Footer from '@/components/Footer';
import { useUser } from '@/contexts/UserContext';
import FAQ from '@/components/FAQ';

// Lazy load components for different views to enable code-splitting
const Pricing = lazy(() => import('@/components/Pricing'));
const DemoView = lazy(() => import('@/components/DemoView'));
const Login = lazy(() => import('@/components/Login'));
const Register = lazy(() => import('@/components/Register'));
const PrivacyPolicy = lazy(() => import('@/components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/components/TermsOfService'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const About = lazy(() => import('@/components/About'));
const BulkConverter = lazy(() => import('@/components/BulkConverter'));
const ApiDocs = lazy(() => import('@/components/ApiDocs'));

type View = 'main' | 'pricing' | 'demo' | 'login' | 'register' | 'privacy' | 'terms' | 'dashboard' | 'about' | 'faq' | 'bulk-convert' | 'api-docs';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-20 min-h-[calc(100vh-160px)]">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const { user, logout, loading, pendingPurchase } = useUser();
  const heroRef = useRef<HTMLElement>(null);

  const handleEnterDemo = () => setView('demo');
  const handleExitDemo = () => setView('main');

  const changeView = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  };
  
  const handleLogout = () => {
    logout();
    changeView('main');
  };
  
  const handleLoginSuccess = () => {
    if (pendingPurchase) {
      changeView('pricing');
    } else {
      changeView('dashboard');
    }
  };

  const navigateToMainPage = (andScrollToRef?: React.RefObject<HTMLElement>) => {
    if (view !== 'main') {
      setView('main');
      setTimeout(() => {
        if (andScrollToRef?.current) {
          andScrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 50);
    } else if (andScrollToRef?.current) {
      andScrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    switch (view) {
      case 'pricing':
        return <Pricing onNavigateToRegister={() => changeView('register')} />;
      case 'demo':
        return <DemoView onExitDemo={handleExitDemo} />;
      case 'login':
        return <Login onNavigateToRegister={() => changeView('register')} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <Register onNavigateToLogin={() => changeView('login')} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'about':
        return <About />;
      case 'faq':
        return <FAQ />;
      case 'api-docs':
        return <ApiDocs />;
      case 'dashboard':
        return user ? <Dashboard onNavigateToPricing={() => changeView('pricing')} /> : <Login onNavigateToRegister={() => changeView('register')} onLoginSuccess={handleLoginSuccess} />;
      case 'bulk-convert':
        return user ? <BulkConverter /> : <Login onNavigateToRegister={() => changeView('register')} onLoginSuccess={handleLoginSuccess} />;
      case 'main':
      default:
        return (
          <>
            <Hero ref={heroRef} onTryDemo={handleEnterDemo} />
            <UsageTiers onNavigateToPricing={() => changeView('pricing')} onNavigateToRegister={() => changeView('register')} />
             <section className="bg-white py-16">
                <div className="container mx-auto px-6 max-w-4xl text-center bg-indigo-50 p-8 rounded-xl shadow-md border border-indigo-100">
                    <h2 className="text-3xl font-bold text-gray-900">Process Multiple Statements at Once!</h2>
                    <p className="text-lg text-secondary mt-2">Our new Bulk Converter saves you even more time. Available for all registered users.</p>
                    <button 
                        onClick={() => changeView('bulk-convert')} 
                        className="mt-6 px-8 py-3 bg-primary text-white rounded-md font-semibold text-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105"
                    >
                      Try Bulk Conversion
                    </button>
                </div>
            </section>
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
        user={user}
        onLogout={handleLogout}
        onShowPricingPage={() => changeView('pricing')}
        onNavigateToLogin={() => changeView('login')}
        onNavigateToRegister={() => changeView('register')}
        onNavigateToDashboard={() => changeView('dashboard')}
        onNavigateToBulkConvert={() => changeView('bulk-convert')}
        onNavigateToConvert={() => navigateToMainPage(heroRef)}
        onNavigateHome={() => navigateToMainPage()}
      />
      <main className="pt-20">
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
      </main>
      <Footer onNavigateToPrivacy={() => changeView('privacy')} onNavigateToTerms={() => changeView('terms')} onNavigateToAbout={() => changeView('about')} onNavigateToFaq={() => changeView('faq')} onNavigateToApiDocs={() => changeView('api-docs')} />
    </div>
  );
};

export default App;