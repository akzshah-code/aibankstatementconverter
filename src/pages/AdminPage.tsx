import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminDashboard from '../components/AdminDashboard';
import { User, BlogPost, EmailTemplate } from '../lib/types';

interface AdminPageProps {
  user: User | null;
  onLogout: () => void;
  users: User[];
  posts: BlogPost[];
  templates: EmailTemplate[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
}

const AdminPage = ({ user, onLogout, users, posts, templates, setUsers, setPosts, setTemplates }: AdminPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminDashboard 
          user={user}
          users={users}
          posts={posts}
          templates={templates}
          setUsers={setUsers}
          setPosts={setPosts}
          setTemplates={setTemplates}
        />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;