import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import BankSupport from '../components/BankSupport';
import UsageTiers from '../components/UsageTiers';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import { User } from '../lib/types';

interface LandingPageProps {
  user: User | null;
  onLogout: () => void;
}

const LandingPage = ({ user, onLogout }: LandingPageProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto">
        <Hero />
        <Features />
        <BankSupport />
        <UsageTiers />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
