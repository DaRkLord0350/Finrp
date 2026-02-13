'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

interface FormData {
  businessName: string;
  email: string;
  address: string;
  industry: string;
  businessType: string;
  annualTurnover: string;
  hasEmployees: boolean;
  numberOfEmployees: string;
}

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Services',
  'Real Estate',
  'Education',
  'Hospitality',
  'Other',
];

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Private Limited',
  'Public Limited',
  'LLP',
  'Other',
];

export default function BusinessProfileOnboarding() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    email: '',
    address: '',
    industry: '',
    businessType: '',
    annualTurnover: '',
    hasEmployees: false,
    numberOfEmployees: '',
  });

  // Protect this page - only accessible to authenticated users
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }

    if (formData.hasEmployees && !formData.numberOfEmployees) {
      newErrors.numberOfEmployees = 'Please specify the number of employees';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/business-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          numberOfEmployees: formData.hasEmployees ? formData.numberOfEmployees : null,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save business profile');
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Welcome! Let's Set Up Your Business Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            We need some information about your business to personalize your experience and provide better insights.
          </p>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <Input
              label="Business Name *"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="e.g., Acme Corporation"
              disabled={isLoading}
            />
            {errors.businessName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.businessName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              label="Business Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@business.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Business Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Business Street, City, State, Country"
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.address && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select an industry</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.industry}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Business Type *
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.businessType}</p>
            )}
          </div>

          {/* Annual Turnover */}
          <div>
            <Input
              label="Annual Turnover (Optional)"
              type="number"
              value={formData.annualTurnover}
              onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
              placeholder="e.g., 500000"
              disabled={isLoading}
            />
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter in your local currency</p>
          </div>

          {/* Has Employees */}
          <div className="flex items-center">
            <input
              id="hasEmployees"
              type="checkbox"
              checked={formData.hasEmployees}
              onChange={(e) => handleInputChange('hasEmployees', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="hasEmployees" className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              My business has employees
            </label>
          </div>

          {/* Number of Employees */}
          {formData.hasEmployees && (
            <div>
              <Input
                label="Number of Employees *"
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                placeholder="e.g., 10"
                disabled={isLoading}
              />
              {errors.numberOfEmployees && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.numberOfEmployees}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/sign-in')}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                  <span className="ml-2">Setting up...</span>
                </div>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            You can update this information anytime from your dashboard settings.
          </p>
        </form>
      </Card>
    </div>
  );
}
