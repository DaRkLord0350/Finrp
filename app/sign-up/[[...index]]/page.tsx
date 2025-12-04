'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
              card: 'shadow-lg rounded-lg',
            }
          }}
        />
      </div>
    </div>
  );
}
