import React from 'react';
import { Customer, Invoice, InvoiceStatus, ServicesData, RetailData, ManufacturingData, BusinessProfile, StatCardData, CrmServicesData, ErpServicesData, CrmRetailData, ErpRetailData, CrmManufacturingData, ErpManufacturingData, Alert, AiSuggestion } from '../types';

const customers: Customer[] = [
  { id: 'cust-001', name: 'Amit Patel', email: 'amit@example.com', address: '123 Tech Park, Bangalore' },
  { id: 'cust-002', name: 'Sunita Reddy', email: 'sunita@example.com', address: '456 IT Hub, Hyderabad' },
  { id: 'cust-003', name: 'Vikram Singh', email: 'vikram@example.com', address: '789 Business Bay, Mumbai' },
  { id: 'cust-004', name: 'Priya Sharma', email: 'priya@example.com', address: '101 Cyber City, Gurgaon' },
];

let invoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    customer: customers[0],
    issueDate: '2024-03-10',
    dueDate: '2024-03-25',
    items: [
      { id: 'item-1', description: 'Web Development Services', quantity: 40, rate: 500 },
      { id: 'item-2', description: 'Domain Name Registration (1 year)', quantity: 1, rate: 1000 },
    ],
    status: 'Paid',
    notes: 'Thank you for your business!',
  },
  {
    id: 'INV-2024-002',
    customer: customers[1],
    issueDate: '2024-03-15',
    dueDate: '2024-03-30',
    items: [
      { id: 'item-3', description: 'Steel Rods 12mm', quantity: 50, rate: 370 },
    ],
    status: 'Overdue',
    notes: 'Payment is overdue. Please settle at the earliest.',
  },
  {
    id: 'INV-2024-003',
    customer: customers[2],
    issueDate: '2024-04-01',
    dueDate: '2024-04-16',
    items: [
      { id: 'item-4', description: 'Consulting Services - March', quantity: 20, rate: 1600 },
    ],
    status: 'Pending',
  },
  {
    id: 'INV-2024-004',
    customer: customers[3],
    issueDate: '2024-04-05',
    dueDate: '2024-04-20',
    items: [
      { id: 'item-5', description: 'Graphic Design Package', quantity: 1, rate: 50000 },
    ],
    status: 'Draft',
  },
];

export const getInvoices = (): Promise<Invoice[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...invoices]), 1500));
};

export const getCustomers = (): Promise<Customer[]> => {
  return new Promise(resolve => setTimeout(() => resolve(customers), 500));
};

export const saveInvoice = (invoice: Invoice): Promise<Invoice> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const index = invoices.findIndex(inv => inv.id === invoice.id);
            if (index !== -1) {
                invoices[index] = invoice;
            } else {
                invoices.unshift(invoice);
            }
            resolve(invoice);
        }, 500);
    });
};

export const getNextInvoiceId = (): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const lastId = invoices.length > 0 ? parseInt(invoices[0].id.split('-')[2], 10) : 0;
            const nextId = `INV-2024-${String(lastId + 1).padStart(3, '0')}`;
            resolve(nextId);
        }, 100);
    });
};

// --- MOCK APIs for Overview Dashboards ---

const servicesData: ServicesData = {
    stats: [
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })), label: 'Active Projects', value: '8', change: '2 started this week', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })), label: 'Billable Hours (Month)', value: '320h', change: '+15h vs last month', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" })), label: 'Team Capacity', value: '85%', change: '3 members on leave', changeColor: 'text-slate-500' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })), label: 'Client Satisfaction', value: '96%', change: 'Excellent', changeColor: 'text-slate-500' },
    ],
    projects: [
        { id: 'PROJ-01', name: 'E-commerce Platform', client: 'RetailCo', status: 'On Track', deadline: '2024-05-30', profitability: 35 },
        { id: 'PROJ-02', name: 'Mobile App Dev', client: 'ConnectApp', status: 'At Risk', deadline: '2024-04-25', profitability: 15 },
        { id: 'PROJ-04', name: 'Cloud Migration', client: 'DataSafe Inc.', status: 'On Track', deadline: '2024-04-28', profitability: 25 },
        { id: 'PROJ-03', name: 'Brand Redesign', client: 'Priya Sharma', status: 'Completed', deadline: '2024-03-28', profitability: 40 },
    ],
    revenueByClient: [
        { name: 'Amit Patel', value: 21000 }, { name: 'Sunita Reddy', value: 32000 }, { name: 'Vikram Singh', value: 18500 }, { name: 'Priya Sharma', value: 50000 }, { name: 'Other', value: 45000 },
    ],
    billableHours: [
        { name: 'Billable', value: 320, color: '#10b981' },
        { name: 'Non-billable', value: 85, color: '#f59e0b' },
    ]
};

