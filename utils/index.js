import { JSDOM } from 'jsdom';
import totesDefault from './totes.js';

export { default as mail } from './mail.js';
export const totes = totesDefault;

/**
 * @param {string} string_
 */
export function btoa(string_) {
  return Buffer.from(string_, 'binary').toString('base64');
}

/**
 * @param {string} url
 */
export async function getMetadata(url) {
  const { data: html } = await totes(url);
  const dom = new JSDOM(html);

  return {
    title: dom.window.document.title,
    description: dom.window.document.querySelector('meta[name="description"]')
      ?.content,
    content: dom.window.document.querySelector('.entry-content')?.innerHTML,
    categories: [
      ...dom.window.document.querySelectorAll('.meta-categories a'),
    ].map((element) => element.innerHTML),
    tags: [
      ...dom.window.document.querySelectorAll('meta[property="article:tag"]'),
    ].map((element) => element.content),
    imageUrl: dom.window.document.querySelector('meta[property="og:image"]')
      ?.content,
  };
}
