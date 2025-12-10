'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useUpdatePassword } from '@/lib/api/hooks/useAuth';
import toast from 'react-hot-toast';

interface PasswordRequirements {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  specialChars: boolean;
  minLength: boolean;
}

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const updatePassword = useUpdatePassword();

  const validatePassword = (password: string): PasswordRequirements => {
    return {
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 14
    };
  };

  const requirements = validatePassword(newPassword);
  const allRequirementsMet = Object.values(requirements).every(req => req === true);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleChangePassword = async () => {
    if (!allRequirementsMet) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    try {
      await updatePassword.mutateAsync({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      // Error handled by toast in hook
    }
  };

  return (
    <div>
      <div className="max-w-2xl space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-[#070A11] w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className={`text-[#070A11] w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent ${
                newPassword && !allRequirementsMet
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="mt-3 space-y-2">
              <div className={`flex items-center space-x-2 text-sm ${
                requirements.lowercase ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirements.lowercase ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>Lowercase characters</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${
                requirements.uppercase ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirements.uppercase ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>Uppercase characters</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${
                requirements.numbers ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirements.numbers ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>Numbers</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${
                requirements.minLength ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirements.minLength ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>14 characters minimum</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${
                requirements.specialChars ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirements.specialChars ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>Special characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className={`text-[#070A11] w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent ${
                confirmPassword && !passwordsMatch
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            disabled={
              !allRequirementsMet || !passwordsMatch || !currentPassword || updatePassword.isPending
            }
            className={`px-6 py-2 rounded-lg transition-colors ${
              allRequirementsMet && passwordsMatch && currentPassword && !updatePassword.isPending
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-green-300 text-white cursor-not-allowed'
            }`}
          >
            {updatePassword.isPending ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
