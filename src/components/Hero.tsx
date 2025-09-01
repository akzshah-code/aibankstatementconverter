
import { useState } from 'react';
import Converter from './Converter';
import DemoView from './DemoView';
import { ConversionResult } from '../lib/types';

interface HeroProps {
  onConversionComplete: (result: ConversionResult) => void;
}

const Hero = ({ onConversionComplete }: HeroProps) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section id="convert" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight mb-4">
              Convert Bank Statements to Excel in Seconds
            </h1>
            <p className="text-lg md:text-xl text-brand-gray mb-8">
              Upload your PDF or scanned image and get a clean, ready-to-use Excel or CSV file instantly. No manual formatting needed.
            </p>
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setShowDemo(true);
              }}
              className="inline-block bg-white text-brand-blue px-8 py-3 rounded-md font-semibold border border-brand-blue hover:bg-brand-blue-light transition-colors duration-200"
            >
              Try Demo
            </a>
          </div>
          <div>
            {showDemo ? <DemoView onExitDemo={() => setShowDemo(false)} /> : <Converter onConversionComplete={onConversionComplete} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;