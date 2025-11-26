import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { StatCardData } from '../types';
import PageHeader from './PageHeader';

const StatCard: React.FC<StatCardData> = ({ icon, label, value, change, changeColor }) => (
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

const FinancePage: React.FC = () => {
  const stats: StatCardData[] = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, label: 'Annual Turnover', value: '₹50,00,000', change: '+15% from last year', changeColor: 'text-green-600' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>, label: 'Monthly Cash Flow', value: '₹4,23,000', change: 'Average monthly inflow', changeColor: 'text-slate-500' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, label: 'Outstanding Loans', value: '₹25,00,000', change: 'Across 2 active loans', changeColor: 'text-slate-500' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: 'Credit Score', value: '750', change: 'Excellent rating', changeColor: 'text-green-600' },
  ];

  const loanProducts = [
      { bank: 'SBI Working Capital Loan', interest: '9.25% - 11.50%', maxAmount: '₹1 Crore', processingFee: '0.50%', tag: 'Recommended', tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
      { bank: 'HDFC Equipment Loan', interest: '8.75% - 10.25%', maxAmount: '₹50 Lakhs', processingFee: '1.00%', tag: 'Popular', tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
      { bank: 'ICICI MSME Loan', interest: '10.50% - 12.00%', maxAmount: '₹75 Lakhs', processingFee: '0.75%', tag: 'Fast Approval', tagColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-900">
      <PageHeader
        title="Finance & Loan Management"
        subtitle="Manage finances, apply for loans, and track financial health"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
      >
          <Button variant="primary">
              + Apply for Loan
          </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
            {/* Loan Applications */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Loan Applications</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">Working Capital</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">₹50.0L - State Bank of India</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Rate: 9.5% | Tenure: 60m</p>
                        </div>
                        <div className="text-right">
                           <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">Under Review</span>
                           <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">Equipment Purchase</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">₹25.0L - HDFC Bank</p>
                        </div>
                         <div className="text-right">
                           <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Approved</span>
                           <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                        </div>
                    </div>
                </div>
            </Card>

             {/* Recommended Loans */}
             <Card>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Recommended Loan Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loanProducts.map(loan => (
                        <div key={loan.bank} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold dark:text-slate-200">{loan.bank}</h4>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${loan.tagColor}`}>{loan.tag}</span>
                            </div>
                            <div className="flex-grow mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                <p><strong>Interest Rate:</strong> {loan.interest}</p>
                                <p><strong>Max Amount:</strong> {loan.maxAmount}</p>
                                <p><strong>Processing Fee:</strong> {loan.processingFee}</p>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full mt-4">Apply Now</Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            {/* CMA Report */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">CMA Report Generator</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Generate Credit Monitoring Analysis reports.</p>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Latest CMA Report</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Generated: March 15, 2024</p>
                    <div className="flex justify-between items-baseline mt-3">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Annual Turnover</p>
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">₹50L</p>
                        </div>
                         <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Profit Margin</p>
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">18%</p>
                        </div>
                         <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Financial Health</p>
                            <p className="font-bold text-lg text-green-600 dark:text-green-400">Good</p>
                        </div>
                    </div>
                </div>
                <Button variant="primary" className="w-full mt-4">Download</Button>
            </Card>

             {/* Cash Flow */}
            <Card>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Cash Flow Analysis</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Monthly Inflows</h4>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between"><span>Sales Revenue</span> <span className="font-medium">₹4,50,000</span></div>
                            <div className="flex justify-between"><span>Other Income</span> <span className="font-medium">₹25,000</span></div>
                        </div>
                        <hr className="my-2 border-slate-200 dark:border-slate-700"/>
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100"><span>Total Inflow</span> <span>₹4,75,000</span></div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Monthly Outflows</h4>
                         <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between"><span>Operating Expenses</span> <span className="font-medium">₹2,80,000</span></div>
                            <div className="flex justify-between"><span>Loan EMIs</span> <span className="font-medium">₹45,000</span></div>
                            <div className="flex justify-between"><span>Other Expenses</span> <span className="font-medium">₹27,000</span></div>
                        </div>
                        <hr className="my-2 border-slate-200 dark:border-slate-700"/>
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100"><span>Total Outflow</span> <span>₹3,52,000</span></div>
                    </div>
                </div>
                <div className="mt-4 bg-green-100 dark:bg-green-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">Net Cash Flow</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">₹1,23,000</p>
                </div>
            </Card>

        </div>
       </div>
    </div>
  );
};

export default FinancePage;