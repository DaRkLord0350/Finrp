import React, { useState } from 'react';
import { ComplianceTask } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';

interface PaymentModalProps {
  task: ComplianceTask;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ task, onClose, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'bank-transfer'>('credit-card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});

  const validatePayment = () => {
    const errors: { [key: string]: string } = {};
    if (paymentMethod === 'credit-card') {
      if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Card number must be 16 digits.';
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentDetails.cardExpiry)) errors.cardExpiry = 'Expiry must be in MM/YY format.';
      if (!/^\d{3}$/.test(paymentDetails.cardCvc)) errors.cardCvc = 'CVC must be 3 digits.';
    } else if (paymentMethod === 'bank-transfer') {
      if (paymentDetails.accountNumber.trim().length < 9) errors.accountNumber = 'Please enter a valid account number.';
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentDetails.ifscCode.toUpperCase())) errors.ifscCode = 'Please enter a valid IFSC code.';
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmPayment = () => {
    if (!validatePayment()) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      setTimeout(() => onPaymentSuccess(), 2000);
    }, 2500);
  };

  const handlePaymentDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
      <Card className="w-full max-w-lg transform transition-all animate-scaleIn">
        {isPaying ? (
          <div className="text-center py-8">
            <Spinner size="lg" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Processing Payment...</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Please do not close this window.</p>
          </div>
        ) : !paymentSuccess ? (
          <>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Complete Your Payment</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">For: <strong>{task.title}</strong></p>
            
            <div className="mb-4">
              <div className="flex border border-slate-300 dark:border-slate-600 rounded-md p-1">
                <button onClick={() => setPaymentMethod('credit-card')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'credit-card' ? 'bg-emerald-500 text-white' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Credit Card</button>
                <button onClick={() => setPaymentMethod('bank-transfer')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'bank-transfer' ? 'bg-emerald-500 text-white' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Bank Transfer</button>
              </div>
            </div>
            
            {paymentMethod === 'credit-card' && (
              <div className="space-y-3 animate-fadeIn">
                <Input label="Card Number" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentDetailChange} placeholder="0000 0000 0000 0000" />
                {paymentErrors.cardNumber && <p className="text-red-500 text-xs">{paymentErrors.cardNumber}</p>}
                <div className="flex gap-4">
                  <div className="flex-1"><Input label="Expiry (MM/YY)" name="cardExpiry" value={paymentDetails.cardExpiry} onChange={handlePaymentDetailChange} placeholder="MM/YY" />{paymentErrors.cardExpiry && <p className="text-red-500 text-xs">{paymentErrors.cardExpiry}</p>}</div>
                  <div className="flex-1"><Input label="CVC" name="cardCvc" value={paymentDetails.cardCvc} onChange={handlePaymentDetailChange} placeholder="123" />{paymentErrors.cardCvc && <p className="text-red-500 text-xs">{paymentErrors.cardCvc}</p>}</div>
                </div>
              </div>
            )}

            {paymentMethod === 'bank-transfer' && (
              <div className="space-y-3 animate-fadeIn">
                <Input label="Account Number" name="accountNumber" value={paymentDetails.accountNumber} onChange={handlePaymentDetailChange} placeholder="Enter your account number" />
                {paymentErrors.accountNumber && <p className="text-red-500 text-xs">{paymentErrors.accountNumber}</p>}
                <Input label="IFSC Code" name="ifscCode" value={paymentDetails.ifscCode} onChange={handlePaymentDetailChange} placeholder="Enter IFSC code" />
                {paymentErrors.ifscCode && <p className="text-red-500 text-xs">{paymentErrors.ifscCode}</p>}
              </div>
            )}
            
            <div className="mt-6 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between dark:text-slate-300"><span>Compliance Fee:</span> <span>₹{task.estimatedAmount.toFixed(2)}</span></div>
              <div className="flex justify-between dark:text-slate-300"><span>Platform Fee:</span> <span>₹50.00</span></div>
              <hr className="border-slate-200 dark:border-slate-600"/>
              <div className="flex justify-between font-bold text-lg dark:text-slate-100"><span>Total Amount:</span> <span>₹{(task.estimatedAmount + 50).toFixed(2)}</span></div>
            </div>
            <div className="mt-8 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmPayment}>Confirm & Pay</Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto animate-scaleIn" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Payment Successful!</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Your compliance status has been updated.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentModal;
