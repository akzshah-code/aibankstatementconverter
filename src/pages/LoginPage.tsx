import Header from '../components/Header';
import Login from '../components/Login';
import Footer from '../components/Footer';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={null} onLogout={() => {}} />
      <main className="flex-grow overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Login onLogin={onLogin} />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
