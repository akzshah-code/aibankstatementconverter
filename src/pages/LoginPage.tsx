import Header from '../components/Header';
import Login from '../components/Login';
import Footer from '../components/Footer';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Login />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;