const retailData: RetailData = {
    stats: [
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" })), label: 'Today\'s Sales', value: '₹52,300', change: '+5% vs yesterday', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" })), label: 'Average Order Value', value: '₹1,250', change: '+₹50 vs last week', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" })), label: 'New Customers', value: '23', change: 'this week', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })), label: 'Low Stock Items', value: '5', change: 'Require reordering', changeColor: 'text-red-600' },
    ],
    topProducts: [
        { name: 'Handcrafted Leather Bag', sku: 'ACC-001', sales: 320 },
        { name: 'Organic Cotton T-Shirt', sku: 'APP-012', sales: 250 },
        { name: 'Artisan Coffee Beans', sku: 'FNB-003', sales: 180 },
    ],
    salesFunnel: [
        { name: 'Visitors', value: 5230 }, { name: 'Added to Cart', value: 870 }, { name: 'Reached Checkout', value: 510 }, { name: 'Purchased', value: 410 },
    ],
    salesOverTime: Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: 40000 + Math.random() * 25000 + (i * 500)
    })),
    recentOrders: [
        { id: 'ORD-9871', customer: 'Rina Mehta', amount: 1250, time: '2 min ago' },
        { id: 'ORD-9870', customer: 'Karan Verma', amount: 3400, time: '5 min ago' },
        { id: 'ORD-9869', customer: 'Sneha Desai', amount: 850, time: '12 min ago' },
    ]
};

const manufacturingData: ManufacturingData = {
    stats: [
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" })), label: 'Production Output (Today)', value: '1,500 units', change: '+2% vs yesterday', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })), label: 'QA Pass Rate', value: '99.2%', change: 'Above target', changeColor: 'text-green-600' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" })), label: 'Raw Material Inventory', value: '45 tons', change: 'Sufficient for 15 days', changeColor: 'text-slate-500' },
        { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })), label: 'Machine Downtime (Today)', value: '2 hours', change: 'Line 2 needs maintenance', changeColor: 'text-orange-600' },
    ],
    productionOrders: [
        { id: 'ORD-501', product: 'Steel Rods 12mm', status: 'In Progress', quantity: 5000, efficiency: 95 },
        { id: 'ORD-502', product: 'Metal Brackets', status: 'In Progress', quantity: 10000, efficiency: 82 },
        { id: 'ORD-499', product: 'Fastener Bolts', status: 'Completed', quantity: 25000, efficiency: 98 },
    ],
    inventoryLevels: [
        { name: 'Raw Steel', value: 45 }, { name: 'Finished Rods', value: 8 }, { name: 'Finished Brackets', value: 12 }, { name: 'Scrap Metal', value: 2 },
    ],
    productionOutput: [
        { name: 'Line 1', actual: 480, target: 500 },
        { name: 'Line 2', actual: 390, target: 450 },
        { name: 'Line 3', actual: 630, target: 600 },
    ],
    maintenanceSchedule: [
        { id: 'MAINT-101', machine: 'CNC Machine 2', task: 'Lubricant Change', dueDate: '2024-04-26' },
        { id: 'MAINT-102', machine: 'Stamping Press', task: 'Die Inspection', dueDate: '2024-04-28' },
    ]
};

export const getServicesData = (): Promise<ServicesData> => new Promise(resolve => setTimeout(() => resolve(servicesData), 1000));
export const getRetailData = (): Promise<RetailData> => new Promise(resolve => setTimeout(() => resolve(retailData), 1000));
export const getManufacturingData = (): Promise<ManufacturingData> => new Promise(resolve => setTimeout(() => resolve(manufacturingData), 1000));

// --- Mock API for Virtual CFO metrics ---
export const getMockMetricsForProfile = (profile: BusinessProfile): Promise<string> => {
    // ... (existing implementation)
    return new Promise(resolve => setTimeout(() => resolve(''), 300));
};

// --- NEW MOCK APIs for DETAILED ERP/CRM PAGES ---
const commonAlerts: Alert[] = [
    { severity: 'warning', message: 'Accounts receivable are 15% higher than last month.' },
    { severity: 'info', message: 'New compliance deadline for GST filing is approaching.' },
];
const commonSuggestions: AiSuggestion[] = [
    { title: 'Optimize Cash Flow', description: 'Review your top 5 highest outstanding invoices and send reminders.' },
    { title: 'Review Operating Expenses', description: 'Analyze last month\'s spending to identify potential cost savings.' },
];

