import React from 'react';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToFaq: () => void;
  onNavigateToApiDocs: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToPrivacy, onNavigateToTerms, onNavigateToAbout, onNavigateToFaq, onNavigateToApiDocs }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} AI Bank Statement Converter. All rights reserved.
        </p>
        <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-2 order-1 md:order-2">
            <a href="#" onClick={(e) => handleLinkClick(e, onNavigateToApiDocs)} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer border border-gray-500 rounded px-3 py-1 hover:border-white">
              API Docs
            </a>
            <a href="#" onClick={(e) => handleLinkClick(e, onNavigateToAbout)} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              About
            </a>
            <a href="#" onClick={(e) => handleLinkClick(e, onNavigateToTerms)} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Terms
            </a>
            <a href="#" onClick={(e) => handleLinkClick(e, onNavigateToPrivacy)} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Privacy
            </a>
            <a href="#" onClick={(e) => handleLinkClick(e, onNavigateToFaq)} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              FAQ
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
              Blog
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;