'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Spinner from '@/components/ui/Spinner';

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has completed onboarding
  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkOnboarding = async () => {
      try {
        const response = await fetch('/api/business-profile');
        const data = await response.json();

        if (!data.exists) {
          // User hasn't completed onboarding - redirect to onboarding page
          router.push('/onboarding/business-profile');
          return;
        }

        setIsCheckingOnboarding(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [isLoaded, user, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted || isCheckingOnboarding || (isLoaded && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout currentPath="/dashboard/overview" navigate={navigate} onLogout={handleLogout} />
  );
}