// FIX: Added missing 'icon' property to StatCardData objects.
const mockFinancialSummary = (baseRevenue: number): StatCardData[] => [
    { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" })), label: 'Revenue (MTD)', value: `₹${(baseRevenue / 12).toLocaleString()}`, change: '+8% vs last month', changeColor: 'text-green-600' },
    { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" })), label: 'Profit Margin', value: '18%', change: '-1.2% vs last month', changeColor: 'text-red-600' },
    { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9A2.25 2.25 0 0 0 18.75 6.75h-1.5a3 3 0 0 0-6 0h-1.5A2.25 2.25 0 0 0 3 9v3" })), label: 'Cash Flow', value: `₹${(baseRevenue * 0.05).toLocaleString()}`, change: 'Healthy', changeColor: 'text-green-600' },
    { icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 6L3 12m18 0l.75-6M21 12H3m18 0a9 9 0 11-18 0 9 9 0 0118 0zM12 12V9" })), label: 'Working Capital Ratio', value: '1.6', change: 'Stable', changeColor: 'text-slate-500' },
];

export const getCrmServicesData = (): Promise<CrmServicesData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(8000000),
    salesFunnel: [
        { label: 'New Leads', value: '45', trend: '+10%', trendDirection: 'up' },
        { label: 'Proposals Sent', value: '25', trend: '+5%', trendDirection: 'up' },
        { label: 'Conversion Rate', value: '22%', trend: '-2%', trendDirection: 'down' },
        { label: 'Avg. Deal Size', value: '₹1,50,000', trend: '+₹12k', trendDirection: 'up' },
    ],
    clientRelations: [
        { label: 'Client Satisfaction (CSAT)', value: '4.5/5', trend: '+0.1', trendDirection: 'up' },
        { label: 'Net Promoter Score (NPS)', value: '52', trend: '+3', trendDirection: 'up' },
        { label: 'Client Retention Rate', value: '92%', trend: 'Stable', trendDirection: 'neutral' },
        { label: 'Avg. Response Time', value: '4.2 hrs', trend: '-0.5 hrs', trendDirection: 'up' },
    ],
    teamPerformance: [
        { label: 'Billable Utilization', value: '78%', progress: 78 },
        { label: 'Project Margin', value: '32%', progress: 32 },
        { label: 'Tasks Overdue', value: '8', trend: '+2', trendDirection: 'down' },
    ],
    alerts: [...commonAlerts, { severity: 'critical', message: 'Project "ConnectApp" is at risk of exceeding budget by 15%.' }],
    aiSuggestions: commonSuggestions,
}), 1200));

export const getErpServicesData = (): Promise<ErpServicesData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(8000000),
    operations: [
        { label: 'Billable Hours (Month)', value: '850 hrs', trend: '+50 hrs', trendDirection: 'up' },
        { label: 'SLA Adherence', value: '99.2%', progress: 99.2, trendDirection: 'up' },
        { label: 'Project Overrun', value: '8%', progress: 8, trendDirection: 'down' },
        { label: 'Resource Allocation', value: '91%', progress: 91, trendDirection: 'neutral' },
    ],
    projectManagement: {
        projects: [
            { id: 'PROJ-01', name: 'E-commerce Platform', status: 'On Track', profitability: 35, deadline: '2024-05-30' },
            { id: 'PROJ-02', name: 'Mobile App Dev', status: 'At Risk', profitability: 15, deadline: '2024-04-25' },
        ]
    },
    alerts: [{ severity: 'warning', message: 'Resource "Anjali" is over-allocated by 20% next week.' }],
    aiSuggestions: [{ title: 'Improve Project Profitability', description: 'Analyze the "Mobile App Dev" project for scope creep and unbilled hours.' }],
}), 1200));

export const getCrmRetailData = (): Promise<CrmRetailData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(12000000),
    customerBehavior: [
        { label: 'Footfall to Sale Rate', value: '28%', trend: '+2%', trendDirection: 'up' },
        { label: 'Avg. Basket Size', value: '4 items', trend: 'Stable', trendDirection: 'neutral' },
        { label: 'Customer Lifetime Value', value: '₹12,500', trend: '+₹800', trendDirection: 'up' },
        { label: 'Customer Acquisition Cost', value: '₹450', trend: '-₹50', trendDirection: 'up' },
    ],
    salesPerformance: [
        { label: 'Top Performing Category', value: 'Electronics' },
        { label: 'Upsell/Cross-sell Ratio', value: '15%', progress: 15 },
        { label: 'Avg. Daily Transactions', value: '210' },
    ],
    loyalty: [
        { label: 'Repeat Customer Rate', value: '42%', progress: 42 },
        { label: 'Loyalty Redemption Rate', value: '65%', progress: 65 },
    ],
    alerts: [{ severity: 'critical', message: 'Customer churn rate increased by 5% this month.' }],
    aiSuggestions: [{ title: 'Boost Customer Retention', description: 'Launch a targeted marketing campaign for customers who haven\'t purchased in 90 days.' }],
}), 1200));

