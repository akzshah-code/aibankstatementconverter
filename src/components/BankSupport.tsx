const BankSupport = () => {
 const banks = [
    { alt: 'HDFC Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg' },
    { alt: 'ICICI Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
    { alt: 'State Bank of India Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg' },
    { alt: 'Axis Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg' },
    { alt: 'Yes Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Yes_Bank_SVG_Logo.svg' },
    { alt: 'IDFC First Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_of_IDFC_First_Bank.svg' },
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
            <div key={bank.alt} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
               <img src={bank.src} alt={bank.alt} className="h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankSupport;