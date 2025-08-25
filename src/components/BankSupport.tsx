const BankSupport = () => {
  const banks = [
    { name: 'HDFC Bank', logoUrl: 'https://via.placeholder.com/120x40?text=HDFC+Bank' },
    { name: 'ICICI Bank', logoUrl: 'https://via.placeholder.com/120x40?text=ICICI+Bank' },
    { name: 'Axis Bank', logoUrl: 'https://via.placeholder.com/120x40?text=AXIS+Bank' },
    { name: 'Yes Bank', logoUrl: 'https://via.placeholder.com/120x40?text=YES+Bank' },
    { name: 'IDFC First Bank', logoUrl: 'https://via.placeholder.com/120x40?text=IDFC+FIRST' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">Built for Indian Banks</h2>
        <p className="text-brand-gray mb-12 max-w-2xl mx-auto">
          Supports all major Indian bank formats with more added every month.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-12">
          {banks.map((bank) => (
            <div key={bank.name} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
               <img src={bank.logoUrl} alt={`${bank.name} logo`} className="h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankSupport;
