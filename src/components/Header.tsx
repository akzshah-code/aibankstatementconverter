import React, { useState } from 'react';

interface HeaderProps {
  onShowPricingPage: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToUnlock: () => void;
  onNavigateToConvert: () => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onShowPricingPage, onNavigateToLogin, onNavigateToRegister, onNavigateToUnlock, onNavigateToConvert, onNavigateHome
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to wrap navigation functions to also close the menu
  const handleLinkClick = (handler: () => void) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handler();
    setIsMenuOpen(false);
  };
  
  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#" onClick={handleLinkClick(onNavigateHome)} className="flex items-center space-x-2 cursor-pointer">
          <i className="fas fa-robot text-primary text-3xl"></i>
          <span className="text-xl font-bold text-gray-800">AI Bank Statement Converter</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#convert" onClick={handleLinkClick(onNavigateToConvert)} className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">
            Convert
          </a>
          <a href="#unlock" onClick={handleLinkClick(onNavigateToUnlock)} className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">
            Unlock PDF
          </a>
          <a href="#pricing" onClick={handleLinkClick(onShowPricingPage)} className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">
            Pricing
          </a>
          <a href="#login" onClick={handleLinkClick(onNavigateToLogin)} className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">
            Login
          </a>
        </div>
        
        <div className="flex items-center">
           {/* Desktop Register Button */}
           <a 
             href="#register"
             onClick={handleLinkClick(onNavigateToRegister)}
             className="hidden md:inline-block px-6 py-2.5 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors duration-300 transform hover:scale-105"
           >
              Register
           </a>
           
           {/* Mobile Menu Toggle */}
           <div className="md:hidden ml-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary focus:outline-none" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                  <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
         <div className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-4 flex flex-col items-start space-y-4">
              <a href="#convert" onClick={handleLinkClick(onNavigateToConvert)} className="text-gray-600 hover:text-primary font-medium">Convert</a>
              <a href="#unlock" onClick={handleLinkClick(onNavigateToUnlock)} className="text-gray-600 hover:text-primary font-medium">Unlock PDF</a>
              <a href="#pricing" onClick={handleLinkClick(onShowPricingPage)} className="text-gray-600 hover:text-primary font-medium">Pricing</a>
              <a href="#login" onClick={handleLinkClick(onNavigateToLogin)} className="text-gray-600 hover:text-primary font-medium">Login</a>
              <a 
                href="#register"
                onClick={handleLinkClick(onNavigateToRegister)}
                className="w-full text-center px-6 py-2.5 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors duration-300"
              >
                Register
              </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;