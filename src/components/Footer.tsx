const Footer = () => {
  const footerLinks = [
    { href: '#about', label: 'About' },
    { href: '#terms', label: 'Terms' },
    { href: '#privacy', label: 'Privacy' },
    { href: '#faq', label: 'FAQ' },
    { href: '#api', label: 'API' },
    { href: '#blog', label: 'Blog' },
  ];

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BankConverts.com. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
