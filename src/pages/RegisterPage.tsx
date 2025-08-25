import Header from '../components/Header';
import Register from '../components/Register';
import Footer from '../components/Footer';

const RegisterPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Register />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;