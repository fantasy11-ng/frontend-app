'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[120px] font-bold text-[#800000] leading-none mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[#070A11] mb-3">
          Page Not Found
        </h2>
        <p className="text-[#656E81] mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full border border-[#D4D7DD] bg-white text-sm font-medium text-[#070A11] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#4AA96C] text-sm font-medium text-white hover:bg-[#3c8b58] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

