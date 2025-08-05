import React, { useState } from 'react';

type PlanType = 'monthly' | 'annual';

const pricingPlansData = [
    {
        name: 'Starter',
        monthly: { price: '$10 / month', pages: '400 pages / month' },
        annual: { price: '$60 / year', pages: '4800 pages / year' },
        buttonText: 'Buy',
    },
    {
        name: 'Professional',
        monthly: { price: '$21 / month', pages: '1000 pages / month' },
        annual: { price: '$126 / year', pages: '12000 pages / year' },
        buttonText: 'Buy',
    },
    {
        name: 'Business',
        monthly: { price: '$35 / month', pages: '4000 pages / month' },
        annual: { price: '$210 / year', pages: '48000 pages / year' },
        buttonText: 'Buy',
    },
    {
        name: 'Enterprise',
        description: 'Need More?',
        buttonText: 'Contact',
    },
];

const Pricing: React.FC = () => {
  const [planType, setPlanType] = useState<PlanType>('monthly');

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="container mx-auto px-6">
        
        <div className="flex justify-center items-center mb-12 space-x-4">
            <button
                onClick={() => setPlanType('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
                    planType === 'monthly' ? 'border-primary bg-white text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={planType === 'monthly'}
            >
                Monthly Plan
            </button>
            <button
                onClick={() => setPlanType('annual')}
                className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
                    planType === 'annual' ? 'border-primary bg-white text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={planType === 'annual'}
            >
                Annual Plan
            </button>
            <span className="text-gray-800 font-medium hidden sm:inline">Save more yearly!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingPlansData.map((plan) => {
            const isEnterprise = plan.name === 'Enterprise';
            const displayData = isEnterprise ? { price: plan.description, pages: null } : plan[planType];

            return (
              <div key={plan.name} className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{displayData.price}</p>
                </div>
                
                <div className="flex-grow" />

                <div className="mt-8">
                    <a 
                      href="#" 
                      className="block w-full py-3 bg-primary text-white rounded-md font-semibold text-center hover:bg-primary-hover transition-colors duration-300"
                    >
                      {plan.buttonText}
                    </a>
                    <div className="mt-6 min-h-[24px]">
                        {displayData.pages && (
                            <p className="flex items-center text-gray-600">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                {displayData.pages}
                            </p>
                        )}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;