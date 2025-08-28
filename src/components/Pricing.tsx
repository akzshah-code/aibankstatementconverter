import React, { useState } from 'react';

interface Plan {
  name: string;
  price: string;
  billingCycle: string;
  gstText: string;
  features: string[];
  isEnterprise?: boolean;
}

const pricingData: { monthly: Plan[]; annual: Plan[] } = {
  monthly: [
    { name: 'Starter', price: '₹875', billingCycle: '/month', gstText: '+ 18% GST applicable', features: ['400 pages / month'] },
    { name: 'Professional', price: '₹1,850', billingCycle: '/month', gstText: '+ 18% GST applicable', features: ['1000 pages / month'] },
    { name: 'Business', price: '₹3,100', billingCycle: '/month', gstText: '+ 18% GST applicable', features: ['4000 pages / month'] },
    { name: 'Enterprise', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true },
  ],
  annual: [
    { name: 'Starter', price: '₹5,250', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['4800 pages / month'] },
    { name: 'Professional', price: '₹11,100', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['12000 pages / month'] },
    { name: 'Business', price: '₹18,600', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['48000 pages / month'] },
    { name: 'Enterprise', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true },
  ],
};

const PricingCard: React.FC<{ plan: Plan }> = ({ plan }) => (
    <div className="border border-gray-200 rounded-lg p-6 flex flex-col text-left h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-brand-dark">{plan.name}</h3>
      
      <div className="flex-grow mt-4">
        {plan.isEnterprise ? (
          <p className="text-4xl font-bold text-brand-dark">Need More?</p>
        ) : (
          <>
            <div>
              <span className="text-4xl font-bold text-brand-dark">{plan.price}</span>
              <span className="text-brand-gray">{plan.billingCycle}</span>
            </div>
            <p className="text-sm text-brand-gray mt-1">{plan.gstText}</p>
          </>
        )}
      </div>

      <a
        href={plan.isEnterprise ? '#contact' : '#register'}
        className="w-full text-center bg-brand-blue text-white px-4 py-3 mt-8 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200"
      >
        {plan.isEnterprise ? 'Contact Us' : 'Get Started'}
      </a>
      
      {!plan.isEnterprise && (
        <ul className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-brand-dark">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
);

const Pricing = () => {
    const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
    const currentPlans = pricingData[planType];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center border border-gray-200 p-1 rounded-full bg-gray-50 mb-12">
                    <button 
                        onClick={() => setPlanType('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'monthly' ? 'bg-brand-blue text-white' : 'text-gray-600'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setPlanType('annual')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors relative ${planType === 'annual' ? 'bg-brand-blue text-white' : 'text-gray-600'}`}
                    >
                        Annual
                        <span className="absolute -top-2 -right-4 bg-brand-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Save 50%
                        </span>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {currentPlans.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;