import React, { useState, useEffect } from 'react';
import { Invoice } from '../types';
import Button from './ui/Button';
import Logo from './ui/Logo';
import { getBusinessProfile, BusinessDetails } from '../services/billingService';

interface InvoicePDFPreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoicePDFPreview: React.FC<InvoicePDFPreviewProps> = ({ invoice, onClose }) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessDetails | null>(null);

  useEffect(() => {
    getBusinessProfile().then(setBusinessProfile);
  }, []);
    

  const calculateTotal = (withTax: boolean = true) => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    if (!withTax) return subtotal;
    const tax = subtotal * 0.18; // Example 18% tax
    return subtotal + tax;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-start z-50 p-4 overflow-y-auto animate-fadeIn" role="dialog" aria-modal="true">
        <div className="w-full max-w-4xl relative">
            <div className="flex justify-center gap-4 mb-4 print-hide">
                <Button variant="primary" onClick={handlePrint}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print / Save as PDF
                </Button>
                <Button variant="outline" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20" onClick={onClose}>Close Preview</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-2xl printable-area">
                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-8 border-b">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">INVOICE</h1>
                            <p className="text-slate-500">Invoice No: <span className="font-medium text-slate-700">{invoice.id}</span></p>
                        </div>
                        <div className="text-right">
                             <div className="flex items-center justify-end space-x-2">
                                <Logo className="w-8 h-8 text-emerald-500" />
                                <span className="text-2xl font-bold text-slate-800">Finrp</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{businessProfile?.businessName || 'Your Company'}</p>
                        </div>
                    </div>

                    {/* From/To Details */}
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        <div>
                            <p className="font-semibold text-slate-500 mb-1">Billed To</p>
                            <p className="font-bold text-slate-800 text-lg">{invoice.customer.name}</p>
                            <p className="text-slate-600">{invoice.customer.address}</p>
                            <p className="text-slate-600">{invoice.customer.email}</p>
                        </div>
                         <div className="text-right">
                            <p className="font-semibold text-slate-500 mb-1">From</p>
                            <p className="font-bold text-slate-800 text-lg">{businessProfile?.businessName || 'Your Business Name'}</p>
                            <p className="text-slate-600">{businessProfile?.address || 'Your Business Address'}</p>
                            <p className="text-slate-600">{businessProfile?.email || 'Your Business Email'}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-8 mt-4">
                        <div/>
                        <div className="text-right">
                           <p className="font-semibold text-slate-500">Issue Date: <span className="font-medium text-slate-700">{invoice.issueDate}</span></p>
                           <p className="font-semibold text-slate-500">Due Date: <span className="font-medium text-slate-700">{invoice.dueDate}</span></p>
                        </div>
                    </div>


                    {/* Items Table */}
                    <div className="mt-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
                                    <th className="p-3 font-semibold">Description</th>
                                    <th className="p-3 font-semibold text-center w-24">Qty</th>
                                    <th className="p-3 font-semibold text-right w-32">Rate</th>
                                    <th className="p-3 font-semibold text-right w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="p-3">{item.description}</td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">₹{item.rate.toFixed(2)}</td>
                                        <td className="p-3 text-right">₹{(item.quantity * item.rate).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-xs space-y-2 text-slate-700">
                            <div className="flex justify-between"><p>Subtotal</p><p>₹{calculateTotal(false).toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Tax (18%)</p><p>₹{(calculateTotal(false) * 0.18).toFixed(2)}</p></div>
                            <hr className="my-2 border-slate-300"/>
                            <div className="flex justify-between font-bold text-xl text-slate-800 bg-slate-100 p-2 rounded-lg">
                                <p>Total</p><p>₹{calculateTotal(true).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mt-10 border-t pt-8">
                            <h4 className="font-semibold text-slate-600 mb-2">Notes & Terms</h4>
                            <p className="text-sm text-slate-500 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-12 text-center text-xs text-slate-400 border-t pt-6">
                        <p>Thank you for your business! Please pay within the due date.</p>
                        <p>{businessProfile?.businessName || 'Finrp'} | {businessProfile?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InvoicePDFPreview;