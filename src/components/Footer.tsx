import React from 'react';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToPrivacy, onNavigateToTerms, onNavigateToAbout }) => {
  const handleLinkClick = (handler: () => void) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handler();
  };

  const footerLinks = [
    { text: 'API Docs', handler: () => alert('Coming soon!') },
    { text: 'About', handler: onNavigateToAbout },
    { text: 'Terms', handler: onNavigateToTerms },
    { text: 'Privacy', handler: onNavigateToPrivacy },
    { text: 'Blog', handler: () => alert('Coming soon!') },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          {footerLinks.map(link => (
            <a key={link.text} href="#" onClick={handleLinkClick(link.handler)} className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer">
              {link.text}
            </a>
          ))}
        </div>
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} AI Bank Statement Converter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;