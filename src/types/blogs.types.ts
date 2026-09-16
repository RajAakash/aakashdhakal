export type BlogPost = {
  title: string;
  link: string;
  date: string;
  snippet: string;
  categories: string[];
};

export type MediumBlogApiResponse = {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  isoDate: string;
  categories: string[];
};
