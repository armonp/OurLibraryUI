export interface Book {
  id: string;
  ISBN: string;
  isbn?: string;
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
  publishedYear?: number;
  notes?: string;
  publishers?: string[];
  genres?: string[];
  subjects?: string[];
  edition?: string;
  description?: string;
  pageCount?: number;
  language?: string;
}
