export interface Quote {
  content: string;
  author: string;
  tags?: string[];
}

export interface FavqsQuote {
  id: number;
  body: string;
  author: string;
  tags: string[];
}
