'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764267172/Logo_x03fz0.png"
              alt="Fantasyfi Logo"
              width={120}
              height={56}
              className="object-contain h-14 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-white hover:text-gray-300 text-sm font-medium transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white hover:text-gray-300 text-sm font-medium transition-colors">
              How it works
            </Link>
            <Link href="#prizes" className="text-white hover:text-gray-300 text-sm font-medium transition-colors">
              Prizes
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 border border-gray-300 text-[#FFFFFF] text-sm font-medium rounded-full transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-[#4AA96C] hover:bg-[#4AA96C] text-[#FFFFFF] text-sm font-medium rounded-full transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

