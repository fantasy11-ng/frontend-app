'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit, Check, User as UserIcon, UploadCloud, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useUploadProfileImage } from '@/lib/api/hooks/useAuth';
import type { User } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import { Spinner } from '../common/Spinner';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl: string;
}

const extractNameParts = (profile?: User | null): Pick<ProfileFormState, 'firstName' | 'lastName'> => {
  if (!profile) {
    return { firstName: '', lastName: '' };
  }

  if (profile.fullName) {
    const parts = profile.fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0] ?? '', lastName: '' };
    }
    const firstName = parts.shift() ?? '';
    const lastName = parts.join(' ');
    return { firstName, lastName };
  }

  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
  };
};

export default function ProfileTab() {
  const { user, isLoading, getUserInitials } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadProfileImage = useUploadProfileImage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hydrateForm = useCallback((profile?: User | null) => {
    if (!profile) return;

    const { firstName, lastName } = extractNameParts(profile);

    setFormData({
      firstName,
      lastName,
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      profileImageUrl: profile.profileImageUrl ?? '',
    });
  }, []);

  useEffect(() => {
    hydrateForm(user);
  }, [hydrateForm, user]);

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const trimmedFirst = formData.firstName.trim();
    const trimmedLast = formData.lastName.trim();
    const fullName = `${trimmedFirst} ${trimmedLast}`.replace(/\s+/g, ' ').trim();

    const payload = {
      fullName: fullName || undefined,
      phone: formData.phone.trim(),
      profileImageUrl: formData.profileImageUrl.trim(),
    };

    try {
      const updatedUser = await updateProfile.mutateAsync(payload);
      if (updatedUser) {
        hydrateForm(updatedUser);
        setIsEditing(false);
      }
    } catch {
      // Error handled via toast in hook
    }
  };

  const handleCancel = () => {
    hydrateForm(user);
    setIsEditing(false);
  };

  const isSaving = updateProfile.isPending;
  const isUploadingImage = uploadProfileImage.isPending;

  const profileInitials = getUserInitials();
  const profileImageUrl = formData.profileImageUrl || user?.profileImageUrl || '';

  const handleImageButtonClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${maxSizeInMB}MB`);
      return;
    }

    try {
      const { url } = await uploadProfileImage.mutateAsync(file);
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: url,
      }));
    } catch {
      // Error feedback handled within uploadProfileImage hook
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev,
      profileImageUrl: '',
    }));
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={24} className="text-[#4AA96C]" />
        </div>
      ) : !user ? (
        <div className="py-12 text-center text-gray-600">
          Unable to load profile information. Please sign in again.
        </div>
      ) : (
        <>
          {/* User Overview Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {/* Profile Picture */}
              <div className="relative">
                {profileImageUrl ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={profileImageUrl}
                      alt={user.fullName ?? 'Profile picture'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-2xl font-bold">
                    {profileInitials || <UserIcon className="w-8 h-8" />}
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={handleImageButtonClick}
                      className="flex items-center space-x-1 px-3 py-1 bg-white/90 text-xs font-medium text-gray-900 rounded-full shadow-md"
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Spinner size={24} className="text-[#4AA96C]" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Change</span>
                        </>
                      )}
                    </button>
                    {profileImageUrl && !isUploadingImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="ml-2 p-1 bg-white/90 text-gray-900 rounded-full shadow-md"
                        aria-label="Remove profile image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelected}
                />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : user.fullName || 'Fantasy Manager'}
                </h2>
                {formData.email && <p className="text-gray-600 mt-1">{formData.email}</p>}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className={`text-[#070A11] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className={`text-[#070A11] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="text-[#070A11] w-full px-4 py-2 border rounded-lg border-gray-200 bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`text-[#070A11] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>

            {/* Profile Image URL */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile image URL
              </label>
              <input
                type="url"
                value={formData.profileImageUrl}
                onChange={(e) => handleChange('profileImageUrl', e.target.value)}
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                className={`text-[#070A11] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div> */}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Spinner size={24} className="text-[#4AA96C]" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
