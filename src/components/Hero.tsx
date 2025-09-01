
import Converter from './Converter';
import { ConversionResult } from '../lib/types';

interface HeroProps {
  onConversionComplete: (result: ConversionResult) => void;
}

const Hero = ({ onConversionComplete }: HeroProps) => {
  return (
    <section id="convert" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight mb-4">
            Convert Bank Statements to Excel in Seconds
          </h1>
          <p className="text-lg md:text-xl text-brand-gray mb-8">
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