export const getErpRetailData = (): Promise<ErpRetailData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(12000000),
    inventory: [
        { label: 'Inventory Turnover', value: '8.2x', trend: '+0.5', trendDirection: 'up' },
        { label: 'GMROI', value: '3.5', trend: '+0.2', trendDirection: 'up' },
        { label: 'Stockout Rate', value: '4%', trend: '+1%', trendDirection: 'down' },
        { label: 'Dead Stock Value', value: '2%', progress: 2, trend: '-0.5%', trendDirection: 'up' },
    ],
    sales: [
        { label: 'Top Selling Product', value: 'Wireless Earbuds' },
        { label: 'Return Rate', value: '3.5%', progress: 3.5 },
    ],
    supplyChain: {
        suppliers: [
            { id: 'SUP-01', name: 'Global Electronics', fulfillmentRate: 98, leadTime: 12 },
            { id: 'SUP-02', name: 'Local Textiles', fulfillmentRate: 95, leadTime: 5 },
        ]
    },
    alerts: [{ severity: 'warning', message: 'Supplier "Global Electronics" lead time has increased by 2 days.' }],
    aiSuggestions: [{ title: 'Reduce Stockouts', description: 'Increase safety stock level for "Wireless Earbuds" by 10% to mitigate recent stockout issues.' }],
}), 1200));

export const getCrmManufacturingData = (): Promise<CrmManufacturingData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(25000000),
    salesPipeline: [
        { label: 'Lead Conversion Rate', value: '18%', trend: '+1.5%', trendDirection: 'up' },
        { label: 'Lead-to-Deal Time', value: '55 days', trend: '-5 days', trendDirection: 'up' },
        { label: 'Pipeline Value', value: '₹2.5 Cr', trend: '+₹25L', trendDirection: 'up' },
    ],
    customerRelations: [
        { label: 'Customer Retention Rate', value: '88%', trend: 'Stable', trendDirection: 'neutral' },
        { label: 'Avg. Order Value', value: '₹5,20,000', trend: '+₹30k', trendDirection: 'up' },
        { label: 'Complaint Resolution Time', value: '24 hrs', trend: '-4 hrs', trendDirection: 'up' },
    ],
    accountManagement: [
        { label: 'Top Key Account', value: 'Mega Corp' },
        { label: 'New Accounts (Qtr)', value: '5' },
    ],
    alerts: [{ severity: 'warning', message: 'Deal pipeline for next quarter is 20% below target.' }],
    aiSuggestions: [{ title: 'Accelerate Sales Cycle', description: 'Follow up with leads in the "Proposal" stage older than 15 days.' }],
}), 1200));

export const getErpManufacturingData = (): Promise<ErpManufacturingData> => new Promise(resolve => setTimeout(() => resolve({
    financialSummary: mockFinancialSummary(25000000),
    production: [
        { label: 'OEE', value: '82%', progress: 82, trend: '+3%', trendDirection: 'up' },
        { label: 'Machine Downtime', value: '5%', progress: 5, trend: '-1%', trendDirection: 'up' },
        { label: 'Production Yield', value: '96%', progress: 96 },
        { label: 'Capacity Utilization', value: '88%', progress: 88 },
    ],
    inventory: [
        { label: 'Inventory Turnover', value: '6.5x', trend: '+0.2', trendDirection: 'up' },
        { label: 'Raw Material Lead Time', value: '18 days', trend: 'Stable', trendDirection: 'neutral' },
    ],
    quality: [
        { label: 'Defect Rate', value: '1.8%', progress: 1.8, trend: '-0.2%', trendDirection: 'up' },
        { label: 'Customer Returns', value: '0.5%', progress: 0.5 },
    ],
    maintenance: {
        tasks: [
            { id: 'MAINT-101', machine: 'CNC Machine 2', task: 'Lubricant Change', dueDate: '2024-04-26' },
            { id: 'MAINT-102', machine: 'Stamping Press', task: 'Die Inspection', dueDate: '2024-04-28' },
        ]
    },
    alerts: [{ severity: 'critical', message: 'Defect rate for "Metal Brackets" has increased to 4%. Production line needs inspection.' }],
    aiSuggestions: [{ title: 'Increase OEE', description: 'Schedule preventive maintenance for CNC Machine 3 during its scheduled downtime next Tuesday.' }],
}), 1200));