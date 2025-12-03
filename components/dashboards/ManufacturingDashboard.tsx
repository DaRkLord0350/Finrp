import React, { useState, useEffect } from 'react';
import { BusinessProfile, ManufacturingData } from '../../types';
import { getManufacturingData } from '../../services/mockApi';
import Card from '../ui/Card';
import PageHeader from '../PageHeader';
import useTheme from '../../hooks/useTheme';
import ThemeToggle from '../ui/ThemeToggle';
import Skeleton from '../ui/Skeleton';
import BarChart from '../charts/BarChart';

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
        case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Halted': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const ManufacturingDashboard: React.FC<DashboardProps> = ({ businessProfile }) => {
  void businessProfile;
  const [theme, toggleTheme] = useTheme();
  const [data, setData] = useState<ManufacturingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getManufacturingData().then(res => {
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

  // Dual bar chart needs special data prep
  const productionChartData = data.productionOutput.flatMap(p => [
      { name: p.name, value: p.actual, type: 'Actual' },
      { name: p.name, value: p.target, type: 'Target' }
  ]);


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Manufacturing Dashboard"
        subtitle="Your personalized overview for production and inventory."
      >
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {data.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Live Production Orders</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Order ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {data.productionOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{order.id}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{order.product}</td>
                                <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{order.efficiency}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Inventory Levels (Tons)</h3>
            <BarChart data={data.inventoryLevels} unit="" color="#f59e0b" />
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Daily Production Output (Units)</h3>
            <div className="relative">
                {/* Custom Bar chart for comparison */}
                <div className="flex justify-around h-64 items-end gap-2 p-4">
                    {data.productionOutput.map(item => (
                        <div key={item.name} className="flex-1 flex flex-col items-center justify-end">
                            <div className="flex items-end w-full max-w-20">
                                <div className="bg-emerald-500 w-1/2 rounded-t" style={{height: `${(item.actual/700)*100}%`}}></div>
                                <div className="bg-slate-300 dark:bg-slate-600 w-1/2 rounded-t" style={{height: `${(item.target/700)*100}%`}}></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{item.name}</span>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-center space-x-4 text-xs mt-2">
                    <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></span>Actual</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-sm mr-1"></span>Target</div>
                </div>
            </div>
         </Card>
         <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Upcoming Maintenance</h3>
            <div className="space-y-3">
                 {data.maintenanceSchedule.map(task => (
                    <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex justify-between items-center">
                       <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{task.machine}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{task.task}</p>
                       </div>
                       <span className="font-bold text-orange-600 dark:text-orange-400">{task.dueDate}</span>
                    </div>
                ))}
            </div>
         </Card>
      </div>
    </div>
  );
};

export default ManufacturingDashboard;