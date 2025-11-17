import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';
import { searchArticles } from './services/pubmedService';
import { extractInfoFromAbstract, summarizeAbstracts } from './services/geminiService';
import { PubMedArticle, ExtractedInfo, GeneratedSummary } from './types';
import { Loader } from './components/Loader';
import { SummaryView } from './components/SummaryView';

const App: React.FC = () => {
  const [articles, setArticles] = useState<PubMedArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<PubMedArticle | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [summary, setSummary] = useState<GeneratedSummary | null>(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(false);
  const [isExtractingInfo, setIsExtractingInfo] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsLoadingArticles(true);
    setError(null);
    setSelectedArticle(null);
    setExtractedInfo(null);
    setSummary(null); // Clear summary on new search
    try {
      const results = await searchArticles(query);
      setArticles(results);
      if (results.length === 0) {
        setError('No articles found for your query.');
      }
    } catch (err) {
      setError('Failed to fetch articles. Please check your network connection or try a different query.');
      console.error(err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  const handleSelectArticle = useCallback(async (article: PubMedArticle) => {
    setSelectedArticle(article);
    setSummary(null); // Clear summary when selecting an article
    setExtractedInfo(null);
    setIsExtractingInfo(true);
    setError(null);
    try {
      if (!article.abstract || article.abstract === 'No abstract available.') {
          throw new Error("This article does not have an abstract to analyze.");
      }
      const info = await extractInfoFromAbstract(article.abstract);
      setExtractedInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to extract insights from the abstract. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsExtractingInfo(false);
    }
  }, []);
  
  const handleSummarizeResults = useCallback(async () => {
    if (articles.length === 0) return;
    setIsSummarizing(true);
    setError(null);
    setSelectedArticle(null);
    setExtractedInfo(null);
    setSummary(null);

    try {
        const abstracts = articles
            .slice(0, 5)
            .map(a => a.abstract)
            .filter(a => a && a !== 'No abstract available.');
        
        if (abstracts.length < 2) {
            throw new Error("Not enough articles with abstracts available to generate a summary.");
        }
        
        const result = await summarizeAbstracts(abstracts);
        setSummary(result);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate summary. ${errorMessage}`);
        console.error(err);
    } finally {
        setIsSummarizing(false);
    }
  }, [articles]);

  const handleClearSelection = useCallback(() => {
    setSelectedArticle(null);
    setExtractedInfo(null);
  }, []);

  const handleClearSummary = useCallback(() => {
    setSummary(null);
  }, []);

  const renderRightPane = () => {
      if (isSummarizing) {
          return (
             <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow p-10 text-center">
                <Loader />
                <p className="mt-4 text-slate-600">Generating summary from top results...</p>
            </div>
          )
      }
      if (summary) {
          return <SummaryView summary={summary} isLoading={isSummarizing} onClearSummary={handleClearSummary} />
      }
      if (selectedArticle) {
          return <ArticleDetail
                article={selectedArticle}
                extractedInfo={extractedInfo}
                isLoading={isExtractingInfo}
                onClearSelection={handleClearSelection}
              />
      }
      return (
        <div className="flex items-center justify-center h-full bg-white rounded-lg shadow p-10 text-center text-slate-500">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Select an Article or Summarize</h3>
                <p className="mt-1 text-sm text-gray-500">Choose an article from the list to see its details or summarize the top results for a high-level overview.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoadingArticles} />
          {error && !isLoadingArticles && !isSummarizing && (
            <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
          )}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-xl font-bold text-slate-700">Search Results</h2>
                {articles.length > 1 && (
                    <button
                        onClick={handleSummarizeResults}
                        disabled={isSummarizing || isLoadingArticles}
                        className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {isSummarizing ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Summarizing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                                </svg>
                                Summarize
                            </>
                        )}
                    </button>
                )}
              </div>
              {isLoadingArticles ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                  <Loader />
                </div>
              ) : (
                <ArticleList
                  articles={articles}
                  selectedArticleId={selectedArticle?.id ?? null}
                  onSelectArticle={handleSelectArticle}
                />
              )}
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              {renderRightPane()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
