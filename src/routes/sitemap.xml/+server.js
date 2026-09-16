import { getAllPosts } from '$lib/blog/posts.js';
import { identity, projects } from '$lib/content/site.js';

export const prerender = true;

/**
 * Static sitemap, regenerated on every build from the same sources the pages
 * render from: site.js for projects, src/posts for the journal.
 */
export function GET() {
  const base = identity.url.replace(/\/$/, '');

  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/projects', priority: '0.8' },
    { loc: '/blog', priority: '0.8' },
    ...projects.map((p) => ({ loc: `/projects/${p.slug}`, priority: '0.6' })),
    ...getAllPosts().map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.date, priority: '0.5' }))
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url><loc>${base}${u.loc}</loc>` +
        (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
        `<priority>${u.priority}</priority></url>`
    ),
    '</urlset>',
    ''
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
