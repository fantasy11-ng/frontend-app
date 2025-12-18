'use client';

import Image from 'next/image';
import Link from 'next/link';

interface AuthLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AuthLogo({ className = '', width = 124, height = 78 }: AuthLogoProps) {
  return (
    <Link href="/" className={`flex items-center justify-center mb-8 ${className}`}>
      <Image
        src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265434/AuthLogo_pg9i6q.png"
        alt="Fantasyfi Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
}

