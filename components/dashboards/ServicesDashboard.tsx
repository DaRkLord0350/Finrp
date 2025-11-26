import React, { useState, useEffect, useMemo } from 'react';
import { BusinessProfile, ServicesData } from '../../types';
import { getServicesData } from '../../services/mockApi';
import Card from '../ui/Card';
import PageHeader from '../PageHeader';
import useTheme from '../../hooks/useTheme';
import ThemeToggle from '../ui/ThemeToggle';
import Skeleton from '../ui/Skeleton';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';

interface DashboardProps {
  businessProfile: BusinessProfile;
}

const StatCard: React.FC<any> = ({ icon, label, value, change, changeColor }) => (
  <Card className="flex-1">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">{value}</p>
        {change && <p className={`text-sm font-medium mt-2 ${changeColor}`}>{change}</p>}
      </div>
      <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
        {icon}
      </div>
    </div>
  </Card>
);

const getStatusClass = (status: string) => {
    switch (status) {
        case 'On Track': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'At Risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const ServicesDashboard: React.FC<DashboardProps> = ({ businessProfile }) => {
  const [theme, toggleTheme] = useTheme();
  const [data, setData] = useState<ServicesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getServicesData().then(res => {
      setData(res);
      setIsLoading(false);
    });
  }, []);
  
  const upcomingDeadlines = useMemo(() => {
    if (!data) return [];
    return data.projects
      .filter(p => p.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, [data]);


  if (isLoading || !data) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-80 rounded-xl lg:col-span-2" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Services Dashboard"
        subtitle="Your personalized overview for managing projects and clients."
      >
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {data.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Revenue by Client (Last 90 Days)</h3>
            <BarChart data={data.revenueByClient} unit="₹" />
        </Card>
        <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Billable Hours Breakdown</h3>
            <PieChart data={data.billableHours} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Active Projects Status</h3>
            <div className="space-y-4">
                {data.projects.filter(p => p.status !== 'Completed').map(project => (
                    <div key={project.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{project.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{project.client} - Due: {project.deadline}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(project.status)}`}>{project.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
                 {upcomingDeadlines.map(project => (
                    <div key={project.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                       <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{project.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{project.client}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-red-600 dark:text-red-400">{project.deadline}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                </p>
                            </div>
                       </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ServicesDashboard;