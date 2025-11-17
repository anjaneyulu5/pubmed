
import { PubMedArticle } from '../types';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

const parseAuthors = (authorList: any[] | undefined): string[] => {
    if (!authorList) return ['Unknown Author'];
    return authorList.map((author: any) => author.name);
}

export const searchArticles = async (query: string): Promise<PubMedArticle[]> => {
  // Step 1: Search for article IDs
  const searchUrl = `${BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=20`;
  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error('Network response from PubMed search was not ok.');
  }
  const searchData = await searchResponse.json();
  const idList = searchData.esearchresult.idlist;

  if (!idList || idList.length === 0) {
    return [];
  }

  // Step 2: Fetch article details using the IDs
  const ids = idList.join(',');
  const fetchUrl = `${BASE_URL}esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
  const fetchResponse = await fetch(fetchUrl);
  if (!fetchResponse.ok) {
    throw new Error('Network response from PubMed fetch was not ok.');
  }
  const fetchData = await fetchResponse.json();

  // Step 3: Fetch abstracts using efetch
  const abstractFetchUrl = `${BASE_URL}efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;
  const abstractResponse = await fetch(abstractFetchUrl);
  if (!abstractResponse.ok) {
    throw new Error('Network response from PubMed abstract fetch was not ok.');
  }
  const abstractText = await abstractResponse.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(abstractText, 'text/xml');
  const articlesXml = xmlDoc.getElementsByTagName('PubmedArticle');
  const abstractsMap: { [key: string]: string } = {};

  for (let i = 0; i < articlesXml.length; i++) {
    const articleNode = articlesXml[i];
    const pmidNode = articleNode.querySelector('PMID');
    const abstractNode = articleNode.querySelector('AbstractText');
    if (pmidNode && abstractNode) {
      const pmid = pmidNode.textContent || '';
      abstractsMap[pmid] = abstractNode.textContent || '';
    }
  }

  // Step 4: Combine details and abstracts
  const articles: PubMedArticle[] = Object.keys(fetchData.result)
    .filter(key => key !== 'uids')
    .map(id => {
      const articleData = fetchData.result[id];
      return {
        id: articleData.uid,
        title: articleData.title,
        authors: parseAuthors(articleData.authors),
        journal: articleData.fulljournalname,
        pubDate: articleData.pubdate,
        abstract: abstractsMap[articleData.uid] || 'No abstract available.',
      };
    });

  return articles;
};
