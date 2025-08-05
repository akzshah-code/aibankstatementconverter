import React from 'react';

const BankLogo: React.FC<{ alt: string, src: string }> = ({ alt, src }) => (
    <img src={src} alt={alt} className="h-10 md:h-12 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300" />
);


const BankSupport: React.FC = () => {
  const banks = [
    { alt: 'HDFC Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg' },
    { alt: 'ICICI Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
    { alt: 'State Bank of India Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg' },
    { alt: 'Axis Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg' },
    { alt: 'Yes Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Yes_Bank_SVG_Logo.svg' },
    { alt: 'IDFC First Bank Logo', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_of_IDFC_First_Bank.svg' },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Built for Indian Banks</h2>
        <p className="text-lg text-secondary mb-12">Supports all major Indian bank formats with more added every month.</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16">
            {banks.map(bank => <BankLogo key={bank.alt} alt={bank.alt} src={bank.src} />)}
        </div>
      </div>
    </section>
  );
};

export default BankSupport;