
import React from 'react';
import { PubMedArticle } from '../types';
import { ArticleItem } from './ArticleItem';

interface ArticleListProps {
  articles: PubMedArticle[];
  selectedArticleId: string | null;
  onSelectArticle: (article: PubMedArticle) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, selectedArticleId, onSelectArticle }) => {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
        <p>No articles to display. Use the search bar to find PubMed articles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-slate-200">
            {articles.map((article) => (
            <ArticleItem
                key={article.id}
                article={article}
                isSelected={article.id === selectedArticleId}
                onSelectArticle={onSelectArticle}
            />
            ))}
        </ul>
    </div>
  );
};
