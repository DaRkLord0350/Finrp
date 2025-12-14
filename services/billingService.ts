import { Invoice, Customer } from '../types';

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
        if (response.status === 401) console.warn("User not authenticated");
        return [];
    }
    const data = await response.json();
    return data;
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

export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    // If saving a new invoice, ensuring customerId is set from the customer object
    const payload = {
        ...invoice,
        customerId: invoice.customer.id
    };

    const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to save");
    return await response.json();
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
};

export const getNextInvoiceId = async (): Promise<string> => {
    // We fetch current invoices to calculate the next ID
    const invoices = await getInvoices();
    
    // Default to year-based ID
    const year = new Date().getFullYear();
    let maxSequence = 0;
    
    invoices.forEach(inv => {
        // Assuming ID format is INV-YYYY-XXX
        const parts = inv.id.split('-');
        if (parts.length === 3) {
            const sequence = parseInt(parts[2], 10);
            if (!isNaN(sequence) && sequence > maxSequence) {
                maxSequence = sequence;
            }
        }
    });

    return `INV-${year}-${String(maxSequence + 1).padStart(3, '0')}`;
};
