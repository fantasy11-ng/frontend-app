'use client';

import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  userInitials?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false, 
  userInitials = 'FF' 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'My Team', href: '/my-team' },
    { name: 'League', href: '/league' },
    { name: 'Ranking', href: '/ranking' },
    { name: 'Predictor', href: '/predictor' },
    { name: 'Stats', href: '/stats' },
    { name: 'News', href: '/news' },
    { name: 'Prizes', href: '/prizes' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-white text-xl font-bold">Fantasy11</span>
              <span className="text-white text-xs -mt-1">FOOTBALL</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-yellow-400' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - User icons and mobile menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Profile Icons */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {userInitials}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated user icons */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-white hover:text-gray-300 block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive ? 'text-yellow-400' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
