import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../components/Dashboard';
import { User } from '../lib/types';

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardPage = ({ user, onLogout }: DashboardPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Dashboard user={user} />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;