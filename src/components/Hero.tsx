

import Converter from './Converter';
import { ConversionResult } from '../lib/types';

interface HeroProps {
  onConversionComplete: (result: ConversionResult) => void;
}

const Hero = ({ onConversionComplete }: HeroProps) => {
  return (
    <section id="convert" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark leading-tight mb-4">
            Convert <span className="text-brand-blue">Bank Statements</span> to <span className="text-brand-green">Excel</span> in Seconds
          </h1>
          <p className="text-base md:text-lg text-brand-gray mb-8">
            Upload your PDF or scanned image and get a clean, ready-to-use Excel or CSV file instantly. No manual formatting needed.
          </p>
        </div>
        <div className="mt-8">
            <Converter onConversionComplete={onConversionComplete} />
        </div>
      </div>
    </section>
  );
};

export default Hero;