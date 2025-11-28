'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
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
