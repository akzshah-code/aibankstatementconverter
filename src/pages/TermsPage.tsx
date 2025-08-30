import Header from '../components/Header';
import Footer from '../components/Footer';
import TermsOfService from '../components/TermsOfService';
import { User } from '../lib/types';

interface TermsPageProps {
  user: User | null;
  onLogout: () => void;
}

const TermsPage = ({ user, onLogout }: TermsPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto">
        <TermsOfService />
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
