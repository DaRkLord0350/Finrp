import React, { useState, useEffect } from 'react';
import { BusinessProfile, RetailData } from '../../types';
import { getRetailData } from '../../services/mockApi';
import Card from '../ui/Card';
import PageHeader from '../PageHeader';
import useTheme from '../../hooks/useTheme';
import ThemeToggle from '../ui/ThemeToggle';
import Skeleton from '../ui/Skeleton';
import LineChart from '../charts/LineChart';

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

const RetailDashboard: React.FC<DashboardProps> = ({ businessProfile }) => {
  const [theme, toggleTheme] = useTheme();
  const [data, setData] = useState<RetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getRetailData().then(res => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Retail & Trading Dashboard"
        subtitle="Your personalized overview for sales and inventory."
      >
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {data.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Sales Trend (Last 30 Days)</h3>
             <LineChart data={data.salesOverTime} color="#3b82f6" />
        </Card>
        <div className="space-y-8">
          <Card>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                  {data.topProducts.map(product => (
                      <div key={product.sku} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{product.name}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{product.sales} units</span>
                      </div>
                  ))}
              </div>
          </Card>
          <Card>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                  {data.recentOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">{order.customer}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{order.time}</p>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{order.amount.toLocaleString()}</span>
                      </div>
                  ))}
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetailDashboard;