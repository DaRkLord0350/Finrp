'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <DashboardLayout currentPath="/dashboard/overview" navigate={navigate} onLogout={handleLogout} />
  );
}
