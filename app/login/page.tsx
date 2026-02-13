'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import LoginPage from '@/components/LoginPage';
import Spinner from '@/components/ui/Spinner';

export default function Login() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If user is already signed in, check onboarding status
    if (isLoaded && user) {
      const checkAndRedirect = async () => {
        try {
          const response = await fetch('/api/business-profile');
          const data = await response.json();

          if (!data.exists) {
            // User needs to complete onboarding first
            router.push('/onboarding/business-profile');
          } else {
            // User has completed onboarding, proceed to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // On error, still redirect to dashboard
          router.push('/dashboard');
        }
      };

      checkAndRedirect();
    }
  }, [user, isLoaded, router]);

  const handleLogin = () => {
    // Login is handled by Clerk, the useEffect above will handle the redirect
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted || (isLoaded && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return <LoginPage onLogin={handleLogin} navigate={navigate} />;
}
