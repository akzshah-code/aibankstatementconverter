import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    { href: '#', text: 'API Docs' },
    { href: '#', text: 'About' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Privacy' },
    { href: '#', text: 'Blog' },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          {footerLinks.map(link => (
            <a key={link.text} href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-300">
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