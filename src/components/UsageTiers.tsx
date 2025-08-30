const TierCard = ({ title, description, features, price, actionText, actionLink }: {
  title: string;
  description: string;
  features: string[];
  price: string;
  actionText?: string;
  actionLink?: string;
}) => {
  const cardClasses = `border rounded-lg p-6 flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200`;

  return (
    <div className={cardClasses}>
      <div>
        <h3 className="text-xl font-semibold text-brand-dark">{title}</h3>
        <p className="text-sm text-brand-gray mt-1">{description}</p>
      </div>
      
      <div className="flex-grow mt-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-brand-dark text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <p className="text-2xl font-bold text-brand-dark">{price}</p>
        {actionText && actionLink && (
          <a href={actionLink} className="text-brand-blue font-semibold hover:underline">
            {actionText}
          </a>
        )}
      </div>
    </div>
  );
};


const UsageTiers = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Anonymous Tier */}
          <TierCard 
            title="Anonymous"
            description="Anonymous conversions with no need to sign up"
            features={['1 page every 24 hours']}
            price="Free" 
          />
          {/* Registered Tier */}
          <TierCard 
            title="Registered"
            description="Registration is free"
            features={['5 pages every 24 hours']}
            price="Free"
            actionText="Register"
            actionLink="#register"
          />
          {/* Subscribe Tier */}
          <div className="border-2 border-brand-blue rounded-lg p-6 flex flex-col h-full shadow-lg bg-white">
            <h3 className="text-xl font-semibold text-brand-dark">Subscribe</h3>
            <p className="text-sm text-brand-gray mt-1 flex-grow">Subscribe to convert more documents</p>
            <div className="mt-auto pt-6 text-right">
              <a href="#pricing" className="text-brand-blue font-semibold hover:underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageTiers;
