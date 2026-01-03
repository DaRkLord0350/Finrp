'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, Customer, InvoiceItem } from '../types';
import { getCustomers, getNextInvoiceId } from '../services/billingService';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import InvoiceItemsTable from './InvoiceItemsTable';
import AIAssistant from './AIAssistant';
import AddCustomerModal from './AddCustomerModal';

interface InvoiceCreatorProps {
  invoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ invoice, onSave, onCancel }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>(invoice || { status: 'Draft', items: [{ id: '1', description: '', quantity: 1, rate: 0 }] });
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [aiTarget, setAiTarget] = useState<'notes' | number | null>(null);

  useEffect(() => {
    getCustomers().then(setCustomers);
    if (!invoice?.id) {
        getNextInvoiceId().then(id => setCurrentInvoice(prev => ({...prev, id})));
    }
  }, [invoice]);

  const handleInputChange = (field: keyof Invoice, value: any) => {
    setCurrentInvoice({ ...currentInvoice, [field]: value });
  };
  
  const handleCustomerChange = (customerId: string) => {
      const customer = customers.find(c => c.id === customerId);
      if(customer) {
        setCurrentInvoice({...currentInvoice, customer});
      }
  }

  const handleNewCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentInvoice({ ...currentInvoice, customer: newCustomer });
  };

  const handleSave = (status: 'Draft' | 'Pending') => {
    // Basic validation
    if (currentInvoice.id && currentInvoice.customer && currentInvoice.items && currentInvoice.items.length > 0) {
      onSave({ ...currentInvoice, status } as Invoice);
    } else {
      alert("Please select a customer and add at least one item.");
    }
  };
  
  const handleAIAssist = (target: 'notes' | number) => {
    setAiTarget(target);
    setIsAiAssistantOpen(true);
  }
  
  const onGeneratedText = (text: string) => {
      if(aiTarget === 'notes') {
          setCurrentInvoice(prev => ({...prev, notes: (prev.notes || '') + text}));
      } else if (typeof aiTarget === 'number') {
          const newItems = [...(currentInvoice.items || [])];
          newItems[aiTarget].description = text;
          setCurrentInvoice(prev => ({...prev, items: newItems}));
      }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeInUp">
      {isAiAssistantOpen && <AIAssistant onClose={() => setIsAiAssistantOpen(false)} onGeneratedText={onGeneratedText} />}
      {isAddCustomerOpen && <AddCustomerModal onClose={() => setIsAddCustomerOpen(false)} onCustomerAdded={handleNewCustomerAdded} />}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{invoice ? `Edit Invoice #${invoice.id}` : 'Create New Invoice'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in the details below to create your invoice.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="secondary" onClick={() => handleSave('Draft')}>Save as Draft</Button>
          <Button variant="primary" onClick={() => handleSave('Pending')}>Save & Finalize</Button>
        </div>
      </div>

      {/* Invoice Form */}
      <Card className="!p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bill From */}
          <div>
            <h3 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">From</h3>
            <p className="font-bold text-slate-800 dark:text-slate-200">Kumar Enterprises</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">123 Industrial Area, New Delhi</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">rajesh@kumarenterprises.com</p>
          </div>
          {/* Bill To */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-600 dark:text-slate-300">To</h3>
                <button 
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Customer
                </button>
            </div>
            <select
                className="block w-full px-4 py-2 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                value={currentInvoice.customer?.id || ''}
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <option value="" disabled>Select a customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {currentInvoice.customer && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{currentInvoice.customer.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Input label="Invoice Number" value={currentInvoice.id || ''} readOnly disabled />
          <Input label="Issue Date" type="date" value={currentInvoice.issueDate || ''} onChange={(e) => handleInputChange('issueDate', e.target.value)} />
          <Input label="Due Date" type="date" value={currentInvoice.dueDate || ''} onChange={(e) => handleInputChange('dueDate', e.target.value)} />
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Items</h3>
            <InvoiceItemsTable items={currentInvoice.items || []} setItems={(items) => handleInputChange('items', items)} />
            {(currentInvoice.items || []).map((item, index) => 
                <Button key={item.id} variant="ghost" size="sm" onClick={() => handleAIAssist(index)}>AI Assist for "{item.description.substring(0,20) || `Item ${index+1}`}"...</Button>
            )}
        </div>

        {/* Notes */}
        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes / Terms & Conditions</label>
            <textarea id="notes" value={currentInvoice.notes || ''} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full h-24 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md"></textarea>
            <Button variant="ghost" size="sm" onClick={() => handleAIAssist('notes')}>+ Generate with AI</Button>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceCreator;