'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordRequirements } from '@/components/auth';
import { useRequestPasswordReset, useResetPassword } from '@/lib/api/hooks/useAuth';
import AuthLogo from '@/components/auth/AuthLogo';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');
  
  const [email, setEmail] = useState(emailFromUrl || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isRequestMode] = useState(!token);
  
  const requestPasswordReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();

  // Password requirements
  const passwordRequirements = [
    { label: 'Lowercase characters', met: /[a-z]/.test(newPassword) },
    { label: 'Uppercase characters', met: /[A-Z]/.test(newPassword) },
    { label: 'Numbers', met: /[0-9]/.test(newPassword) },
    { label: '14 characters minimum', met: newPassword.length >= 14 },
    { label: 'Special characters', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (newPassword && value && newPassword !== value) {
      setPasswordMatchError('The password does not match. Try again');
    } else {
      setPasswordMatchError('');
    }
  };

  // Handle password reset request (step 1: request email)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Incorrect email address format');
      return;
    }

    try {
      await requestPasswordReset.mutateAsync({ email });
      // Success toast is handled in the hook
    } catch (error) {
      // Error toast is handled in the hook
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (axiosError?.response?.status === 404) {
        setEmailError('Email address not found');
      }
    }
  };

  // Handle password reset (step 2: reset with token)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMatchError('');

    if (!email || !newPassword || !confirmPassword) {
      return;
    }

    if (!token) {
      setPasswordMatchError('Invalid reset token');
      return;
    }

    if (!allRequirementsMet) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMatchError('The password does not match. Try again');
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email,
        password: newPassword,
        token,
      });
      // Success toast is handled in the hook
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      // Error toast is handled in the hook
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (axiosError?.response?.status === 400) {
        setPasswordMatchError('Invalid or expired reset token');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='%23059669'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <AuthLogo />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {isRequestMode ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Reset password
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter your email address and we&apos;ll send you a password reset link.
              </p>

              <form onSubmit={handleRequestReset} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`text-[#070A11] w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {emailError && (
                    <p className="text-red-600 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                {/* Request Reset Button */}
                <button
                  type="submit"
                  disabled={requestPasswordReset.isPending}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    requestPasswordReset.isPending
                      ? 'bg-green-600 text-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {requestPasswordReset.isPending ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Reset password
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Email Field (read-only if from URL) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-[#070A11] w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                    placeholder="Enter your email address"
                    readOnly={!!emailFromUrl}
                  />
                </div>

                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <PasswordRequirements requirements={passwordRequirements} />
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        passwordMatchError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordMatchError && (
                    <p className="text-red-600 text-sm mt-1">{passwordMatchError}</p>
                  )}
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  disabled={!allRequirementsMet || !!passwordMatchError || resetPassword.isPending}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    allRequirementsMet && !passwordMatchError && !resetPassword.isPending
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  {resetPassword.isPending ? 'Resetting...' : 'Reset password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthLogo />
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

