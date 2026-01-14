import React from 'react';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  navigate: (path: string) => void;
  badge?: { text: string; color: string };
}

export interface StatCardData {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeColor?: string;
}

// New types for Invoicing
export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
}

export interface InvoiceItem {
  id:string;
  description: string;
  quantity: number;
  rate: number;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface Invoice {
  id:string;
  customer: Customer;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  notes?: string;
}

// Type for the new intelligent compliance feature
export interface BusinessProfile {
  //Billing Details
  businessName: string;
  email: string;
  address: string;

  businessType?: 'Sole Proprietorship' | 'Partnership' | 'Private Limited Company';
  industry?: 'Services' | 'Manufacturing' | 'Retail & Trading';
  annualTurnover?: '< 20 Lakh' | '20 Lakh - 1 Crore' | '> 1 Crore';
  hasEmployees?: boolean;
  numberOfEmployees?: number;
}

export type BusinessDetails = BusinessProfile;

// Types for Compliance Page
export type ComplianceStatus = 'Pending' | 'Overdue' | 'Completed' | 'Payment Processing';

export interface ComplianceTask {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    estimatedAmount: number;
    status: ComplianceStatus;
    priority: 'High' | 'Medium' | 'Low';
}

export type DocumentStatus = 'Not Uploaded' | 'Uploading' | 'Uploaded' | 'Verified';
export interface CompanyDocument {
    id: string;
    name: string;
    description: string;
    status: DocumentStatus;
}

// Types for Overview Dashboards
export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'On Track' | 'At Risk' | 'Completed';
  deadline: string;
  profitability: number;
}

export interface ServicesData {
  stats: StatCardData[];
  projects: Project[];
  revenueByClient: { name: string; value: number }[];
  billableHours: { name: string, value: number, color: string }[];
}

export interface TopProduct {
    name: string;
    sku: string;
    sales: number;
}

export interface RecentOrder {
    id: string;
    customer: string;
    amount: number;
    time: string;
}

export interface RetailData {
    stats: StatCardData[];
    topProducts: TopProduct[];
    salesFunnel: { name: string; value: number }[];
    salesOverTime: { name: string; value: number }[];
    recentOrders: RecentOrder[];
}

export interface ProductionOrder {
    id: string;
    product: string;
    status: 'In Progress' | 'Completed' | 'Halted';
    quantity: number;
    efficiency: number;
}

export interface MaintenanceTask {
    id: string;
    machine: string;
    task: string;
    dueDate: string;
}

export interface ManufacturingData {
    stats: StatCardData[];
    productionOrders: ProductionOrder[];
    inventoryLevels: { name: string; value: number }[];
    productionOutput: { name: string; actual: number; target: number }[];
    maintenanceSchedule: MaintenanceTask[];
}

// Type for Virtual CFO analysis
export interface VirtualCFOAnalysis {
  businessType: string;
  healthScore: number;
  forecastSummary: string;
  strengths: string[];
  weaknesses: string[];
  alerts: string[];
  insights: string;
  recommendedActions: string;
  growthOpportunities: string;
}

// Type for AI Business Advisor chat messages
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// --- NEW DETAILED ERP/CRM METRIC TYPES ---
export interface Metric {
  label: string;
  value: string;
  trend?: string; // e.g., '+5%'
  trendDirection?: 'up' | 'down' | 'neutral';
  tooltip?: string;
  unit?: string;
  progress?: number; // for progress bars, 0-100
}

export interface Alert {
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

export interface AiSuggestion {
  title: string;
  description: string;
}

interface BaseSectorData {
  financialSummary: StatCardData[];
  alerts: Alert[];
  aiSuggestions: AiSuggestion[];
}

// --- SERVICES SECTOR ---
export interface CrmServicesData extends BaseSectorData {
  salesFunnel: Metric[];
  clientRelations: Metric[];
  teamPerformance: Metric[];
}
export interface ErpServicesData extends BaseSectorData {
  operations: Metric[];
  projectManagement: {
    projects: {
      id: string;
      name: string;
      status: string;
      profitability: number;
      deadline: string;
    }[];
  };
}

// --- RETAIL & TRADING SECTOR ---
export interface CrmRetailData extends BaseSectorData {
  customerBehavior: Metric[];
  salesPerformance: Metric[];
  loyalty: Metric[];
}
export interface ErpRetailData extends BaseSectorData {
  inventory: Metric[];
  sales: Metric[];
  supplyChain: {
    suppliers: {
      id: string;
      name: string;
      fulfillmentRate: number;
      leadTime: number;
    }[];
  };
}

// --- MANUFACTURING SECTOR ---
export interface CrmManufacturingData extends BaseSectorData {
  salesPipeline: Metric[];
  customerRelations: Metric[];
  accountManagement: Metric[];
}
export interface ErpManufacturingData extends BaseSectorData {
  production: Metric[];
  inventory: Metric[];
  quality: Metric[];
  maintenance: {
    tasks: {
      id: string;
      machine: string;
      task: string;
      dueDate: string;
    }[];
  };
}
