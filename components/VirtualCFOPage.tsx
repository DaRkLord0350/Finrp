import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { generateContent } from '../services/geminiService';
import PageHeader from './PageHeader';
import { BusinessProfile, VirtualCFOAnalysis } from '../types';
import { getMockMetricsForProfile } from '../services/mockApi';
import Skeleton from './ui/Skeleton';

// --- VIRTUAL CFO ANALYSIS COMPONENTS ---

const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s > 75) return { from: '#10b981', to: '#6ee7b7' }; // Green
        if (s > 40) return { from: '#f59e0b', to: '#fcd34d' }; // Yellow
        return { from: '#ef4444', to: '#f87171' }; // Red
    };

    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color.from} />
                        <stop offset="100%" stopColor={color.to} />
                    </linearGradient>
                </defs>
                <circle className="text-slate-200 dark:text-slate-700" strokeWidth="12" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    stroke="url(#gaugeGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.8s ease-out' }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{score}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
        </div>
    );
};

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <Card>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <span className="mr-3">{icon}</span>
            {title}
        </h3>
        {children}
    </Card>
);

const BulletList: React.FC<{ items: string[], icon: string, className?: string }> = ({ items, icon, className = '' }) => (
    <div className={`space-y-3 ${className}`}>
        {items.map((item, index) => (
            <div key={index} className="flex items-start">
                <span className="text-lg mr-3 mt-0.5">{icon}</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex-1">{item}</p>
            </div>
        ))}
    </div>
);

const VIRTUAL_CFO_PROMPT = `
You are an advanced business analytics AI for Indian SMEs. Analyze the provided metrics to generate a CFO-level report.

### 1. ANALYSIS FRAMEWORK
- **Identify Business Type:** Manufacturing, Retail & Trade, or Service.
- **Analyze Metrics:** Compare current values against benchmarks, noting trends. Tag each as {Healthy / Needs Improvement / Critical}.
- **Generate Insights:** Synthesize data into actionable advice.

### 2. KEY METRICS AND THRESHOLDS

#### Financial Metrics (All Sectors):
- **Gross Profit Margin:** Ideal >30%; Critical <25%.
- **Net Profit Margin:** Ideal >10%; Critical <8%.
- **Receivable Days:** Ideal <45; Critical >60.
- **Working Capital Ratio:** Ideal 1.2–2.0; Critical <1.0.
- **Cash Conversion Cycle:** Ideal <60 days; Critical >75.
- **Debt-to-Equity:** Ideal <1.5; Critical >2.0.
- **Revenue Growth:** Ideal >10% YoY; Critical <5%.

#### Manufacturing Metrics:
- **OEE:** Ideal >80%; Critical <65%.
- **Defect Rate:** Ideal <2%; Critical >5%.
- **Inventory Turnover:** Ideal 6-10x/year; Critical <4.

#### Service Sector Metrics:
- **Utilization Rate:** Ideal 75-85%; Critical <70%.
- **Project Margin:** Ideal >25%; Critical <15%.
- **CSAT:** Ideal >4.2/5; Critical <3.8.

#### Retail & Trade Metrics:
- **Inventory Turnover Ratio:** Ideal 8-12x/year; Critical <6.
- **GMROI:** Ideal >3; Critical <2.
- **Conversion Rate (Footfall→Sale):** Ideal >25%; Critical <15%.

### 3. OUTPUT FORMAT (STRICTLY FOLLOW THIS STRUCTURE)

Business Type: [Manufacturing / Retail & Trading / Services]
Summary Score: [Value 0–100, calculated based on overall health]
Forecast (Next 30 Days): [A 1-2 line forecast based on current trajectory.]

---TOP 5 STRENGTHS---
- [Strength 1: e.g., "Healthy Net Profit Margin at 15%"]
- [Strength 2]
- [Strength 3]
- [Strength 4]
- [Strength 5]

---TOP 5 WEAKNESSES---
- [Weakness 1: e.g., "High Receivable Days at 65 days"]
- [Weakness 2]
- [Weakness 3]
- [Weakness 4]
- [Weakness 5]

---KEY ALERTS---
- [Critical Alert 1: e.g., "Cash Conversion Cycle is critical at 80 days, indicating potential liquidity issues."]
- [Critical Alert 2]
- [Critical Alert 3]

---AI-GENERATED INSIGHTS---
[A detailed paragraph summarizing causes, risk implications, and the overall business narrative based on the data.]

---RECOMMENDED ACTIONS---
**Short-Term (30 days):**
- [Actionable recommendation 1]
- [Actionable recommendation 2]
**Long-Term (90 days):**
- [Actionable recommendation 1]
- [Actionable recommendation 2]

---GROWTH OPPORTUNITIES---
- [Opportunity 1 with brief explanation]
- [Opportunity 2 with brief explanation]
- [Opportunity 3 with brief explanation]
`;

