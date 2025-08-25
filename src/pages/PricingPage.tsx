import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { User } from '../lib/types';

interface PricingPageProps {
  user: User | null;
  onLogout: () => void;
}

const PricingPage = ({ user, onLogout }: PricingPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;