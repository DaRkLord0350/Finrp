import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { BusinessProfile } from '../types';
import useTheme from '../hooks/useTheme';
import ThemeToggle from './ui/ThemeToggle';
import PageHeader from './PageHeader';
import ServicesDashboard from './dashboards/ServicesDashboard';
import RetailDashboard from './dashboards/RetailDashboard';
import ManufacturingDashboard from './dashboards/ManufacturingDashboard';

interface DashboardPageProps {
  businessProfile: BusinessProfile | null;
  navigate: (path: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ businessProfile, navigate }) => {
  const [theme, toggleTheme] = useTheme();

  if (!businessProfile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 animate-fadeInUp">
          <PageHeader
            title="Welcome to your Dashboard!"
            subtitle="Let's get your business profile set up for a personalized experience."
          >
             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </PageHeader>
          <div className="mt-8">
            <Card className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">Personalize Your Dashboard</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">To see relevant metrics, set up your business profile on the compliance page.</p>
              <div className="mt-6">
                  <Button variant="primary" onClick={() => navigate('/dashboard/compliance')}>Go to Setup</Button>
              </div>
            </Card>
          </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on the business industry
  switch (businessProfile.industry) {
    case 'Services':
      return <ServicesDashboard businessProfile={businessProfile} />;
    case 'Retail & Trading':
      return <RetailDashboard businessProfile={businessProfile} />;
    case 'Manufacturing':
      return <ManufacturingDashboard businessProfile={businessProfile} />;
    default:
      return <div className="p-8">Unsupported business industry in profile.</div>;
  }
};

export default DashboardPage;
