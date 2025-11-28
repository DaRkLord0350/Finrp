'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function FinancePage() {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DashboardLayout 
      currentPath="/dashboard/finance" 
      navigate={navigate} 
      onLogout={handleLogout} 
    />
  );
}
