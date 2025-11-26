import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { generateContent } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIBusinessAdvisorChatProps {
    onClose: () => void;
}

const AI_BUSINESS_ADVISOR_PROMPT = `You are 'SME-AI', an expert business advisor AI designed specifically for Indian Small and Medium-sized Enterprises (SMEs). Your knowledge is comprehensive and practical. You must provide clear, actionable, and insightful advice.

Your areas of deep expertise include:
1.  **General Business Management:** Strategy, operations, marketing, sales, and human resources tailored for the SME context.
2.  **Finance:** Financial planning, cash flow management, budgeting, and understanding financial statements.
3.  **Foreign Exchange (FOREX):** Explain concepts like hedging, currency risk, and import/export financing in simple terms relevant to a small business owner.
4.  **Retail & Trading Sector:** Provide insights on inventory management, supply chain, customer retention, e-commerce strategies, and current market trends.
5.  **Manufacturing Sector:** Advise on production efficiency (like OEE), quality control, supply chain optimization, and adopting new manufacturing technologies.
6.  **Services Sector:** Discuss project management, client relationship management, pricing strategies, and improving billable hours.
7.  **Compliance & Regulations:** Offer high-level guidance on common Indian business regulations (GST, TDS, etc.), but always include a disclaimer to consult with a professional (like a CA or lawyer) for legal or financial decisions.

When responding:
- Be professional, encouraging, and clear.
- Use Markdown for formatting (headings, bullet points, bold text) to make your answers easy to read.
- If a question is ambiguous, ask for clarification.
- Your goal is to empower the SME owner with knowledge to make better business decisions.`;

const AIBusinessAdvisorChat: React.FC<AIBusinessAdvisorChatProps> = ({ onClose }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm your AI Business Advisor. How can I help you grow your business today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userInput }];
        setChatHistory(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await generateContent(userInput, AI_BUSINESS_ADVISOR_PROMPT);
            setChatHistory([...newHistory, { role: 'model', content: response }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory([...newHistory, { role: 'model', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickPrompts = [
        "How can I improve my inventory turnover?",
        "Explain FOREX hedging for my import business.",
        "What are the latest trends in the retail sector in India?"
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
            <Card className="flex flex-col h-[90vh] w-[90vw] max-w-4xl transform transition-all animate-scaleIn">
                 <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
                        AI Business Advisor
                    </h2>
                     <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-3xl font-bold">&times;</button>
                 </div>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>}
                            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                               <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                            <div className="max-w-xl p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                               <Spinner size="sm" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                     <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Quick prompts: {quickPrompts.map(p => <button key={p} onClick={() => setUserInput(p)} className="underline mr-2 hover:text-emerald-600 dark:hover:text-emerald-400">{p}</button>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="Ask a question about your business..."
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 resize-none"
                            rows={2}
                            disabled={isLoading}
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>Send</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIBusinessAdvisorChat;