import React, { useState, useEffect } from 'react';
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
    { name: 'Free', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true },
  ],
  annual: [
    { name: 'Starter', price: '₹5,250', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['4800 pages / year'] },
    { name: 'Professional', price: '₹11,100', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['12000 pages / year'] },
    { name: 'Business', price: '₹18,600', billingCycle: '/year', gstText: '+ 18% GST applicable', features: ['48000 pages / year'] },
    { name: 'Free', price: 'Need More?', billingCycle: '', gstText: '', features: [], isEnterprise: true },
  ],
};


interface PricingProps {
    user: User | null;
    onPaymentSuccess: (planName: User['plan'], billingCycle: 'monthly' | 'annual') => void;
}

const PricingCard: React.FC<{ plan: Plan; onCtaClick: () => void; userPlan: string | undefined }> = ({ plan, onCtaClick, userPlan }) => {
    const isCurrentPlan = plan.name === userPlan && !plan.isEnterprise;
    return (
        <div className={`border rounded-lg p-6 flex flex-col text-left h-full shadow-sm hover:shadow-lg transition-all duration-300 bg-white ${isCurrentPlan ? 'border-brand-primary border-2' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-brand-dark">{plan.isEnterprise ? 'Enterprise' : plan.name}</h3>
            {isCurrentPlan && <span className="text-xs font-semibold bg-brand-blue-light text-brand-primary px-2 py-1 rounded-full">Current Plan</span>}
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
        onClick={onCtaClick}
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
              <span className="text-brand-dark text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    );
};


const Pricing = ({ user, onPaymentSuccess }: PricingProps) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const plans = pricingData[billingCycle];

    const openRazorpayModal = (plan: Plan) => {
        if (!user) {
            alert("An unexpected error occurred. Please log in again.");
            window.location.hash = '#login';
            return;
        }

        const priceInPaise = parseInt(plan.price.replace(/[^0-9]/g, '')) * 100;
        
        const options = {
            key: 'rzp_test_YOUR_KEY_HERE', // IMPORTANT: Replace with your actual Razorpay Key ID
            amount: priceInPaise,
            currency: 'INR',
            name: 'BankConverts',
            description: `Subscription - ${plan.name} (${billingCycle})`,
            image: '/logo.png',
            handler: (response: any) => {
                console.log('Payment success response:', response);
                onPaymentSuccess(plan.name, billingCycle);
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: '#4F46E5', // Matches brand-primary
            },
            modal: {
                ondismiss: () => {
                    alert('Payment was cancelled.');
                }
            },
            'callback_url': `https://www.bankconverts.com/#dashboard?payment_id=`,
            'redirect': true
        };
        
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', (response: any) => {
             alert(`Payment Failed: ${response.error.description}. Please try again.`);
        });
        
        rzp.open();
    };


    const handleGetStartedClick = (plan: Plan) => {
        if (plan.isEnterprise) {
            window.location.hash = '#contact'; // Or open a contact modal
            return;
        }

        if (user) {
            // User is logged in, initiate payment
            openRazorpayModal(plan);
        } else {
            // User is a guest, redirect to registration
            window.location.hash = `#register?plan=${plan.name}&cycle=${billingCycle}`;
        }
    };
    
    // Auto-trigger payment modal for new users after registration.
    useEffect(() => {
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');
        const params = new URLSearchParams(queryIndex > -1 ? hash.substring(queryIndex) : '');

        if (params.get('autoPay') === 'true' && user) {
            const planName = params.get('plan') as User['plan'];
            const cycle = (params.get('cycle') as 'monthly' | 'annual') || 'monthly';
            
            const planToPay = pricingData[cycle].find(p => p.name === planName);

            if (planToPay) {
                openRazorpayModal(planToPay);
                // Clean up URL after triggering payment
                window.history.replaceState(null, '', '#pricing');
            }
        }
    }, [user]); // Rerun when user state is confirmed after registration.

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">
                        Find the Perfect Plan
                    </h1>
                    <p className="mt-4 text-lg text-brand-gray">
                        Start for free, then scale up as you grow. All plans include our core features.
                    </p>
                </div>
                
                {/* Billing Toggle */}
                <div className="mt-12 flex justify-center items-center space-x-4">
                    <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-brand-primary' : 'text-brand-gray'}`}>Monthly</span>
                    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="toggle" 
                            id="toggle" 
                            checked={billingCycle === 'annual'}
                            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                     <span className={`font-semibold ${billingCycle === 'annual' ? 'text-brand-primary' : 'text-brand-gray'}`}>Annual</span>
                    <span className="bg-brand-green/20 text-brand-green text-xs font-bold px-2 py-1 rounded-full">Save 25%</span>
                </div>

                {/* Pricing Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map(plan => (
                        <PricingCard 
                            key={plan.name} 
                            plan={plan} 
                            onCtaClick={() => handleGetStartedClick(plan)}
                            userPlan={user?.plan}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
