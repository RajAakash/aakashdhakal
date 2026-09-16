import type { APIRoute } from 'astro';
import Parser from 'rss-parser';
import type { BlogPost, MediumBlogApiResponse } from '../../types/blogs.types';
import { BLOG_POST_API } from '../../api/blog-post.api';
import { extractBlogContent } from '../../utils/extract-blog-content';

export const prerender = false;

const parser = new Parser();

export const GET: APIRoute = async () => {
  const feed = await parser.parseURL(BLOG_POST_API);

  const posts: BlogPost[] = feed.items.map((post) =>
    extractBlogContent(post as MediumBlogApiResponse)
  );

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
