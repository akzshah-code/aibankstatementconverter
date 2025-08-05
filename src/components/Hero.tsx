import React from 'react';
import Converter from './Converter';

interface HeroProps {
  onTryDemo: () => void;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(({ onTryDemo }, ref) => {
  return (
    <section ref={ref} id="convert" className="bg-gray-50 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Convert Bank Statements to Excel in Seconds
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto md:mx-0 mb-8">
              Upload your PDF or scanned image and get a clean, ready-to-use Excel or CSV file instantly. No manual formatting needed.
            </p>
            <div className="flex justify-center md:justify-start items-center space-x-4">
              <a href="#convert" className="px-8 py-4 bg-primary text-white rounded-md font-semibold text-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105">
                Convert Now
              </a>
              <button 
                onClick={onTryDemo} 
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <i className="far fa-play-circle mr-2"></i>
                Try Demo
              </button>
            </div>
          </div>
          
          {/* Right Column: Converter Component */}
          <div className="w-full">
            <Converter />
          </div>

        </div>
      </div>
    </section>
  );
});

export default Hero;