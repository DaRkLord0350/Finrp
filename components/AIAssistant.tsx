'use client';

import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
// FIX: Corrected import path for geminiService.
import { generateContent } from '../services/geminiService';
import Spinner from './ui/Spinner';
import { Invoice } from '../types';

interface AIAssistantProps {
  onGeneratedText?: (text: string) => void;
  onClose: () => void;
  invoiceForReminder?: Invoice | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onGeneratedText, onClose, invoiceForReminder }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (invoiceForReminder) {
      const totalAmount = invoiceForReminder.items.reduce((acc, item) => acc + item.quantity * item.rate, 0) * 1.18; // with tax
      const emailPrompt = `You are an assistant for a small business owner named Rajesh Kumar from Kumar Enterprises. 
      Draft a polite but firm follow-up email regarding an overdue invoice.
      The customer's name is ${invoiceForReminder.customer.name}.
      The email should reference the following details:
      - Invoice Number: ${invoiceForReminder.id}
      - Amount Due: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      - Original Due Date: ${invoiceForReminder.dueDate}

      The tone should be professional and request prompt payment. 
      Crucially, the email must state that a copy of the invoice is attached for their convenience.
      Also, offer assistance if they have any questions.`;
      
      setIsLoading(true);
      setGeneratedText('');
      generateContent(emailPrompt).then(result => {
          setGeneratedText(result);
          setIsLoading(false);
      });
    }
  }, [invoiceForReminder]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedText('');
    const fullPrompt = `You are an assistant for a small business owner creating an invoice. Write a professional and concise response for the following request: "${prompt}"`;
    const result = await generateContent(fullPrompt);
    setGeneratedText(result);
    setIsLoading(false);
  };
  
  const handleInsert = () => {
    if (onGeneratedText) {
        onGeneratedText(generatedText);
    }
    onClose();
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const quickPrompts = [
    "Write a description for web development services.",
    "Generate standard payment terms: Net 15.",
    "Write a friendly thank you note for an invoice."
  ];

  const renderGeneralAssistant = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
          AI Assistant
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold">&times;</button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Request</label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Write a description for 50 hours of consulting services'"
            className="w-full h-24 p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Quick prompts: {quickPrompts.map(p => <button key={p} onClick={() => setPrompt(p)} className="underline mr-2 hover:text-emerald-600 dark:hover:text-emerald-400">{p}</button>)}
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
          {isLoading ? <Spinner size="sm" /> : 'Generate'}
        </Button>
        {generatedText && (
          <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Generated Text</label>
              <textarea
                readOnly
                value={generatedText}
                className="w-full h-32 p-2 border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200"
              />
              <Button onClick={handleInsert} variant="primary">Insert Text</Button>
          </div>
        )}
      </div>
    </>
  );

  const renderEmailDrafter = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Draft Overdue Invoice Reminder
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold">&times;</button>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">AI is drafting a reminder email for <strong>{invoiceForReminder?.customer.name}</strong> regarding invoice <strong>{invoiceForReminder?.id}</strong>.</p>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Generated Email Draft</label>
            <div className="relative">
                <textarea
                  readOnly
                  value={generatedText}
                  placeholder="Generating email..."
                  className="w-full h-64 p-2 border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
                {isLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/75 dark:bg-slate-800/75 rounded-md">
                        <Spinner />
                    </div>
                )}
            </div>
            <Button onClick={handleCopyToClipboard} variant="primary" disabled={isLoading || !generatedText}>
              {copied ? 'Copied!' : 'Copy Email'}
            </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
      <Card className="w-full max-w-2xl transform transition-all animate-scaleIn">
        {invoiceForReminder ? renderEmailDrafter() : renderGeneralAssistant()}
      </Card>
    </div>
  );
};

export default AIAssistant;
