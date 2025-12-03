'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HomePage from '@/components/HomePage';
// import LoginPage from '@/components/LoginPage';
import DashboardLayout from '@/components/DashboardLayout';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const handleLogin = () => {
  //   setIsAuthenticated(true);
  //   router.push('/dashboard');
  // };

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted) return null;

  return isAuthenticated ? (
    <DashboardLayout currentPath="/dashboard/overview" navigate={navigate} onLogout={handleLogout} />
  ) : (
    <HomePage navigate={navigate} />
  );
}
