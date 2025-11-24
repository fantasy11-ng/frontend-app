'use client';

import Image from 'next/image';

interface AuthLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AuthLogo({ className = '', width = 124, height = 78 }: AuthLogoProps) {
  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <Image
        src="/images/AuthLogo.png"
        alt="Fantasyfi Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}

