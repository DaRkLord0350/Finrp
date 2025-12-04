'use client';

import React, { useState, useEffect } from 'react';
import { NavItemProps, BusinessProfile } from '../types';
import useTheme from '../hooks/useTheme';
import Logo from './ui/Logo';
import { useUser } from '@clerk/nextjs';

// Import page components
import DashboardPage from './DashboardPage';
import BillingPage from './BillingPage';
import CrmPage from './CrmPage';
import ErpPage from './ErpPage';
import FinancePage from './FinancePage';
import CompliancePage from './CompliancePage';
import VirtualCFOPage from './VirtualCFOPage'; // Renamed from AIAdvisorPage
import AIBusinessAdvisorChat from './AIBusinessAdvisorChat'; // New component for the chat modal

interface DashboardLayoutProps {
  currentPath: string;
  navigate: (path: string) => void;
  onLogout: () => void;
}

// Icons for navigation
const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const BillingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CrmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg>;
const ErpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const FinanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ComplianceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const VirtualCFOIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.5A2.25 2.25 0 006 20.25z" /></svg>;
const AIAdvisorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>;


const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active, navigate, badge }) => (
    <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200 ${
        active
            ? 'bg-emerald-500 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        <span className="ml-3 flex-1">{label}</span>
        {badge && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badge.color}`}>{badge.text}</span>}
    </button>
);

const navItems: Omit<NavItemProps, 'active' | 'navigate'>[] = [
    { path: '/dashboard/overview', label: 'Overview', icon: <OverviewIcon /> },
    { path: '/dashboard/billing', label: 'Billing', icon: <BillingIcon /> },
    { path: '/dashboard/crm', label: 'CRM', icon: <CrmIcon /> },
    { path: '/dashboard/erp', label: 'ERP', icon: <ErpIcon /> },
    { path: '/dashboard/finance', label: 'Finance', icon: <FinanceIcon /> },
    { path: '/dashboard/compliance', label: 'Compliance', icon: <ComplianceIcon /> },
    { path: '/dashboard/virtual-cfo', label: 'Virtual CFO', icon: <VirtualCFOIcon />, badge: {text: 'AI', color: 'bg-blue-400 text-blue-900'} },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentPath, navigate, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdvisorChatOpen, setIsAdvisorChatOpen] = useState(false);
    const { user, isLoaded } = useUser();
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(() => {
        try {
            if (typeof window === 'undefined') return null;
            const savedProfile = localStorage.getItem('businessProfile');
            if (!savedProfile) return null;
            // Validate JSON before parsing
            if (savedProfile.trim().length === 0) {
                localStorage.removeItem('businessProfile');
                return null;
            }
            return JSON.parse(savedProfile);
        } catch (e) {
            console.warn("Failed to parse business profile from localStorage, clearing it", e);
            try {
                localStorage.removeItem('businessProfile');
            } catch {}
            return null;
        }
    });

    useEffect(() => {
        try {
            if (businessProfile) {
                localStorage.setItem('businessProfile', JSON.stringify(businessProfile));
            } else {
                localStorage.removeItem('businessProfile');
            }
        } catch (e) {
            console.error("Failed to save business profile to localStorage", e);
        }
    }, [businessProfile]);
    
    const pageProps = { businessProfile, setBusinessProfile, navigate };

    let content;
    switch (currentPath) {
        case '/dashboard/overview':
            content = <DashboardPage {...pageProps} />;
            break;
        case '/dashboard/billing':
            content = <BillingPage />;
            break;
        case '/dashboard/crm':
            content = <CrmPage businessProfile={businessProfile} />;
            break;
        case '/dashboard/erp':
            content = <ErpPage businessProfile={businessProfile} />;
            break;
        case '/dashboard/finance':
            content = <FinancePage />;
            break;
        case '/dashboard/compliance':
            content = <CompliancePage {...pageProps} />;
            break;
        case '/dashboard/virtual-cfo':
            content = <VirtualCFOPage businessProfile={businessProfile} navigate={navigate} />;
            break;
        default:
            content = <DashboardPage {...pageProps}/>;
    }
    
    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-700">
                 <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard/overview')}>
                    <Logo />
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">Finrp</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.path}
                        {...item}
                        active={currentPath === item.path}
                        navigate={navigate}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                 <div className="flex items-center">
                    <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=10b981&color=fff`}
                        alt={user?.fullName || 'User'} 
                    />
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
                        </p>
                    </div>
                 </div>
                 <button onClick={onLogout} className="w-full mt-4 text-left flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                 </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* AI Advisor Chat Modal */}
            {isAdvisorChatOpen && <AIBusinessAdvisorChat onClose={() => setIsAdvisorChatOpen(false)} />}
            
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {sidebarContent}
                </div>
                <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                        {sidebarContent}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <button onClick={() => setSidebarOpen(true)} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    {content}
                     {/* AI Advisor Floating Action Button */}
                     {businessProfile && (
                        <button
                            onClick={() => setIsAdvisorChatOpen(true)}
                            className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-110 flex items-center justify-center"
                            aria-label="Open AI Business Advisor"
                        >
                            <AIAdvisorIcon />
                        </button>
                     )}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;