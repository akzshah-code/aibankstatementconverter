import Header from '../components/Header';
import Hero from '../components/Hero';
import BankSupport from '../components/BankSupport';
import UsageTiers from '../components/UsageTiers';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <BankSupport />
        <UsageTiers />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
