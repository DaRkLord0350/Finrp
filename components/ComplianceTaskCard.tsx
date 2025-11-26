import React, { useState } from 'react';
import { ComplianceTask, ComplianceStatus } from '../types';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { generateContent } from '../services/geminiService';

const Tag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>
);

interface ComplianceTaskCardProps {
  task: ComplianceTask;
  onPayNow: (task: ComplianceTask) => void;
}

const ComplianceTaskCard: React.FC<ComplianceTaskCardProps> = ({ task, onPayNow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{ text: string; isLoading: boolean } | null>(null);

  const handleExplainWithAI = async () => {
    if (aiExplanation?.text) return; // Don't re-fetch
    setAiExplanation({ text: '', isLoading: true });
    const prompt = `You are an expert business compliance advisor for Indian SMEs. Explain the task "${task.title}" in simple terms: What is it? Who needs to file it? Why is it important? Format using Markdown with headings and bullet points.`;
    try {
      const result = await generateContent(prompt);
      setAiExplanation({ text: result, isLoading: false });
    } catch (error) {
      console.error("AI Explanation Error:", error);
      setAiExplanation({ text: "Sorry, could not generate an explanation.", isLoading: false });
    }
  };

  const daysRemaining = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    if (priority === 'High') return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
  };
  
  const getTaskStatusColor = (status: ComplianceStatus) => {
    if (status === 'Overdue') return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    if (status === 'Pending') return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    if (status === 'Completed') return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getTaskStatusColor(task.status)}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Tag text={task.status} color={getPriorityColor(task.priority)} />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{task.title}</h4>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Due: {task.dueDate} {task.status !== 'Completed' && (
              <span className={daysRemaining <= 7 ? 'text-red-600 font-semibold' : ''}>
                ({daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          {task.status !== 'Completed' && (
            <Button variant="primary" size="sm" onClick={() => onPayNow(task)}>
              Pay Now (₹{task.estimatedAmount})
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            Learn More {isExpanded ? '▴' : '▾'}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fadeIn space-y-4">
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">What is this?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={handleExplainWithAI} disabled={aiExplanation?.isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09z" /></svg>
              Explain with AI
            </Button>
          </div>
          {aiExplanation && (
            <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
              {aiExplanation.isLoading ? (
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <Spinner size="sm" />
                  <span>Generating explanation...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-slate-700 dark:prose-invert" style={{ whiteSpace: 'pre-wrap' }}>
                  {aiExplanation.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ComplianceTaskCard);
