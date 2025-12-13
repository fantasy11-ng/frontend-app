'use client';

import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();  

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'My Team', href: '/my-team' },
    { name: 'League', href: '/league' },
    { name: 'Ranking', href: '/ranking' },
    { name: 'Stats', href: '/stats' },
    { name: 'Predictor', href: '/predictor' },
    { name: 'News', href: '/news' },
    { name: 'Prizes', href: '/prizes' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764267172/Logo_x03fz0.png"
              alt="Fantasyfi Logo"
              width={120}
              height={56}
              className="object-contain h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
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

          {/* Right side - User dropdown and mobile menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <UserDropdown />
            ) : (
              <>
                {/* Unauthenticated user - show sign in link */}
                <Link
                  href="/sign-in"
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">Sign In</span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
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
          <div className="lg:hidden">
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
