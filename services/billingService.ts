import { parse } from 'path';
import { Invoice, Customer } from '../types';

const formatDateForFrontend = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Returns date in YYYY-MM-DD format which is requried for input type="date"
  return date.toISOString().split('T')[0];  
};

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
        if (response.status === 401) console.warn("User not authenticated");
        return [];
    }
    const data = await response.json();
    return data.map((inv: any) => ({
        ...inv,
        issueDate: formatDateForFrontend(inv.issueDate),
        dueDate: formatDateForFrontend(inv.dueDate),
    }));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch('/api/customers');
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const createCustomer = async (customerData: { name: string; email?: string; address?: string; }): Promise<Customer | null> => {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) throw new Error("Failed to create customer");
    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
};

export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    // If saving a new invoice, ensuring customerId is set from the customer object
    const payload = {
        ...invoice,
        customerId: invoice.customer.id,
        // Convert frontend YYYY-MM-DD back to ISO for DB if necessary, 
        // though Prisma often handles strings well, explicit ISO is safer.
        issueDate: new Date(invoice.issueDate).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString(),
    };

    const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to save");
    const savedData = await response.json();

    // Return with formatted dates for the UI state
    return {
      ...savedData,
      issueDate: formatDateForFrontend(savedData.issueDate),
      dueDate: formatDateForFrontend(savedData.dueDate),
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
};

export const getNextInvoiceId = async (): Promise<string> => {
    try {
        const invoices = await getInvoices();
        const year = new Date().getFullYear();
        let maxSeq = 0;

        invoices.forEach(inv => {
          // Expecting format INV-YYYY-XXXX
          const parts = inv.id.split('-');
          if (parts.length === 3) {
            const sequence = parseInt(parts[2], 10);
            if (!isNaN(sequence) && sequence > maxSeq) {
              maxSeq = sequence;
            }
          }   
        });
        
        return `INV-${year}-${String(maxSeq + 1).padStart(3, '0')}`;
    } catch (e) { 
      return `INV-${new Date().getFullYear()}-001`;
    }     
};


export interface BusinessDetails {
  businessName: string;
  email: string;
  address: string;
}

export const getBusinessProfile = async (): Promise<BusinessDetails> => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error("Failed to fetch profile");
      return await response.json();
    } catch (error) {
        console.error("Error fetching business profile:", error);
        return { businessName: 'My Business', email: '', address: '' };
    }
};

export const updateBusinessProfile = async (data: BusinessDetails): Promise<BusinessDetails | null> => {
    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update profile");
        return await response.json();
      } catch (error) {
        console.error("Error updating business profile:", error);
        return null;
      }
};