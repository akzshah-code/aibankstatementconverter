import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { User } from '../lib/types';

interface PricingPageProps {
  user: User | null;
  onLogout: () => void;
  onPaymentSuccess: (planName: User['plan'], billingCycle: 'monthly' | 'annual') => void;
}

const PricingPage = ({ user, onLogout, onPaymentSuccess }: PricingPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow">
        <Pricing user={user} onPaymentSuccess={onPaymentSuccess} />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;