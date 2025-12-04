'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import LoginPage from '@/components/LoginPage';

export default function Login() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If user is already signed in, redirect to dashboard
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  const handleLogin = () => {
    router.push('/dashboard');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted || (isLoaded && user)) return null;

  return <LoginPage onLogin={handleLogin} navigate={navigate} />;
}
