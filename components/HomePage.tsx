'use client';

import React, { useEffect, useRef, useState } from 'react';
import useTheme from '../hooks/useTheme';
import ThemeToggle from './ui/ThemeToggle';
import Logo from './ui/Logo';

interface HomePageProps {
  navigate: (path: string) => void;
}

const AnimatedCounter: React.FC<{ value: number, duration?: number, suffix?: string }> = ({ value, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [inView, setInView] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.5 });
        if(ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;

        let start = 0;
        const end = value;
        if (start === end) return;

        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [value, duration, inView]);
    
    const formatValue = (val: number) => {
        if (value > 9999) return `${val.toLocaleString()}+`;
        if (suffix) return `${val.toLocaleString()}${suffix}`;
        return val.toLocaleString();
    }

    return <span ref={ref}>{formatValue(count)}</span>;
};

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string, features: string[], className?: string}> = ({icon, title, description, features, className}) => (
    <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-slate-700/50 transition-all duration-300 transform hover:-translate-y-2 scroll-animate slide-up ${className}`}>
        <div className="text-emerald-500 mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">{description}</p>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            {features.map(f => <li key={f} className="flex items-center"><CheckIcon /> {f}</li>)}
        </ul>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    const [theme, toggleTheme] = useTheme();
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };
  
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-50 border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">Finrp</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 text-lg">
                        <a href="#features" className="hover:text-emerald-500 transition-colors">Features</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Pricing</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">About</a>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <button onClick={() => navigate('/login')} className="hidden sm:inline-block px-6 py-2 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Sign In</button>
                        <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-md font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Get Started</button>
                    </div>
                </div>
            </div>
        </header>

        <main>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                     <svg className="absolute bottom-0 left-0 w-full h-auto" width="100%" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                        <g className="text-slate-200 dark:text-slate-700/50 opacity-70">
                            {/* Ground Layers */}
                            <path d="M 0 400 L 0 350 Q 360 280, 720 340 T 1440 320 L 1440 400 Z" fill="currentColor" className="opacity-30 animate-fadeIn anim-delay-300" />
                            <path d="M 0 400 L 0 320 Q 360 380, 720 350 T 1440 370 L 1440 400 Z" fill="currentColor" className="opacity-40 animate-fadeIn anim-delay-100" />
                            
                            <g className="text-slate-300 dark:text-slate-600/50">
                                {/* GROWTH STORY: Start with a small warehouse */}
                                <g className="animate-buildUpVertical anim-delay-500">
                                    <rect x="50" y="350" width="100" height="50" />
                                    <path d="M 50 350 L 100 320 L 150 350 Z" />
                                </g>

                                {/* THEN: Build a more complex factory */}
                                <g className="animate-buildUpVertical anim-delay-1000">
                                    <path d="M 180 400 L 180 320 L 210 290 L 240 320 L 270 290 L 300 320 L 330 290 L 360 320 L 360 400 Z" />
                                </g>
                                {/* Chimney for Factory 1 with more varied smoke */}
                                <g className="animate-buildUpVertical anim-delay-1500">
                                    <rect x="190" y="270" width="15" height="130" />
                                    <rect x="185" y="260" width="25" height="10" />
                                    <circle cx="197.5" cy="260" r="8" fill="currentColor" className="animate-smokePuff opacity-40 anim-delay-2500" style={{ animationDuration: '5.5s' }} />
                                    <circle cx="197.5" cy="260" r="10" fill="currentColor" className="animate-smokePuff opacity-30 anim-delay-4000" style={{ animationDuration: '6.5s' }} />
                                    <circle cx="197.5" cy="260" r="9" fill="currentColor" className="animate-smokePuff opacity-35 anim-delay-5200" style={{ animationDuration: '6s' }} />
                                </g>

                                {/* ADD INFRASTRUCTURE: Communication Tower for connectivity */}
                                <g className="animate-buildUpVertical anim-delay-1200">
                                    <path d="M 450 400 L 455 400 L 470 250 L 465 250 Z" />
                                    <line x1="452" y1="400" x2="467" y2="250" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="452" y1="325" x2="467" y2="325" stroke="currentColor" strokeWidth="1" />
                                    <line x1="452" y1="360" x2="467" y2="360" stroke="currentColor" strokeWidth="1" />
                                    {/* Pulsing light */}
                                    <circle cx="467.5" cy="250" r="4" fill="#ef4444" className="animate-pulse anim-delay-2800" />
                                </g>
                                
                                {/* THEN: Build an even larger factory complex */}
                                <g className="animate-buildUpVertical anim-delay-1800">
                                    <rect x="880" y="300" width="280" height="100" />
                                    <path d="M 880 300 L 1020 240 L 1160 300 Z" />
                                </g>
                                <g className="animate-buildUpVertical anim-delay-2200">
                                    <rect x="820" y="340" width="60" height="60" />
                                </g>
                                {/* Chimney for Factory 2 with more varied smoke */}
                                <g className="animate-buildUpVertical anim-delay-2500">
                                    <rect x="920" y="250" width="15" height="50" />
                                    <circle cx="927.5" cy="250" r="7" fill="currentColor" className="animate-smokePuff opacity-30 anim-delay-4500" style={{ animationDuration: '7s' }} />
                                    <circle cx="927.5" cy="250" r="8" fill="currentColor" className="animate-smokePuff opacity-25 anim-delay-5800" style={{ animationDuration: '6.2s' }} />
                                </g>
                                
                                {/* ADD LOGISTICS: Silo Complex */}
                                <g className="animate-buildUpVertical anim-delay-2000">
                                    <rect x="1200" y="310" width="50" height="90" rx="25" ry="5" />
                                    <ellipse cx="1225" cy="310" rx="25" ry="5" />
                                </g>
                                <g className="animate-buildUpVertical anim-delay-2200">
                                    <rect x="1260" y="330" width="50" height="70" rx="25" ry="5" />
                                    <ellipse cx="1285" cy="330" rx="25" ry="5" />
                                </g>

                                 {/* ADD ACTIVITY: Moving Trucks */}
                                <g className="animate-drive anim-delay-3000" style={{animationDuration: '12s'}}>
                                    <rect x="0" y="380" width="40" height="20" fill="currentColor" className="opacity-70" />
                                    <rect x="10" y="370" width="20" height="10" fill="currentColor" className="opacity-70" />
                                    <circle cx="10" cy="400" r="5" fill="currentColor" className="opacity-50" />
                                    <circle cx="30" cy="400" r="5" fill="currentColor" className="opacity-50" />
                                </g>
                                <g className="animate-drive anim-delay-5000" style={{animationDuration: '18s'}}>
                                    <rect x="0" y="385" width="30" height="15" fill="currentColor" className="opacity-60" />
                                    <rect x="5" y="378" width="15" height="7" fill="currentColor" className="opacity-60" />
                                    <circle cx="8" cy="400" r="4" fill="currentColor" className="opacity-40" />
                                    <circle cx="23" cy="400" r="4" fill="currentColor" className="opacity-40" />
                                </g>
                            </g>

                            {/* Cranes symbolize the constant building and progress */}
                            <g className="text-emerald-400 dark:text-emerald-500/50">
                                <g className="animate-buildUpVertical anim-delay-1200">
                                    <path d="M 740 400 L 745 400 L 765 200 L 760 200 Z" fill="currentColor" className="opacity-60" />
                                </g>
                                <g className="animate-craneSwing anim-delay-2000" style={{ transformOrigin: '752.5px 210px' }}>
                                    <path d="M 752.5 210 L 650 220 L 650 225 L 752.5 215 Z" />
                                    <path d="M 752.5 210 L 880 190 L 880 195 L 752.5 215 Z" />
                                    <g className="animate-hookBob" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                                        <line x1="840" y1="192" x2="840" y2="280" stroke="currentColor" strokeWidth="1.5" className="animate-fadeIn anim-delay-2500"/>
                                        <rect x="835" y="280" width="10" height="10" className="animate-fadeIn anim-delay-2500" />
                                    </g>
                                </g>
                                <g className="animate-buildUpVertical anim-delay-1000">
                                    <path d="M 550 400 L 555 400 L 565 280 L 560 280 Z" fill="currentColor" className="opacity-60" />
                                </g>
                                <g className="animate-craneSwing anim-delay-1800" style={{ transformOrigin: '557.5px 290px', animationDuration: '10s' }}>
                                    <path d="M 557.5 290 L 680 270 L 680 275 L 557.5 295 Z" />
                                    <g className="animate-hookBob" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
                                        <line x1="650" y1="272" x2="650" y2="330" stroke="currentColor" strokeWidth="1" className="animate-fadeIn anim-delay-2200" />
                                        <rect x="646" y="330" width="8" height="8" className="animate-fadeIn anim-delay-2200" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="animate-fadeInUp">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight mb-4">Ready to <span className="text-emerald-500">Transform</span> Your Business?</h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-8">Join thousands of businesses already using our platform to streamline operations and boost growth.</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-md font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg">Try Demo Now &rarr;</button>
                            <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-md font-semibold bg-white text-slate-700 dark:bg-yellow-400 dark:text-slate-900 border-2 border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500 transition-all shadow-lg transform hover:scale-105">Start Free Trial</button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* USP Section */}
            <section ref={addToRefs} className="py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="scroll-animate slide-up">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">The All-in-One Advantage</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16">
                            Break free from scattered tools. Our unified platform brings everything your business needs under one roof, simplifying workflows and unlocking growth.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
                        <div className="p-6 scroll-animate slide-up stagger-child-1">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">Unified Operations</h3>
                            <p className="text-slate-500 dark:text-slate-400">Manage CRM, ERP, Finance, and Compliance from a single, intuitive dashboard. Eliminate data silos and improve team collaboration.</p>
                        </div>
                        <div className="p-6 scroll-animate slide-up stagger-child-2">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">AI-Powered Insights</h3>
                            <p className="text-slate-500 dark:text-slate-400">Leverage artificial intelligence to automate tasks, generate reports, and uncover actionable insights that drive your business forward.</p>
                        </div>
                        <div className="p-6 scroll-animate slide-up stagger-child-3">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">Scalable & Secure</h3>
                            <p className="text-slate-500 dark:text-slate-400">Built on a robust infrastructure that grows with you, ensuring your data is always safe, secure, and accessible.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Combined Features Section (USPs) */}
            <section id="features" ref={addToRefs} className="py-24 bg-slate-50 dark:bg-slate-900/70">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Everything Your Business Needs</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">Powerful modules that work together seamlessly to grow your business</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                       <FeatureCard
                         className="stagger-child-1"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                         title="Compliance Management"
                         description="Stay compliant with automated tracking and regulatory requirement management."
                         features={["Regulatory tracking", "Audit trails", "Compliance reports"]}
                       />
                       <FeatureCard 
                         className="stagger-child-2"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                         title="Investment Management"
                         description="Manage business investments, track performance, and optimize returns."
                         features={["Portfolio tracking", "Performance analytics", "Risk assessment"]}
                       />
                       <FeatureCard 
                         className="stagger-child-3"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                         title="Analytics & Reporting"
                         description="Get insights with comprehensive analytics and customizable reports."
                         features={["Real-time dashboards", "Custom reports", "Data visualization"]}
                       />
                       <FeatureCard 
                         className="stagger-child-4"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg>}
                         title="CRM & Lead Management"
                         description="Track leads, manage customers, and boost sales with our comprehensive CRM system."
                         features={["Lead tracking & scoring", "Customer database", "Sales pipeline"]}
                       />
                       <FeatureCard 
                         className="stagger-child-5"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>}
                         title="ERP & Operations"
                         description="Streamline operations with inventory, procurement, and resource planning tools."
                         features={["Inventory management", "Supply chain tracking", "Resource planning"]}
                       />
                       <FeatureCard 
                         className="stagger-child-6"
                         icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                         title="Finance & Accounting"
                         description="Complete financial management with invoicing, payments, and reporting."
                         features={["PDF Generation", "Payment tracking", "Financial reports"]}
                       />
                    </div>
                </div>
            </section>
            
            {/* Stats Section */}
            <section ref={addToRefs} className="bg-emerald-600 text-white py-16 scroll-animate">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div><p className="text-4xl font-bold"><AnimatedCounter value={10000} /></p><p className="text-emerald-200">Businesses Trust Us</p></div>
                        <div><p className="text-4xl font-bold"><AnimatedCounter value={99.9} suffix="%" duration={3000} /></p><p className="text-emerald-200">Uptime Guarantee</p></div>
                        <div><p className="text-4xl font-bold">24/7</p><p className="text-emerald-200">Customer Support</p></div>
                        <div><p className="text-4xl font-bold"><AnimatedCounter value={50} />+</p><p className="text-emerald-200">Integrations</p></div>
                    </div>
                </div>
            </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-slate-800 text-slate-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-xl font-bold text-white mb-2">Finrp</h4>
                        <p className="text-slate-400 text-sm">The complete business management solution for small and medium enterprises.</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-white mb-4">Product</h5>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>
                     <div>
                        <h5 className="font-semibold text-white mb-4">Company</h5>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                     <div>
                        <h5 className="font-semibold text-white mb-4">Support</h5>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Finrp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default HomePage;