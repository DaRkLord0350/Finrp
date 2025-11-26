import React from 'react';
import { InvoiceItem } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  currency?: string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items, setItems, currency = '₹' }) => {
  const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: `new-${Date.now()}`, description: '', quantity: 1, rate: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  
  const calculateAmount = (quantity: number, rate: number) => {
      return (quantity * rate).toFixed(2);
  }

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const tax = subtotal * 0.18; // Example 18% tax
  const total = subtotal + tax;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Description</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase w-24">Quantity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase w-32">Rate</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase w-32">Amount</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className="px-4 py-2"><Input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Item description" className="w-full"/></td>
              <td className="px-4 py-2"><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full text-right"/></td>
              <td className="px-4 py-2"><Input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} className="w-full text-right" /></td>
              <td className="px-4 py-2 text-right font-medium text-slate-700 dark:text-slate-200">{currency}{calculateAmount(item.quantity, item.rate)}</td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">&times;</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4">
        <Button onClick={handleAddItem} variant="outline" size="sm">
          + Add Item
        </Button>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-300"><p>Subtotal</p><p>{currency}{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300"><p>Tax (18%)</p><p>{currency}{tax.toFixed(2)}</p></div>
            <hr className="my-1 border-slate-300 dark:border-slate-600"/>
            <div className="flex justify-between text-slate-800 dark:text-slate-100 font-bold text-lg"><p>Total</p><p>{currency}{total.toFixed(2)}</p></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItemsTable;
