'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function VirtualCfoPage() {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
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
