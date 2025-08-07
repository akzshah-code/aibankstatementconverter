import React, { useState, useEffect, useCallback } from 'react';
import { useUser, PLANS } from '../contexts/UserContext';
import { PlanName } from '../lib/types';

// Augment window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingProps {
    onNavigateToRegister: () => void;
}

const pricingPlansData: { name: PlanName | 'Enterprise' }[] = [
    { name: 'Starter' },
    { name: 'Professional' },
    { name: 'Business' },
    { name: 'Enterprise' },
];

const Pricing: React.FC<PricingProps> = ({ onNavigateToRegister }) => {
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
  const { user, purchasePlan, pendingPurchase, setPendingPurchase } = useUser();

  const initiatePayment = useCallback((planName: PlanName) => {
    if (!user) return; // Guard: Should not be called without a user

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
        const errorMessage = "Razorpay Key ID is not configured. Please set VITE_RAZORPAY_KEY_ID in your environment variables.";
        console.error(errorMessage);
        alert(errorMessage);
        return;
    }

    const plan = PLANS[planName];
    const isAnnual = planType === 'annual';
    const baseAmount = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    const gst = baseAmount * 0.18;
    const totalAmount = baseAmount + gst;

    const options = {
        key: razorpayKey,
        amount: Math.round(totalAmount * 100), // Amount in paise, rounded to nearest value
        currency: "INR",
        name: "AI Statement Converter",
        description: `${plan.name} - ${isAnnual ? 'Annual' : 'Monthly'} Plan`,
        handler: function (response: any) {
            alert(`Payment successful! You've subscribed to the ${plan.name} plan.`);
            purchasePlan(planName, isAnnual);
            setPendingPurchase(null); // Clear pending state on success
        },
        prefill: {
            name: user.name,
            email: user.email,
        },
        theme: {
            color: "#4F46E5"
        },
        modal: {
            backdropclose: false, // Prevent closing modal by clicking outside
            ondismiss: function() {
                console.log("Checkout form closed by user.");
                setPendingPurchase(null); // Clear pending state if user cancels
            }
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            console.error("Full Payment Failure Response:", response);
            alert(`Payment Failed: ${response.error.description || 'An unknown error occurred.'}\nCode: ${response.error.code}`);
            setPendingPurchase(null); // Clear pending state on failure
        });
        rzp.open();
    } catch(err: unknown) {
        console.error("Razorpay error:", err);
        alert("Could not initialize payment. Please check your connection and try again.");
        setPendingPurchase(null);
    }
  }, [user, planType, purchasePlan, setPendingPurchase]);

  useEffect(() => {
    // This effect handles the case where a user logs in with a pending purchase
    if (user && pendingPurchase) {
      initiatePayment(pendingPurchase);
      // Pending purchase is now cleared by the payment modal's outcomes (success, fail, dismiss)
    }
  }, [user, pendingPurchase, initiatePayment]);

  const handlePurchase = (planName: PlanName | 'Enterprise') => {
    if (planName === 'Enterprise') {
        alert('Please contact us for Enterprise pricing.');
        return;
    }
    
    if (!user) {
        // User is not logged in. Store their intent and navigate.
        setPendingPurchase(planName);
        onNavigateToRegister();
        return;
    }

    // User is logged in, initiate payment directly.
    initiatePayment(planName);
  };

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="container mx-auto px-6">
        
        <div className="flex justify-center items-center mb-12 space-x-4">
            <button
                onClick={() => setPlanType('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
                    planType === 'monthly' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={planType === 'monthly'}
            >
                Monthly Plan
            </button>
            <button
                onClick={() => setPlanType('annual')}
                className={`px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
                    planType === 'annual' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-pressed={planType === 'annual'}
            >
                Annual Plan
            </button>
            <span className="text-gray-800 font-medium hidden sm:inline">Save up to 50% yearly!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingPlansData.map((planInfo) => {
            if (planInfo.name === 'Enterprise') {
                return (
                  <div key={planInfo.name} className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-gray-800">Enterprise</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">Need More?</p>
                    <div className="flex-grow" />
                     <a href="#" onClick={(e) => { e.preventDefault(); handlePurchase(planInfo.name); }} className="block w-full text-center mt-8 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors duration-300">
                        Contact Us
                    </a>
                  </div>
                );
            }

            const plan = PLANS[planInfo.name as PlanName];
            const isAnnual = planType === 'annual';
            const priceValue = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            const pricePeriod = isAnnual ? 'year' : 'month';
            
            return (
              <div key={plan.name} className={`border rounded-xl p-6 flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 ${user?.subscription.planName === plan.name ? 'border-primary' : 'border-gray-200'}`}>
                <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                    <div className="mt-2">
                        <p className="text-3xl font-bold text-gray-900 flex items-baseline">
                          <span>₹{priceValue.toLocaleString('en-IN')}</span>
                          <span className="text-base font-normal text-gray-500 ml-1">/{pricePeriod}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">+ 18% GST applicable</p>
                    </div>
                </div>
                
                <div className="flex-grow" />

                <div className="mt-8">
                    <button
                      onClick={() => handlePurchase(plan.name)}
                      className="block w-full py-3 bg-primary text-white rounded-md font-semibold text-center hover:bg-primary-hover transition-colors duration-300 disabled:bg-gray-400"
                      disabled={user?.subscription.planName === plan.name}
                    >
                      {user?.subscription.planName === plan.name ? 'Current Plan' : (user ? 'Upgrade' : 'Get Started')}
                    </button>
                    <div className="mt-6 min-h-[24px]">
                        <p className="flex items-center text-gray-600">
                            <i className="fas fa-check text-green-500 mr-3"></i>
                            {plan.pagesPerMonth} pages / month
                        </p>
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
