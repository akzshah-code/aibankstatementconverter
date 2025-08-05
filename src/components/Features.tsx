import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
    <div className="text-primary text-4xl mb-4 inline-block">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-secondary">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const featuresData = [
    { icon: 'fa-robot', title: 'AI-Powered PDF to Excel', description: 'Our AI accurately extracts tables and data from any PDF format.' },
    { icon: 'fa-camera', title: 'Scanned Image Support', description: 'Convert even scanned bank statements into editable Excel files with OCR.' },
    { icon: 'fa-layer-group', title: 'Bulk Upload', description: 'Save time by converting multiple bank statements at once.' },
    { icon: 'fa-cogs', title: 'Smart Auto-Categorization', description: 'Automatically categorize transactions to save you manual effort.' },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for speed, accuracy, and seamless integration.</h2>
          <p className="text-lg text-secondary mt-2">The ultimate toolkit for your financial data.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;