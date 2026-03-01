/**
 * Template Component: LoadingTemplate
 * Loading state template
 */

import React from 'react';

export const LoadingTemplate: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );
};
