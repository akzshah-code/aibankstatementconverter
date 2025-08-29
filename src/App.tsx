import { useState, useEffect, lazy, Suspense } from 'react';
import { User, BlogPost, EmailTemplate, EmailRoute } from './lib/types';
import { users as initialUsers, blogPosts as initialBlogPosts, emailTemplates as initialEmailTemplates, emailRoutes as initialEmailRoutes } from './lib/mock-data';

// --- Lazy-loaded Page Components ---
// By using React.lazy, we ensure that the code for each page is only downloaded
// when the user navigates to it. This is a key optimization for performance.
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));


// A simple, centered loading indicator to show while pages are being loaded.
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
  
  // Initialize user state from localStorage to persist login across refreshes
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('loggedInUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  
  // Centralized state for mock data
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [allTemplates, setAllTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [allRoutes, setAllRoutes] = useState<EmailRoute[]>(initialEmailRoutes);


  // Effect to handle hash-based routing
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

  // Effect to save user to localStorage whenever it changes
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
      setAllUsers([...allUsers, standardUser]); // Add new user to our mock data state
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
    
    // Blog Post Detail Page Route
    if (route.startsWith('#blog/')) {
      const postId = route.split('/')[1];
      return <BlogPostPage posts={allPosts} postId={postId} user={user} onLogout={handleLogout} />;
    }

    switch (route) {
      case '#pricing':
        return <PricingPage user={user} onLogout={handleLogout} />;
      case '#faq':
        return <FaqPage user={user} onLogout={handleLogout} />;
      case '#login':
        return <LoginPage onLogin={handleLogin} />;
      case '#register':
        return <RegisterPage />;
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
