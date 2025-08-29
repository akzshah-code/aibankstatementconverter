import React, { useState } from 'react';
import { User } from '../lib/types';

interface Plan {
  name: User['plan'];
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
    // FIX: Removed duplicate 'name' property to resolve a TypeScript error. The Enterprise plan's display name is now handled conditionally in the PricingCard component, using 'Free' for type safety.
    { name: 'Free', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true /* Placeholder for type safety */ },
  ],
  annual: [
    { name: 'Starter', price: '₹5,250', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['4800 pages / year'] },
    { name: 'Professional', price: '₹11,100', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['12000 pages / year'] },
    { name: 'Business', price: '₹18,600', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['48000 pages / year'] },
    // FIX: Removed duplicate 'name' property to resolve a TypeScript error. The Enterprise plan's display name is now handled conditionally in the PricingCard component, using 'Free' for type safety.
    { name: 'Free', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true /* Placeholder for type safety */ },
  ],
};

interface PricingProps {
    user: User | null;
    onPaymentSuccess: (planName: User['plan'], billingCycle: 'monthly' | 'annual') => void;
}

const PricingCard: React.FC<{ plan: Plan; onCtaClick: (plan: Plan) => void; userPlan: string | undefined }> = ({ plan, onCtaClick, userPlan }) => {
    const isCurrentPlan = plan.name === userPlan && !plan.isEnterprise;
    return (
        <div className={`border rounded-lg p-6 flex flex-col text-left h-full shadow-sm hover:shadow-lg transition-all duration-300 bg-white ${isCurrentPlan ? 'border-brand-blue border-2' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start">
            {/* FIX: Conditionally render the plan name to display 'Enterprise' for the special enterprise plan, which is identified by the `isEnterprise` flag. */}
            <h3 className="text-xl font-semibold text-brand-dark">{plan.isEnterprise ? 'Enterprise' : plan.name}</h3>
            {isCurrentPlan && <span className="text-xs font-semibold bg-brand-blue-light text-brand-blue px-2 py-1 rounded-full">Current Plan</span>}
        </div>
      
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

      <button
        onClick={() => onCtaClick(plan)}
        disabled={isCurrentPlan}
        className="w-full text-center bg-brand-primary text-white px-4 py-3 mt-8 rounded-md font-semibold hover:bg-brand-primary-hover transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {plan.isEnterprise ? 'Contact Us' : isCurrentPlan ? 'Your Current Plan' : 'Get Started'}
      </button>
      
      {!plan.isEnterprise && (
        <ul className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-brand-green mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-brand-dark">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    )
};

const Pricing = ({ user, onPaymentSuccess }: PricingProps) => {
    const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
    const currentPlans = pricingData[planType];

    const handleGetStartedClick = (plan: Plan) => {
        if (plan.isEnterprise) {
            window.location.hash = '#contact';
            return;
        }

        if (!user) {
            window.location.hash = `#register?plan=${plan.name}&cycle=${planType}`;
            return;
        }

        const amountInRupees = parseInt(plan.price.replace(/[^0-9]/g, ''), 10);
        if (isNaN(amountInRupees)) {
            console.error("Could not parse price:", plan.price);
            alert("An error occurred with the selected plan. Please try again.");
            return;
        }
        const amountInPaise = amountInRupees * 100;

        const options = {
            key: 'rzp_test_ILzsdpdT_2e3cr', // Public test key
            amount: amountInPaise,
            currency: 'INR',
            name: 'BankConverts',
            description: `${plan.name} Plan - ${planType === 'monthly' ? 'Monthly' : 'Annual'}`,
            handler: function (response: { razorpay_payment_id: string }) {
                console.log(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                onPaymentSuccess(plan.name, planType);
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: '#4F46E5', // Corresponds to brand.primary
            },
            modal: {
                ondismiss: function () {
                    console.log('Payment modal dismissed by user.');
                },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            events: {
                'payment.failed': function (response: any) {
                    console.error('Payment Failed:', response.error);
                    const reason = response.error.reason ? `Reason: ${response.error.reason}` : 'Please check your payment details and try again.';
                    alert(`Oops! Something went wrong.\nPayment Failed.\n${reason}`);
                }
            }
        };

        if (!window.Razorpay) {
            alert('Payment gateway is not available. Please try again later.');
            return;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    };


    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center border border-gray-200 p-1 rounded-full bg-brand-blue-light mb-12">
                    <button 
                        onClick={() => setPlanType('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'monthly' ? 'bg-brand-primary text-white' : 'text-brand-dark'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setPlanType('annual')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors relative ${planType === 'annual' ? 'bg-brand-primary text-white' : 'text-brand-dark'}`}
                    >
                        Annual
                        <span className="absolute -top-2 -right-4 bg-brand-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Save 50%
                        </span>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {currentPlans.map((plan) => (
                        <PricingCard 
                          key={`${planType}-${plan.name}`}
                          plan={plan} 
                          onCtaClick={handleGetStartedClick}
                          userPlan={user?.plan}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;