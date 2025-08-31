import Header from '../components/Header';
import Footer from '../components/Footer';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { User } from '../lib/types';

interface PrivacyPolicyPageProps {
  user: User | null;
  onLogout: () => void;
}

const PrivacyPolicyPage = ({ user, onLogout }: PrivacyPolicyPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto">
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;