'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 200, height = 80 }: LogoProps) {
  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Fantasyfi Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}