const parseCFOResponse = (text: string): VirtualCFOAnalysis | null => {
    try {
        const getMatch = (regex: RegExp) => (text.match(regex) || [])[1]?.trim();
        const getSection = (start: string, end?: string) => {
            const regex = end ? new RegExp(`${start}\\s*([\\s\\S]*?)\\s*${end}`, 'm') : new RegExp(`${start}\\s*([\\s\\S]*)`, 'm');
            return getMatch(regex);
        };
        const parseList = (sectionText: string | undefined) => {
            if (!sectionText) return [];
            return sectionText.split('\n').map(s => s.trim().replace(/^- \s*/, '').replace(/^\d+\.\s*/, '')).filter(Boolean);
        };
        
        const businessType = getMatch(/^Business Type: (.*)$/m) || 'N/A';
        const healthScore = parseInt(getMatch(/^Summary Score: (\d+)/m) || '0', 10);
        const forecastSummary = getMatch(/^Forecast \(Next 30 Days\): (.*)$/m) || '';

        const strengthsText = getSection('---TOP 5 STRENGTHS---', '---TOP 5 WEAKNESSES---');
        const weaknessesText = getSection('---TOP 5 WEAKNESSES---', '---KEY ALERTS---');
        const alertsText = getSection('---KEY ALERTS---', '---AI-GENERATED INSIGHTS---');
        const insightsText = getSection('---AI-GENERATED INSIGHTS---', '---RECOMMENDED ACTIONS---');
        const actionsText = getSection('---RECOMMENDED ACTIONS---', '---GROWTH OPPORTUNITIES---');
        const opportunitiesText = getSection('---GROWTH OPPORTUNITIES---');
        
        const analysis: VirtualCFOAnalysis = {
            businessType,
            healthScore,
            forecastSummary,
            strengths: parseList(strengthsText),
            weaknesses: parseList(weaknessesText),
            alerts: parseList(alertsText),
            insights: insightsText || '',
            recommendedActions: actionsText || '',
            growthOpportunities: opportunitiesText || '',
        };

        if (healthScore === 0 && !forecastSummary && strengthsText === undefined) return null;

        return analysis;
    } catch (error) {
        console.error("Failed to parse CFO response:", error);
        return null;
    }
};

const VirtualCFOAnalysisContent: React.FC<{ businessProfile: BusinessProfile }> = ({ businessProfile }) => {
    const [analysis, setAnalysis] = useState<VirtualCFOAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateAnalysis = async () => {
        if (!businessProfile) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const metricsPrompt = await getMockMetricsForProfile(businessProfile);
            const fullPrompt = `${VIRTUAL_CFO_PROMPT}\n\n${metricsPrompt}`;

            const resultText = await generateContent(fullPrompt);
            const parsedAnalysis = parseCFOResponse(resultText);

            if (parsedAnalysis) {
                setAnalysis(parsedAnalysis);
            } else {
                throw new Error("Could not parse the AI's response. Please try again or check the prompt format.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while generating the analysis. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Virtual CFO Analysis</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Generate a comprehensive financial and operational report for your business.</p>
                    </div>
                    <Button onClick={handleGenerateAnalysis} disabled={isLoading} size="md" className="mt-4 sm:mt-0">
                        {isLoading ? <><Spinner size="sm" /> Analyzing...</> : 'Generate New Analysis'}
                    </Button>
                </div>
            </Card>
            
            {isLoading && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="h-48 rounded-xl" />
                        <Skeleton className="h-48 rounded-xl lg:col-span-2" />
                    </div>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                </div>
            )}

            {error && <Card className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4">{error}</Card>}

            {!isLoading && !analysis && (
                 <Card className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Generate Your Business Analysis</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click the button above to get your personalized CFO report.</p>
                </Card>
            )}

            {analysis && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Summary Score</h3>
                            <HealthScoreGauge score={analysis.healthScore} />
                        </Card>
                        <Card className="lg:col-span-2">
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">AI Forecast</h3>
                             <div className="prose prose-sm max-w-none text-slate-600 dark:prose-invert">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Forecast (Next 30 Days)</p>
                                <blockquote>{analysis.forecastSummary}</blockquote>
                             </div>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <SectionCard title="Strengths" icon="👍">
                            <BulletList items={analysis.strengths} icon="✅" />
                        </SectionCard>
                         <SectionCard title="Weaknesses" icon="👎">
                            <BulletList items={analysis.weaknesses} icon="⚠️" />
                        </SectionCard>
                         <SectionCard title="Key Alerts" icon="🚨">
                            <BulletList items={analysis.alerts} icon="🔴" />
                        </SectionCard>
                    </div>
                     <SectionCard title="AI-Generated Insights" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                        <div
                            className="prose prose-sm md:prose-base max-w-none prose-emerald dark:prose-invert text-slate-600 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: analysis.insights.replace(/\n/g, '<br />') }}
                        />
                     </SectionCard>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <SectionCard title="Recommended Actions" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert prose-strong:font-semibold text-slate-600 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: analysis.recommendedActions.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                            />
                        </SectionCard>
                        <SectionCard title="Growth Opportunities" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: analysis.growthOpportunities.replace(/\n/g, '<br />') }}
                            />
                        </SectionCard>
                     </div>
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---

interface VirtualCFOPageProps {
  businessProfile: BusinessProfile | null;
  navigate: (path: string) => void;
}

const VirtualCFOPage: React.FC<VirtualCFOPageProps> = ({ businessProfile, navigate }) => {
    
    if (!businessProfile) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Set Up Your Business Profile</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">To use the Virtual CFO, first set up your business profile on the compliance page.</p>
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => navigate('/dashboard/compliance')}>Go to Setup</Button>
                    </div>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeInUp">
            <PageHeader
                title="Virtual CFO"
                subtitle="Your AI-powered suite for financial analysis and business guidance."
            />
            
            <div className="mt-8">
                <VirtualCFOAnalysisContent businessProfile={businessProfile} />
            </div>
        </div>
    );
};

export default VirtualCFOPage;