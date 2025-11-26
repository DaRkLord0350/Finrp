import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { StatCardData, BusinessProfile, ComplianceTask } from '../types';
import Spinner from './ui/Spinner';
import PaymentModal from './PaymentModal';
import ComplianceTaskCard from './ComplianceTaskCard';
import CompanyDocumentsCard from './CompanyDocumentsCard';
import PageHeader from './PageHeader';

interface PageProps {
    businessProfile: BusinessProfile | null;
    setBusinessProfile: (profile: BusinessProfile | null) => void;
}

// --- HELPER COMPONENTS ---

const StatCard: React.FC<StatCardData> = ({ icon, label, value, change, changeColor }) => (
  <Card className="flex-1 animate-fadeInUp">
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

const SkeletonLoader: React.FC = () => (
    <div className="lg:col-span-2 space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                    </div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                </div>
            </Card>
        ))}
    </div>
);


// --- MOCK DATABASE ---

const COMPLIANCE_DATABASE: { [key: string]: Omit<ComplianceTask, 'status'> } = {
    'GST_FILING': { id: 'gst-1', title: 'GST Return Filing - GSTR-3B', description: 'GSTR-3B is a monthly self-declaration to be filed by a registered dealer. It contains a summary of supplies made, input tax credit claimed, and net tax payable.', dueDate: '2024-04-20', estimatedAmount: 550, priority: 'High' },
    'TDS_FILING': { id: 'tds-1', title: 'TDS Return Filing - Q4 FY23-24', description: 'Filing of Tax Deducted at Source (TDS) returns for the final quarter of the financial year. This is mandatory for all businesses that have deducted tax at source.', dueDate: '2024-05-31', estimatedAmount: 1200, priority: 'High' },
    'ITR_FILING': { id: 'itr-1', title: 'Income Tax Return Filing', description: 'Annual filing of income tax returns to the government, declaring income, expenses, and tax liability.', dueDate: '2024-07-31', estimatedAmount: 3500, priority: 'High' },
    'ROC_AOC4': { id: 'roc-1', title: 'ROC Annual Filing - Form AOC-4', description: 'Filing of annual financial statements with the Registrar of Companies (ROC). It provides a view of the company\'s financial health.', dueDate: '2024-06-29', estimatedAmount: 2500, priority: 'Medium' },
    'ROC_MGT7': { id: 'roc-2', title: 'ROC Annual Filing - Form MGT-7', description: 'Filing of the annual return with the Registrar of Companies (ROC), containing details of the company\'s shareholders, directors, etc.', dueDate: '2024-07-15', estimatedAmount: 2000, priority: 'Medium' },
    'PF_FILING': { id: 'pf-1', title: 'Provident Fund (PF) Return', description: 'Monthly filing of PF returns, detailing employee and employer contributions towards the provident fund.', dueDate: '2024-04-15', estimatedAmount: 800, priority: 'Medium' },
    'ESI_FILING': { id: 'esi-1', title: 'ESI Return Filing', description: 'Filing of returns for the Employees\' State Insurance (ESI) scheme, which provides medical and cash benefits to employees.', dueDate: '2024-05-11', estimatedAmount: 600, priority: 'Low' },
};

// --- BUSINESS PROFILE SETUP COMPONENT ---

interface BusinessProfileSetupProps {
    onSave: (profile: BusinessProfile) => void;
    onClose: () => void;
    initialProfile: BusinessProfile | null;
}

const BusinessProfileSetup: React.FC<BusinessProfileSetupProps> = ({ onSave, onClose, initialProfile }) => {
    const [profile, setProfile] = useState<BusinessProfile>(initialProfile || {
        businessType: 'Private Limited Company',
        industry: 'Services',
        annualTurnover: '20 Lakh - 1 Crore',
        hasEmployees: true,
        numberOfEmployees: 10,
    });

    const handleSave = () => {
        onSave(profile);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
            <Card className="w-full max-w-lg transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Tell us about your business</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold">&times;</button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Provide a few details to get a personalized list of your compliance requirements.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
                        <select value={profile.businessType} onChange={e => setProfile({...profile, businessType: e.target.value as any})} className="block w-full px-4 py-2 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                            <option>Sole Proprietorship</option>
                            <option>Partnership</option>
                            <option>Private Limited Company</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                        <select value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value as any})} className="block w-full px-4 py-2 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                            <option>Services</option>
                            <option>Manufacturing</option>
                            <option>Retail & Trading</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Turnover</label>
                        <select value={profile.annualTurnover} onChange={e => setProfile({...profile, annualTurnover: e.target.value as any})} className="block w-full px-4 py-2 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                            <option>&lt; 20 Lakh</option>
                            <option>20 Lakh - 1 Crore</option>
                            <option>&gt; 1 Crore</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Do you have employees?</label>
                        <div className="flex items-center space-x-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={profile.hasEmployees} 
                                    onChange={e => {
                                        const newHasEmployees = e.target.checked;
                                        setProfile({
                                            ...profile, 
                                            hasEmployees: newHasEmployees,
                                            numberOfEmployees: newHasEmployees ? profile.numberOfEmployees || 1 : 0 
                                        });
                                    }} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-600 peer-focus:ring-2 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">{profile.hasEmployees ? 'Yes' : 'No'}</span>
                            </label>
                            
                            {profile.hasEmployees && (
                                <div className="flex items-center space-x-2 flex-1 animate-fadeIn">
                                    <label htmlFor="employee-count" className="text-sm font-medium text-slate-700 dark:text-slate-300">How many?</label>
                                    <input 
                                        type="number" 
                                        id="employee-count"
                                        value={profile.numberOfEmployees}
                                        onChange={e => setProfile({ ...profile, numberOfEmployees: parseInt(e.target.value, 10) || 0 })}
                                        className="block w-24 px-3 py-1.5 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                        min="1"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} variant="primary">Save Profile & Get Compliances</Button>
                </div>
            </Card>
        </div>
    );
};

