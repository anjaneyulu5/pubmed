import React from 'react';
import { GeneratedSummary } from '../types';
import { Loader } from './Loader';

interface SummaryViewProps {
  summary: GeneratedSummary | null;
  isLoading: boolean;
  onClearSummary: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wider">{title}</h4>
        {children}
    </div>
);

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, isLoading, onClearSummary }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow p-10 text-center">
        <Loader />
        <p className="mt-4 text-slate-600">Generating summary from top results...</p>
      </div>
    );
  }

  if (!summary) {
    return null; // Should be handled by parent, but as a fallback
  }

  return (
    <div className="bg-slate-50 p-4 sm:p-6 rounded-lg shadow-lg relative">
        <button onClick={onClearSummary} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
        </svg>
        AI-Generated Summary of Top Results
      </h2>

      <div className="space-y-6">
        <InfoCard title="Overall Summary">
            <p className="text-slate-600 text-sm leading-relaxed">{summary.overallSummary}</p>
        </InfoCard>
        
        <InfoCard title="Common Themes">
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                {summary.commonThemes.map((theme, index) => <li key={index}>{theme}</li>)}
            </ul>
        </InfoCard>
        
        <InfoCard title="Differing or Unique Findings">
            <p className="text-slate-600 text-sm">{summary.differingFindings}</p>
        </InfoCard>
      </div>
    </div>
  );
};
