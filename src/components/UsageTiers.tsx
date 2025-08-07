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
          <div className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">Subscribe</h3>
              <p className="text-gray-600 mt-2 min-h-[72px]">Subscribe for up to 4,000 pages/month, conversion history, and more.</p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end items-end">
              <a href="#pricing" onClick={handleSubscribeClick} className="bg-primary text-white font-semibold px-5 py-2 rounded-md hover:bg-primary-hover transition-colors">
                View Plans
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UsageTiers;
