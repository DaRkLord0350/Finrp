'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function VirtualCfoPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <DashboardLayout 
      currentPath="/dashboard/virtual-cfo" 
      navigate={navigate} 
      onLogout={handleLogout} 
    />
  );
}
