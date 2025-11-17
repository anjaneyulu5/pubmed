
import React from 'react';
import { PubMedArticle } from '../types';

interface ArticleItemProps {
  article: PubMedArticle;
  isSelected: boolean;
  onSelectArticle: (article: PubMedArticle) => void;
}

export const ArticleItem: React.FC<ArticleItemProps> = ({ article, isSelected, onSelectArticle }) => {
  const selectedClasses = 'bg-blue-100 border-l-4 border-blue-600';
  const baseClasses = 'p-4 cursor-pointer transition-colors duration-200 ease-in-out';
  const hoverClasses = 'hover:bg-blue-50';

  return (
    <li
      className={`${baseClasses} ${isSelected ? selectedClasses : hoverClasses}`}
      onClick={() => onSelectArticle(article)}
    >
      <h3 className="font-semibold text-blue-800 text-sm">{article.title}</h3>
      <p className="text-xs text-slate-600 mt-1 truncate">{article.authors.join(', ')}</p>
      <p className="text-xs text-slate-500 mt-1">{article.journal} ({article.pubDate})</p>
    </li>
  );
};
