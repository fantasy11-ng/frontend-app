'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff, #ecfdf5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>

            {/* Error Message */}
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '1rem',
              }}
            >
              Oops! Something went wrong
            </h1>
            <p
              style={{
                color: '#4b5563',
                marginBottom: '2rem',
                lineHeight: 1.6,
                fontSize: '1rem',
              }}
            >
              We encountered an unexpected error. Don&apos;t worry, your data is safe. 
              Please try again, and if the problem persists, contact our support team for help.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Go Home
              </button>
            </div>

            {/* Contact Support */}
            <div
              style={{
                marginTop: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Still having trouble?
              </p>
              <a
                href="mailto:contact@fantasy11.ng"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#10b981',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Contact Support
              </a>
            </div>

            {/* Error ID for debugging */}
            {error.digest && (
              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

