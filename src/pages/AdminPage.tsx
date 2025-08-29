import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminDashboard from '../components/AdminDashboard';
import { User, BlogPost, EmailTemplate, EmailRoute } from '../lib/types';

interface AdminPageProps {
  user: User | null;
  onLogout: () => void;
  users: User[];
  posts: BlogPost[];
  templates: EmailTemplate[];
  routes: EmailRoute[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  setRoutes: React.Dispatch<React.SetStateAction<EmailRoute[]>>;
}

const AdminPage = ({ user, onLogout, users, posts, templates, routes, setUsers, setPosts, setTemplates, setRoutes }: AdminPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminDashboard 
          user={user}
          users={users}
          posts={posts}
          templates={templates}
          routes={routes}
          setUsers={setUsers}
          setPosts={setPosts}
          setTemplates={setTemplates}
          setRoutes={setRoutes}
        />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
