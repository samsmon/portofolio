/**
 * The site chrome is English; the journal is written in Indonesian. Stamp the
 * matching language on <html> per route so screen readers and search engines
 * read it correctly. This runs during prerender, so the static HTML carries
 * the attribute too.
 *
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
  const lang = event.url.pathname.startsWith('/blog') ? 'id' : 'en';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${lang}">`)
  });
}
