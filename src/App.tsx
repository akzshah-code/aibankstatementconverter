import { useState, useEffect, lazy, Suspense } from 'react';
import { User, BlogPost, EmailTemplate, EmailRoute } from './lib/types';
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
  
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
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

  const handleLogin = (email: string) => {
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      window.location.hash = foundUser.role === 'admin' ? '#admin' : '#dashboard';
    } else {
      // Fallback for demo purposes: if user doesn't exist, create a new free user.
      // The primary path for new users is the registration flow.
      const freePlanDetails = getPlanDetails('Free');
      const standardUser: User = {
        id: `usr_${Date.now()}`,
        name: 'New User',
        email: email,
        role: 'user',
        plan: 'Free',
        usage: { used: 0, total: freePlanDetails.pages },
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
      planRenews: billingCycle === 'annual' ? '1 year from now' : '1 month from now', // Placeholder
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    // If it's a paid plan, redirect to pricing to trigger payment. Otherwise, go to dashboard.
    if (planName !== 'Free') {
       window.location.hash = '#pricing';
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
      planRenews: billingCycle === 'annual' ? '1 year from now' : '1 month from now', // Placeholder
    };

    setUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

    alert(`Upgrade successful! You are now on the ${planName} plan.`);
    window.location.hash = '#dashboard';
  };

  const renderPage = () => {
    if (!user && (route.startsWith('#dashboard') || route.startsWith('#admin'))) {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (user?.role !== 'admin' && route.startsWith('#admin')) {
      return <DashboardPage user={user} onLogout={handleLogout} />;
    }
    
    if (route.startsWith('#blog/')) {
      const postId = route.split('/')[1];
      return <BlogPostPage posts={allPosts} postId={postId} user={user} onLogout={handleLogout} />;
    }

    // Use startsWith to handle query parameters in the hash
    const currentRoute = route.split('?')[0];

    switch (currentRoute) {
      case '#pricing':
        return <PricingPage user={user} onLogout={handleLogout} onPaymentSuccess={handlePaymentSuccess} />;
      case '#faq':
        return <FaqPage user={user} onLogout={handleLogout} />;
      case '#login':
        return <LoginPage onLogin={handleLogin} />;
      case '#register':
        return <RegisterPage onRegister={handleRegister} />;
      case '#dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} />;
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
        return <LandingPage user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderPage()}
    </Suspense>
  );
}

export default App;
