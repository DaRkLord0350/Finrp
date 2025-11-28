'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginPage from '@/components/LoginPage';

export default function Login() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    router.push('/dashboard');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted) return null;

  return <LoginPage onLogin={handleLogin} navigate={navigate} />;
}
