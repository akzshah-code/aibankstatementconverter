import { useState } from 'react';
import { User } from '../lib/types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

interface NavLink {
  href: string;
  label: string;
  isHighlighted?: boolean;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const guestLinks: NavLink[] = [
    { href: '#/', label: 'Convert' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blog', label: 'Blog' },
    { href: '#login', label: 'Login' },
  ];
  
  const userLinks: NavLink[] = [
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blog', label: 'Blog' },
    { href: '#bulk-convert', label: 'Bulk Convert' },
  ];

  const adminLinks: NavLink[] = [
    ...userLinks,
    { href: '#admin', label: 'Admin', isHighlighted: true },
  ];

  const navLinks = user ? (user.role === 'admin' ? adminLinks : userLinks) : guestLinks;

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/#" className="flex items-center">
              <img src="/logo.png" alt="BankConverts Logo" className="h-8 w-auto" />
              <div className="ml-3 flex flex-col justify-center">
                 <span className="font-bold text-xl leading-none">
                    <span className="text-brand-blue">Bank</span><span className="text-brand-green">Converts</span>
                 </span>
                 <span className="hidden md:block text-xs text-brand-gray leading-tight mt-0.5">Transform Statements. Unlock Data.</span>
              </div>
            </a>
          </div>

          {/* Right side container */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className={`transition-colors duration-200 ${link.isHighlighted ? 'text-brand-blue font-semibold' : 'text-gray-600 hover:text-brand-blue'}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            
            {/* Primary Action Button */}
            <div>
              {user ? (
                 <button onClick={onLogout} className="bg-gray-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200">
                  Logout
                </button>
              ) : (
                <a href="#register" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200">
                  Register
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">{link.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;