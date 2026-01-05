import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import { updateBusinessProfile, BusinessDetails } from '../services/billingService';

interface BusinessProfileModalProps {
  initialData: BusinessDetails;
  onClose: () => void;
  onSave: (data: BusinessDetails) => void;
}

const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<BusinessDetails>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.businessName) return alert('Business Name is required');
    
    setIsLoading(true);
    const updated = await updateBusinessProfile(formData);
    setIsLoading(false);

    if (updated) {
      onSave(updated);
      onClose();
    } else {
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
      <Card className="w-full max-w-md transform transition-all animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Edit Business Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold">&times;</button>
        </div>
        
        <div className="space-y-4">
          <Input 
            label="Business Name *" 
            value={formData.businessName} 
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} 
            placeholder="e.g. My Company Ltd"
          />
          <Input 
            label="Business Email" 
            type="email"
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="billing@mycompany.com"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Address</label>
            <textarea 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Business Rd, City, Country"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Save Details'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BusinessProfileModal;