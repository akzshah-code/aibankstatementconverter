import Header from '../components/Header';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';
import { User } from '../lib/types';

interface FaqPageProps {
  user: User | null;
  onLogout: () => void;
}

const FaqPage = ({ user, onLogout }: FaqPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
