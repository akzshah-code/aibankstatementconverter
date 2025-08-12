import React from 'react';

interface UsageTiersProps {
  onNavigateToPricing: () => void;
  onNavigateToRegister: () => void;
}

const UsageTiers: React.FC<UsageTiersProps> = ({ onNavigateToPricing, onNavigateToRegister }) => {
  
  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigateToRegister();
  };

  const handleSubscribeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigateToPricing();
  };

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // A simple mailto link is a good default action for "Contact Us"
    window.location.href = "mailto:support@example.com?subject=Bespoke Services Inquiry";
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Anonymous Tier Card */}
          <div className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">Anonymous</h3>
              <p className="text-gray-600 mt-2 min-h-[72px]">Anonymous conversions with no need to sign up</p>
              <div className="mt-6">
                <p className="flex items-center text-gray-600">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  1 page every 24 hours
                </p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-end">
              <span className="text-2xl font-bold text-gray-900">Free</span>
            </div>
          </div>

          {/* Registered Tier Card */}
          <div className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">Registered</h3>
              <p className="text-gray-600 mt-2 min-h-[72px]">Registration is free</p>
              <div className="mt-6">
                <p className="flex items-center text-gray-600">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  5 pages every 24 hours
                </p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
              <span className="text-2xl font-bold text-gray-900">Free</span>
              <a href="#" onClick={handleRegisterClick} className="text-primary hover:underline font-semibold">
                Register
              </a>
            </div>
          </div>

          {/* Subscribe Tier Card */}
          <div className="border-2 border-primary rounded-xl p-6 flex flex-col bg-white shadow-lg transition-shadow duration-300">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">Subscribe</h3>
              <p className="text-gray-600 mt-2 min-h-[72px]">Subscribe to convert more documents</p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end items-end">
              <a href="#pricing" onClick={handleSubscribeClick} className="text-primary hover:underline font-semibold">
                Subscribe
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-8 bg-indigo-50 p-8 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900">Need more?</h3>
            <p className="text-secondary mt-1 max-w-2xl">
              For clients that need to process documents in different formats, we provide custom services. Tell us how we may be of assistance!
            </p>
          </div>
          <button onClick={handleContactClick} className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm flex-shrink-0">
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
};

export default UsageTiers;