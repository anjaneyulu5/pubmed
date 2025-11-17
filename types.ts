export interface PubMedArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  abstract: string;
}

export interface ExtractedInfo {
  summary: string;
  keyFindings: string[];
  methodology: string;
  clinicalSignificance: string;
}

export interface GeneratedSummary {
  overallSummary: string;
  commonThemes: string[];
  differingFindings: string;
}
