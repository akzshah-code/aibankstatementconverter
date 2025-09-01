const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-Powered Accuracy',
    description: 'Our advanced AI extracts transaction data with high precision, saving you hours of manual entry and reducing errors.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    ),
    title: 'Secure & Private',
    description: 'All processing happens in your browser. Your files are never uploaded or stored, ensuring your financial data remains confidential.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    title: 'Multiple Formats Supported',
    description: 'Effortlessly convert PDFs, JPGs, and PNGs into clean Excel (XLSX), CSV, or JSON files tailored for your workflow.',
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
            Why Choose BankConverts?
          </h2>
          <p className="mt-4 text-lg text-brand-gray max-w-2xl mx-auto">
            We focus on speed, security, and simplicity to provide the best conversion experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-50 p-8 rounded-lg text-center border border-gray-100 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-300">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-brand-blue rounded-full p-4">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">{feature.title}</h3>
              <p className="text-brand-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;