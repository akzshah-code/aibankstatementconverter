import React from 'react';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToFaq: () => void;
  onNavigateToApiDocs: () => void;
}

const navLinks = [
  { label: 'API Docs', onClick: (fn: FooterProps) => fn.onNavigateToApiDocs, bordered: true },
  { label: 'About', onClick: (fn: FooterProps) => fn.onNavigateToAbout },
  { label: 'Terms', onClick: (fn: FooterProps) => fn.onNavigateToTerms },
  { label: 'Privacy', onClick: (fn: FooterProps) => fn.onNavigateToPrivacy },
  { label: 'FAQ', onClick: (fn: FooterProps) => fn.onNavigateToFaq },
  { label: 'Blog', onClick: () => () => alert('Coming soon!') }
];

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} AI Bank Statement Converter. All rights reserved.
        </p>
        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-2">
          {navLinks.map(({ label, onClick, bordered }) => (
            <button
              key={label}
              type="button"
              onClick={onClick(props)}
              aria-label={`Open ${label} page`}
              className={`text-gray-300 hover:text-white transition duration-300 cursor-pointer ${bordered ? 'border border-gray-500 rounded px-3 py-1 hover:border-white' : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
