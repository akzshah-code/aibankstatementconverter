import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { User } from '../lib/types';

interface ContactPageProps {
  user: User | null;
  onLogout: () => void;
}

const ContactPage = ({ user, onLogout }: ContactPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