// --- MAIN COMPLIANCE PAGE COMPONENT ---

const CompliancePage: React.FC<PageProps> = ({ businessProfile, setBusinessProfile }) => {
    const [tasks, setTasks] = useState<ComplianceTask[]>([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    
    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [taskToPay, setTaskToPay] = useState<ComplianceTask | null>(null);
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);
    
    const generateApplicableTasks = useCallback((profile: BusinessProfile) => {
        setIsLoadingTasks(true);
        // Simulate API call
        setTimeout(() => {
            const applicableTasks: ComplianceTask[] = [];
            applicableTasks.push({ ...COMPLIANCE_DATABASE['ITR_FILING'], status: 'Pending' });
            applicableTasks.push({ ...COMPLIANCE_DATABASE['TDS_FILING'], status: 'Pending' });

            if (profile.annualTurnover !== '< 20 Lakh') {
                applicableTasks.push({ ...COMPLIANCE_DATABASE['GST_FILING'], status: 'Overdue' }); // Set as overdue for demo
            }
            if (profile.businessType === 'Private Limited Company') {
                applicableTasks.push({ ...COMPLIANCE_DATABASE['ROC_AOC4'], status: 'Pending' });
                applicableTasks.push({ ...COMPLIANCE_DATABASE['ROC_MGT7'], status: 'Pending' });
            }
            if (profile.hasEmployees) {
                applicableTasks.push({ ...COMPLIANCE_DATABASE['PF_FILING'], status: 'Completed' }); // Set one as completed for demo
                applicableTasks.push({ ...COMPLIANCE_DATABASE['ESI_FILING'], status: 'Pending' });
            }
            setTasks(applicableTasks);
            setIsLoadingTasks(false);
        }, 1500);
    }, []);

    useEffect(() => {
        if (businessProfile) {
            generateApplicableTasks(businessProfile);
        } else {
            setTasks([]);
        }
    }, [businessProfile, generateApplicableTasks]);

    const handleSaveProfile = (profile: BusinessProfile) => {
        setBusinessProfile(profile);
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setTasks(prevTasks => {
                const pendingOrOverdue = prevTasks.filter(t => t.status === 'Pending' || t.status === 'Overdue');
                if (pendingOrOverdue.length > 0) {
                    const taskToUpdate = pendingOrOverdue[Math.floor(Math.random() * pendingOrOverdue.length)];
                    return prevTasks.map(t => t.id === taskToUpdate.id ? { ...t, status: 'Completed' } : t);
                }
                return prevTasks;
            });
            setLastSynced(new Date());
            setIsSyncing(false);
        }, 2500);
    };
    
    const handleOpenPaymentModal = (task: ComplianceTask) => {
        setTaskToPay(task);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        if (taskToPay) {
            setTasks(prevTasks => prevTasks.map(t => t.id === taskToPay.id ? {...t, status: 'Completed'} : t));
        }
        setIsPaymentModalOpen(false);
        setTaskToPay(null);
    };

    const stats = useMemo((): StatCardData[] => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const overdue = tasks.filter(t => t.status === 'Overdue').length;
        return [
            { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, label: 'Total Tasks', value: `${total}`, change: `${pending} due this month`, changeColor: 'text-slate-500' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Completed', value: `${completed}`, change: 'This fiscal year', changeColor: 'text-green-600' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Pending', value: `${pending}`, change: 'Require attention', changeColor: 'text-orange-600' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>, label: 'Overdue', value: `${overdue}`, change: 'Immediate action needed', changeColor: 'text-red-600' },
        ];
    }, [tasks]);
    

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-900">
            {isProfileModalOpen && <BusinessProfileSetup onClose={() => setIsProfileModalOpen(false)} onSave={handleSaveProfile} initialProfile={businessProfile} />}
            {isPaymentModalOpen && taskToPay && <PaymentModal task={taskToPay} onClose={() => setIsPaymentModalOpen(false)} onPaymentSuccess={handlePaymentSuccess} />}
            
            <PageHeader
                title="Compliance Management"
                subtitle={businessProfile ? 'Your automated compliance dashboard.' : 'Setup your profile to get a personalized compliance list.'}
            >
                {businessProfile && (
                     <Button variant="outline" onClick={() => setIsProfileModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Edit Profile
                    </Button>
                )}
            </PageHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
            
            {!businessProfile ? (
                 <Card className="text-center py-12 animate-fadeInUp">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Get Started with Compliance</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set up your business profile to see your personalized compliance tasks.</p>
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => setIsProfileModalOpen(true)}>Setup Business Profile</Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {isLoadingTasks ? <SkeletonLoader /> : (
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="animate-fadeInUp anim-delay-200">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Upcoming Deadlines</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Last synced: {lastSynced ? lastSynced.toLocaleString() : 'Never'}</p>
                                    </div>
                                    <Button variant="primary" onClick={handleSync} disabled={isSyncing} className="mt-3 sm:mt-0">
                                        {isSyncing ? <Spinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                                        <span className="ml-2">{isSyncing ? 'Syncing...' : 'Sync with Portals'}</span>
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <ComplianceTaskCard key={task.id} task={task} onPayNow={handleOpenPaymentModal} />
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                    <div className="space-y-8">
                         <CompanyDocumentsCard />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompliancePage;
