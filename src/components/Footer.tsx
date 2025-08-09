import React from 'react';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToFaq: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToPrivacy, onNavigateToTerms, onNavigateToAbout, onNavigateToFaq }) => {
  const handleLinkClick = (handler: () => void) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handler();
  };

  const footerLinks = [
    { text: 'API Docs', handler: () => alert('Coming soon!') },
    { text: 'About', handler: onNavigateToAbout },
    { text: 'Terms', handler: onNavigateToTerms },
    { text: 'Privacy', handler: onNavigateToPrivacy },
    { text: 'FAQ', handler: onNavigateToFaq },
    { text: 'Blog', handler: () => alert('Coming soon!') },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} AI Bank Statement Converter. All rights reserved.
        </p>
        <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-2 order-1 md:order-2">
          {footerLinks.map(link => (
            <a
              key={link.text}
              href="#"
              onClick={handleLinkClick(link.handler)}
              className={`text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer ${
                link.text === 'API Docs' ? 'border border-gray-500 rounded px-3 py-1 hover:border-white' : ''
              }`}
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;