import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { StatCardData, Invoice, InvoiceStatus } from '../types';
import { getInvoices, saveInvoice } from '../services/mockApi';
import InvoiceCreator from './InvoiceCreator';
import AIAssistant from './AIAssistant';
import InvoicePDFPreview from './InvoicePDFPreview';
import Skeleton from './ui/Skeleton';
import PageHeader from './PageHeader';
import Input from './ui/Input';

const StatCard = React.memo<StatCardData>(({ icon, label, value, change, changeColor }) => (
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
));

const getStatusClass = (status: InvoiceStatus) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

const InvoiceTableSkeleton: React.FC = () => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">
                            <Skeleton className="h-4 w-20" />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-20 rounded-md" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

type SortableKey = keyof Invoice | 'amount';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
    key: SortableKey;
    direction: SortDirection;
}

const SortIndicator: React.FC<{ direction?: SortDirection }> = ({ direction }) => {
    if (!direction) return null;
    return (
        <span className="ml-1 text-slate-500 dark:text-slate-400">
            {direction === 'ascending' ? '▲' : '▼'}
        </span>
    );
};


const BillingPage: React.FC = () => {
    const [view, setView] = useState<'list' | 'creator'>('list');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
    const [filter, setFilter] = useState<InvoiceStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'issueDate', direction: 'descending' });
    
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);
    const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(null);

    useEffect(() => {
        if (view === 'list') {
            setIsLoading(true);
            getInvoices().then(data => {
                setInvoices(data);
                setIsLoading(false);
            });
        }
    }, [view]);
    
    const calculateTotal = useCallback((invoice: Invoice) => {
        return invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0) * 1.18; // with tax
    }, []);

    const processedInvoices = useMemo(() => {
        let filtered = [...invoices];

        // Apply search filter
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(invoice =>
                invoice.id.toLowerCase().includes(lowercasedQuery) ||
                invoice.customer.name.toLowerCase().includes(lowercasedQuery)
            );
        }

        // Apply status filter
        if (filter !== 'All') {
            filtered = filtered.filter(inv => inv.status === filter);
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue: string | number | Date;
                let bValue: string | number | Date;
                
                if (sortConfig.key === 'amount') {
                    aValue = calculateTotal(a);
                    bValue = calculateTotal(b);
                } else if (sortConfig.key === 'customer') {
                    aValue = a.customer.name;
                    bValue = b.customer.name;
                } else if (sortConfig.key === 'issueDate' || sortConfig.key === 'dueDate') {
                    aValue = new Date(a[sortConfig.key]);
                    bValue = new Date(b[sortConfig.key]);
                } else {
                    aValue = a[sortConfig.key as keyof Invoice] as string;
                    bValue = b[sortConfig.key as keyof Invoice] as string;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [invoices, filter, searchQuery, sortConfig, calculateTotal]);

    const requestSort = (key: SortableKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleCreateNew = () => {
        setSelectedInvoice(undefined);
        setView('creator');
    };
    
    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setView('creator');
    }

    const handleSaveInvoice = async (invoice: Invoice) => {
        await saveInvoice(invoice);
        setView('list');
    };
    
    const handleDraftReminder = (invoice: Invoice) => {
        setReminderInvoice(invoice);
        setIsAiAssistantOpen(true);
    };
    
    const stats = useMemo(() => [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>, label: 'Total Outstanding', value: `₹${invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, i) => acc + calculateTotal(i), 0).toLocaleString()}`, change: `${invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length} invoices`, changeColor: 'text-slate-500' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Paid Last 30 Days', value: '₹21,000', change: 'from 1 invoice', changeColor: 'text-green-600' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Overdue Invoices', value: `${invoices.filter(i => i.status === 'Overdue').length}`, change: `Worth ₹${invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + calculateTotal(i), 0).toLocaleString()}`, changeColor: 'text-red-600' },
    ], [invoices, calculateTotal]);

    if (view === 'creator') {
        return <InvoiceCreator onSave={handleSaveInvoice} onCancel={() => setView('list')} invoice={selectedInvoice} />;
    }

    const renderTableHeader = () => {
        const headers: { key: SortableKey; label: string }[] = [
            { key: 'id', label: 'Invoice ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'issueDate', label: 'Issue Date' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
        ];

        return (
             <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                    {headers.map(({ key, label }) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase whitespace-nowrap">
                            <button onClick={() => requestSort(key)} className="flex items-center font-medium uppercase tracking-wider">
                                {label}
                                {sortConfig.key === key && <SortIndicator direction={sortConfig.direction} />}
                            </button>
                        </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Actions</th>
                </tr>
            </thead>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-900">
            {isAiAssistantOpen && <AIAssistant invoiceForReminder={reminderInvoice} onClose={() => { setIsAiAssistantOpen(false); setReminderInvoice(null); }} />}
            {invoiceToPreview && <InvoicePDFPreview invoice={invoiceToPreview} onClose={() => setInvoiceToPreview(null)} />}
            
            <PageHeader
                title="Billing & Invoicing"
                subtitle="Manage, create, and track all your invoices."
            >
                <Button variant="primary" onClick={handleCreateNew}>
                   + Create New Invoice
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>

            <Card className="!p-0">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Invoice History</h2>
                         <Input
                            placeholder="Search by ID or Customer..."
                            className="w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        />
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                        {(['All', 'Paid', 'Pending', 'Overdue', 'Draft'] as const).map(f => (
                            <Button key={f} variant={filter === f ? 'primary' : 'outline'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
                        ))}
                    </div>
                </div>
                {isLoading ? <InvoiceTableSkeleton /> : 
                invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            {renderTableHeader()}
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {processedInvoices.length > 0 ? processedInvoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">{invoice.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200">{invoice.customer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{invoice.issueDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{invoice.dueDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">₹{calculateTotal(invoice).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>{invoice.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(invoice)}>View/Edit</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setInvoiceToPreview(invoice)} title="Download PDF">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </Button>
                                            {invoice.status === 'Overdue' && (
                                                <Button size="sm" variant="secondary" onClick={() => handleDraftReminder(invoice)}>Draft Reminder</Button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No Invoices Match Your Search</h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search query or filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No Invoices Yet</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Looks like you haven't created any invoices.</p>
                        <div className="mt-6">
                            <Button variant="primary" onClick={handleCreateNew}>Create First Invoice</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default BillingPage;