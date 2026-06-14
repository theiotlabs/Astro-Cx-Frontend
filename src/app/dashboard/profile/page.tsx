'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { User, Mail, Phone, Calendar, MapPin, Globe, HelpCircle, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../../services/auth';
import useAuthStore from '../../../store/useAuthStore';

const profileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phone: zod.string().min(10, 'Phone number must be at least 10 digits'),
  date_of_birth: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of Birth must be in YYYY-MM-DD format'),
  gender: zod.enum(['male', 'female', 'other']),
  city: zod.string().min(2, 'City must be at least 2 characters'),
  country: zod.string().min(2, 'Country must be at least 2 characters'),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      date_of_birth: '',
      gender: 'male',
      city: '',
      country: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile();
        // Set form fields
        setValue('name', profileData.name || '');
        setValue('phone', profileData.phone || '');
        setValue('date_of_birth', profileData.date_of_birth || '1990-01-01');
        setValue('gender', (profileData.gender as any) || 'male');
        setValue('city', profileData.city || '');
        setValue('country', profileData.country || 'India');
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError('Could not load profile details. Please try reloading.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const updatedProfile = await authService.updateProfile(values);
      // Update local storage and Zustand state
      updateUser({
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        date_of_birth: updatedProfile.date_of_birth,
        gender: updatedProfile.gender,
        city: updatedProfile.city,
        state: updatedProfile.state,
      });
      setSuccess(true);
      // Automatically hide success alert after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please check validation rules.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal details. This information is used to calculate your Lo Shu Grid report accuracy.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl flex items-center space-x-3 text-sm animate-pulse-subtle">
          <CheckCircle2 className="h-5 w-5" />
          <span>Profile details updated and synchronized successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User className="h-5 w-5" />
              </span>
              <input
                type="text"
                {...register('name')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                placeholder="Jane Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-danger font-medium mt-1">{errors.name.message}</p>}
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-400">Email Address (Login ID)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-slate-400">Email addresses are unique and cannot be modified.</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">WhatsApp Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Phone className="h-5 w-5" />
              </span>
              <input
                type="tel"
                {...register('phone')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+919876543210"
              />
            </div>
            {errors.phone && <p className="text-xs text-danger font-medium mt-1">{errors.phone.message}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                {...register('date_of_birth')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.date_of_birth && <p className="text-xs text-danger font-medium mt-1">{errors.date_of_birth.message}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <HelpCircle className="h-5 w-5" />
              </span>
              <select
                {...register('gender')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.gender && <p className="text-xs text-danger font-medium mt-1">{errors.gender.message}</p>}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">City</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <MapPin className="h-5 w-5" />
              </span>
              <input
                type="text"
                {...register('city')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Mumbai"
              />
            </div>
            {errors.city && <p className="text-xs text-danger font-medium mt-1">{errors.city.message}</p>}
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Country</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Globe className="h-5 w-5" />
              </span>
              <input
                type="text"
                {...register('country')}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="India"
              />
            </div>
            {errors.country && <p className="text-xs text-danger font-medium mt-1">{errors.country.message}</p>}
          </div>

        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center py-2.5 px-6 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
