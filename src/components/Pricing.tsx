interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  price: string;
  actionText?: string;
  highlighted?: boolean;
}

const PricingCard = ({ title, description, features, price, actionText, highlighted = false }: PricingCardProps) => (
  <div className={`border rounded-lg p-8 flex flex-col ${highlighted ? 'border-brand-purple shadow-lg' : 'border-gray-200'}`}>
    <h3 className="text-xl font-semibold text-brand-dark">{title}</h3>
    <p className="text-brand-gray mt-2 flex-grow">{description}</p>
    <ul className="my-8 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-brand-dark">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto pt-8 border-t border-gray-200 flex items-center justify-between">
      <p className="text-2xl font-bold text-brand-dark">{price}</p>
      {actionText && (
        <a href="#register" className="font-semibold text-brand-purple hover:underline">
          {actionText}
        </a>
      )}
    </div>
  </div>
);

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingCard
            title="Anonymous"
            description="Anonymous conversions with no need to sign up"
            features={['1 page every 24 hours']}
            price="Free"
          />
          <PricingCard
            title="Registered"
            description="Registration is free"
            features={['5 pages every 24 hours']}
            price="Free"
            actionText="Register"
          />
          <PricingCard
            title="Subscribe"
            description="Subscribe to convert more documents"
            features={[]}
            price=""
            actionText="Register"
            highlighted
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;