import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
