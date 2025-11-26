import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  children?: React.ReactNode; // For action buttons
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
            {icon && <span className="mr-3 text-emerald-500">{icon}</span>}
            {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;