
import React from 'react';
import { PubMedArticle, ExtractedInfo } from '../types';
import { Loader } from './Loader';

interface ArticleDetailProps {
  article: PubMedArticle | null;
  extractedInfo: ExtractedInfo | null;
  isLoading: boolean;
  onClearSelection: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="text-sm font-bold text-blue-700 mb-2 uppercase tracking-wider">{title}</h4>
        {children}
    </div>
);


export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, extractedInfo, isLoading, onClearSelection }) => {
  if (!article) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow p-10 text-center text-slate-500">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Select an Article</h3>
            <p className="mt-1 text-sm text-gray-500">Choose an article from the list to see its details and AI-powered insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-4 sm:p-6 rounded-lg shadow-lg relative">
        <button onClick={onClearSelection} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{article.title}</h2>
      <p className="text-sm text-slate-600 mb-1">{article.authors.join(', ')}</p>
      <p className="text-sm font-medium text-slate-500 mb-6">{article.journal} ({article.pubDate})</p>

      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2 border-b pb-2">Abstract</h3>
            <p className="text-slate-700 leading-relaxed text-sm">{article.abstract}</p>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2 flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Gemini Insights
            </h3>
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-lg shadow-sm">
                    <Loader />
                    <p className="mt-4 text-slate-600">Analyzing abstract...</p>
                </div>
            )}
            {extractedInfo && !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <InfoCard title="Summary">
                            <p className="text-slate-600 text-sm leading-relaxed">{extractedInfo.summary}</p>
                        </InfoCard>
                    </div>
                    <InfoCard title="Key Findings">
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                            {extractedInfo.keyFindings.map((finding, index) => <li key={index}>{finding}</li>)}
                        </ul>
                    </InfoCard>
                     <InfoCard title="Methodology">
                        <p className="text-slate-600 text-sm">{extractedInfo.methodology}</p>
                    </InfoCard>
                    <div className="md:col-span-2">
                        <InfoCard title="Potential Clinical Significance">
                            <p className="text-slate-600 text-sm">{extractedInfo.clinicalSignificance}</p>
                        </InfoCard>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
