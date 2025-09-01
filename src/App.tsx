

import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { User, BlogPost, EmailTemplate, EmailRoute, ConversionResult } from './lib/types';
import { users as initialUsers, blogPosts as initialBlogPosts, emailTemplates as initialEmailTemplates, emailRoutes as initialEmailRoutes } from './lib/mock-data';
import { getPlanDetails } from './lib/plans';

// --- Lazy-loaded Page Components ---
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const BulkConvertPage = lazy(() => import('./pages/BulkConvertPage'));


const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <p className="text-lg font-semibold text-brand-dark">Loading...</p>
      <p className="text-sm text-brand-gray">Please wait a moment.</p>
    </div>
  </div>
);

function App() {
  const [route, setRoute] = useState(window.location.hash);
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('loggedInUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('allUsers');
      return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    } catch (error) {
      console.error("Failed to parse allUsers from localStorage", error);
      return initialUsers;
    }
  });

  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [allTemplates, setAllTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [allRoutes, setAllRoutes] = useState<EmailRoute[]>(initialEmailRoutes);


  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0); 
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Persist the currently logged-in user's session.
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('loggedInUser');
      }
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  }, [user]);

  // Persist the master user list whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    } catch (error) {
      console.error("Failed to save allUsers to localStorage", error);
    }
  }, [allUsers]);


  const handleLogin = (email: string) => {
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      window.location.hash = foundUser.role === 'admin' ? '#admin' : '#dashboard';
    } else {
      const freePlanDetails = getPlanDetails('Free');
      const standardUser: User = {
        id: `usr_${Date.now()}`,
        name: 'New User',
        email: email,
        role: 'user',
        plan: 'Free',
        usage: { used: 0, total: freePlanDetails.pages },
        dailyUsage: { pagesUsed: 0, resetTimestamp: 0 },
        planRenews: 'N/A',
      };
      setUser(standardUser);
      setAllUsers([...allUsers, standardUser]);
      window.location.hash = '#dashboard';
    }
  };
  
  const handleRegister = (fullName: string, email: string, planName: User['plan'], billingCycle: string) => {
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      alert("An account with this email already exists. Please log in.");
      window.location.hash = '#login';
      return;
    }

    const planDetails = getPlanDetails(planName, billingCycle as 'monthly' | 'annual');
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: fullName,
      email: email,
      role: 'user',
      plan: planName,
      usage: { used: 0, total: planDetails.pages },
      dailyUsage: { pagesUsed: 0, resetTimestamp: 0 },
      planRenews: billingCycle === 'annual' ? '1 year from now' : '1 month from now',
    };

    // Asynchronously send a welcome email without blocking the registration flow.
    fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUser.name, email: newUser.email }),
    }).catch(emailError => {
      // Log the error for debugging but don't show it to the user.
      console.error("Failed to trigger welcome email:", emailError);
    });

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    
    if (planName !== 'Free') {
       window.location.hash = `#pricing?autoPay=true&plan=${planName}&cycle=${billingCycle}`;
    } else {
       window.location.hash = '#dashboard';
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.location.hash = '#login';
  };

  const handlePaymentSuccess = (planName: User['plan'], billingCycle: 'monthly' | 'annual') => {
    if (!user) {
      alert("You must be logged in to upgrade your plan.");
      window.location.hash = '#login';
      return;
    }
    
    const planDetails = getPlanDetails(planName, billingCycle);
    const updatedUser: User = {
      ...user,
      plan: planName,
      usage: { used: 0, total: planDetails.pages },
      planRenews: billingCycle === 'annual' ? '1 year from now' : '1 month from now',
    };

    // Asynchronously send a plan upgrade email.
    fetch('/api/send-upgrade-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: updatedUser.name, email: updatedUser.email, planName: updatedUser.plan }),
    }).catch(emailError => {
      console.error("Failed to trigger upgrade email:", emailError);
    });

    setUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

    alert(`Upgrade successful! You are now on the ${planName} plan.`);
    window.location.hash = '#dashboard';
  };
  
  const handleConversionComplete = useCallback((result: ConversionResult) => {
    // Use a functional update for setUser to get the latest user state,
    // avoiding stale closures and issues if multiple conversions happen quickly.
    setUser(currentUser => {
        if (!currentUser || result.pages === 0) return currentUser;

        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
  
        let currentDailyUsage = currentUser.dailyUsage || { pagesUsed: 0, resetTimestamp: 0 };
        if (now > currentDailyUsage.resetTimestamp) {
            currentDailyUsage = { pagesUsed: 0, resetTimestamp: now + twentyFourHours };
        }

        const updatedUser: User = {
            ...currentUser,
            usage: {
                ...currentUser.usage,
                used: (currentUser.usage.used || 0) + result.pages,
            },
            dailyUsage: {
                pagesUsed: currentDailyUsage.pagesUsed + result.pages,
                resetTimestamp: currentDailyUsage.resetTimestamp,
            },
        };

        setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        return updatedUser;
    });
  }, [setAllUsers]); // Only depends on the stable setter function.

  const renderPage = () => {
    if (!user && (route.startsWith('#dashboard') || route.startsWith('#admin') || route.startsWith('#bulk-convert'))) {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (user?.role !== 'admin' && route.startsWith('#admin')) {
      return <DashboardPage user={user} onLogout={handleLogout} />;
    }
    
    if (route.startsWith('#blog/')) {
      const postId = route.split('/')[1];
      return <BlogPostPage posts={allPosts} postId={postId} user={user} onLogout={handleLogout} />;
    }

    const currentRoute = route.split('?')[0];

    switch (currentRoute) {
      case '#pricing':
        return <PricingPage user={user} onLogout={handleLogout} onPaymentSuccess={handlePaymentSuccess} />;
      case '#faq':
        return <FaqPage user={user} onLogout={handleLogout} />;
      case '#terms':
        return <TermsPage user={user} onLogout={handleLogout} />;
      case '#privacy':
        return <PrivacyPolicyPage user={user} onLogout={handleLogout} />;
      case '#about':
        return <AboutPage user={user} onLogout={handleLogout} />;
      case '#contact':
        return <ContactPage user={user} onLogout={handleLogout} />;
      case '#login':
        return <LoginPage onLogin={handleLogin} />;
      case '#register':
        return <RegisterPage onRegister={handleRegister} />;
      case '#dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} />;
      case '#bulk-convert':
        return <BulkConvertPage user={user} onLogout={handleLogout} onConversionComplete={handleConversionComplete} />;
      case '#blog':
        return <BlogPage posts={allPosts} user={user} onLogout={handleLogout} />;
      case '#admin':
        return (
          <AdminPage
            user={user}
            onLogout={handleLogout}
            users={allUsers}
            posts={allPosts}
            templates={allTemplates}
            routes={allRoutes}
            setUsers={setAllUsers}
            setPosts={setAllPosts}
            setTemplates={setAllTemplates}
            setRoutes={setAllRoutes}
          />
        );
      default:
        return <LandingPage user={user} onLogout={handleLogout} onConversionComplete={handleConversionComplete} />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderPage()}
    </Suspense>
  );
}

export default App;