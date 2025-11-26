import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import { StatCardData, BusinessProfile, CrmServicesData, CrmRetailData, CrmManufacturingData, Alert, AiSuggestion, Metric } from '../types';
import PageHeader from './PageHeader';
import { getCrmServicesData, getCrmRetailData, getCrmManufacturingData } from '../services/mockApi';
import Skeleton from './ui/Skeleton';
import MetricCard from './ui/MetricCard';
import Table from './ui/Table';

// --- SHARED COMPONENTS ---
const ProfilePrompt: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8">
        <Card className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Set Up Your Business Profile</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">To view your industry-specific CRM, first set up your business profile.</p>
        </Card>
    </div>
);

const StatCard: React.FC<StatCardData> = ({ icon, label, value, change, changeColor }) => (
  <Card className="flex-1">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
        {change && <p className={`text-xs font-medium ${changeColor}`}>{change}</p>}
      </div>
    </div>
  </Card>
);

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <Card>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            {icon && <span className="mr-3 text-emerald-500">{icon}</span>}
            {title}
        </h3>
        {children}
    </Card>
);

const AlertsCard: React.FC<{ alerts: Alert[] }> = ({ alerts }) => (
    <Section title="Key Alerts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}>
        <div className="space-y-3">
            {alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg flex items-start ${alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                    <span className={`text-xl mr-3 ${alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>{alert.severity === 'critical' ? '🔴' : '⚠️'}</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{alert.message}</p>
                </div>
            ))}
        </div>
    </Section>
);

const AiSuggestionsCard: React.FC<{ suggestions: AiSuggestion[] }> = ({ suggestions }) => (
    <Section title="AI Suggestions" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09z" /></svg>}>
        <div className="space-y-4">
            {suggestions.map((s, i) => (
                <div key={i}>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{s.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                </div>
            ))}
        </div>
    </Section>
);

const DashboardSkeleton: React.FC = () => (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Skeleton className="h-64 rounded-xl" />
             <Skeleton className="h-64 rounded-xl" />
             <Skeleton className="h-64 rounded-xl" />
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Skeleton className="h-48 rounded-xl" />
             <Skeleton className="h-48 rounded-xl" />
        </div>
    </div>
);

// --- INDUSTRY-SPECIFIC CRM VIEWS ---

const ServicesCrmView: React.FC = () => {
    const [data, setData] = useState<CrmServicesData | null>(null);
    useEffect(() => { getCrmServicesData().then(setData); }, []);

    if (!data) return <DashboardSkeleton />;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <PageHeader title="CRM for Services" subtitle="Manage your client relationships and sales pipeline." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.financialSummary.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Section title="Sales Funnel"><div className="grid grid-cols-2 gap-4">{data.salesFunnel.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Client Relations"><div className="grid grid-cols-2 gap-4">{data.clientRelations.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Team Performance"><div className="space-y-4">{data.teamPerformance.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AlertsCard alerts={data.alerts} />
                <AiSuggestionsCard suggestions={data.aiSuggestions} />
            </div>
        </div>
    );
};

const RetailCrmView: React.FC = () => {
    const [data, setData] = useState<CrmRetailData | null>(null);
    useEffect(() => { getCrmRetailData().then(setData); }, []);

    if (!data) return <DashboardSkeleton />;
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <PageHeader title="CRM for Retail & Trading" subtitle="Understand customer behavior and drive sales." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.financialSummary.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Section title="Customer Behavior"><div className="grid grid-cols-2 gap-4">{data.customerBehavior.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Sales Performance"><div className="space-y-4">{data.salesPerformance.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Loyalty Program"><div className="space-y-4">{data.loyalty.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AlertsCard alerts={data.alerts} />
                <AiSuggestionsCard suggestions={data.aiSuggestions} />
            </div>
        </div>
    );
};

const ManufacturingCrmView: React.FC = () => {
    const [data, setData] = useState<CrmManufacturingData | null>(null);
    useEffect(() => { getCrmManufacturingData().then(setData); }, []);

    if (!data) return <DashboardSkeleton />;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <PageHeader title="CRM for Manufacturing" subtitle="Manage B2B accounts, orders, and the sales pipeline." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.financialSummary.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Section title="Sales Pipeline"><div className="space-y-4">{data.salesPipeline.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Customer Relations"><div className="space-y-4">{data.customerRelations.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
                <Section title="Account Management"><div className="space-y-4">{data.accountManagement.map(m => <MetricCard key={m.label} {...m} />)}</div></Section>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AlertsCard alerts={data.alerts} />
                <AiSuggestionsCard suggestions={data.aiSuggestions} />
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
interface CrmPageProps {
  businessProfile: BusinessProfile | null;
}

const CrmPage: React.FC<CrmPageProps> = ({ businessProfile }) => {
    if (!businessProfile) {
        return <ProfilePrompt />;
    }

    switch (businessProfile.industry) {
        case 'Services':
            return <ServicesCrmView />;
        case 'Retail & Trading':
            return <RetailCrmView />;
        case 'Manufacturing':
            return <ManufacturingCrmView />;
        default:
             return <div className="p-8">Error: Invalid business industry selected.</div>
    }
};

export default CrmPage;