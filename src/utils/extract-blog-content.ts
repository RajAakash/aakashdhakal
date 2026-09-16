import type { MediumBlogApiResponse } from '../types/blogs.types';

import * as cheerio from 'cheerio';

function cleanText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[​-‍﻿]/g, '')
    .trim();
}

function isMeaningfulParagraph(text: string) {
  const wordCount = text.split(' ').length;

  if (wordCount < 12) return false;
  if (text.length < 60) return false;
  if (/^https?:\/\//i.test(text)) return false;
  if ((text.match(/http/g) || []).length > 2) return false;

  return true;
}

function truncateAtSentence(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const truncated = text.slice(0, maxChars);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');

  const cutIndex = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (cutIndex > maxChars * 0.6) {
    return truncated.slice(0, cutIndex + 1);
  }

  return truncated.trimEnd() + '…';
}

export function excerptFromHTML(html: string, maxChars = 1000) {
  const $ = cheerio.load(html);

  const paragraphs = $('p')
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(isMeaningfulParagraph);

  if (paragraphs.length > 0) {
    return truncateAtSentence(paragraphs[0], maxChars);
  }

  const fullText = cleanText($.text());

  return truncateAtSentence(fullText, maxChars);
}

export const extractBlogContent = (post: MediumBlogApiResponse) => {
  return {
    title: post.title || 'No title',
    link: post.link || '#',
    date: post.pubDate || '',
    snippet: excerptFromHTML(post.content || ''),
    categories: (post.categories || []).map((category) => category.replace(/-/g, ' ')),
  };
};
