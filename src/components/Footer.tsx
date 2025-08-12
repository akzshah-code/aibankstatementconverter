
import React from 'react';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToFaq: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToPrivacy, onNavigateToTerms, onNavigateToAbout, onNavigateToFaq }) => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} AI Bank Statement Converter. All rights reserved.
        </p>
        <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-2 order-1 md:order-2">
            <button type="button" onClick={onNavigateToAbout} aria-label="Open About page" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              About
            </button>
            <button type="button" onClick={onNavigateToTerms} aria-label="Open Terms of Service page" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Terms
            </button>
            <button type="button" onClick={onNavigateToPrivacy} aria-label="Open Privacy Policy page" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Privacy
            </button>
            <button type="button" onClick={onNavigateToFaq} aria-label="Open FAQ page" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              FAQ
            </button>
            <button type="button" onClick={() => alert('Coming soon!')} aria-label="Open Blog" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Blog
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
