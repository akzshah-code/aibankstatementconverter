import Header from '../components/Header';
import Register from '../components/Register';
import Footer from '../components/Footer';
import { User } from '../lib/types';

interface RegisterPageProps {
  onRegister: (fullName: string, email: string, planName: User['plan'], billingCycle: string) => void;
}

const RegisterPage = ({ onRegister }: RegisterPageProps) => {
  // Extract plan info from the URL hash query parameters
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  const params = new URLSearchParams(queryIndex > -1 ? hash.substring(queryIndex) : '');
  
  const planName = (params.get('plan') as User['plan']) || 'Free';
  const billingCycle = params.get('cycle') || 'monthly';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={null} onLogout={() => {}} />
      <main className="flex-grow overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Register 
          onRegister={onRegister}
          planName={planName}
          billingCycle={billingCycle}
        />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
