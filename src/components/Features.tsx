import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center border border-gray-200">
    <div className="text-primary text-4xl mb-4 inline-block">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-secondary">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const featuresData = [
    {
      icon: 'fa-shield-alt',
      title: 'Security First',
      description: 'Your privacy is paramount. PDF unlocking happens entirely in your browser, and uploaded statements for conversion are not stored on our servers after processing.'
    },
    {
      icon: 'fa-crosshairs',
      title: 'Uncompromising Accuracy',
      description: "Leveraging Google's state-of-the-art Gemini AI, we strive for the highest level of accuracy in data extraction, ensuring you can trust the numbers you work with."
    },
    {
      icon: 'fa-lightbulb',
      title: 'Radical Simplicity',
      description: "We've designed our tool to be incredibly intuitive. A clean interface and a straightforward process mean you can go from PDF to Excel with just a few clicks."
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Principles</h2>
          <p className="text-lg text-secondary mt-2">Security, accuracy, and simplicity are at the heart of everything we do.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
