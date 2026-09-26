import { load as yamlLoad } from 'js-yaml';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-docker.js';
import 'prismjs/components/prism-nginx.js';
import 'prismjs/components/prism-ini.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';

// Read all raw markdown posts in src/posts using Vite's glob
const rawPosts = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

/**
 * Pure JS frontmatter extractor.
 * Replaces gray-matter to eliminate Node.js Buffer dependencies in browser/Vite environments.
 */
function parseFrontMatter(raw) {
  if (!raw || typeof raw !== 'string') return { data: {}, content: '' };
  if (!raw.startsWith('---')) return { data: {}, content: raw };

  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data: {}, content: raw };

  const frontString = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();

  try {
    const data = yamlLoad(frontString) || {};
    return { data, content };
  } catch (err) {
    console.warn('Failed to parse YAML frontmatter:', err);
    return { data: {}, content };
  }
}

/**
 * Extract clean slug from filename.
 * e.g. "2026-07-03-membangun-ha-web-server-aws.md" -> "membangun-ha-web-server-aws"
 */
function extractSlug(path) {
  const filename = path.split('/').pop().replace(/\.md$/, '');
  const match = filename.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
  return match ? match[1] : filename;
}

// Journal timezone (WIB). Asia/Jakarta is a fixed UTC+7 with no DST.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Format a front matter date as YYYY-MM-DD, keeping the calendar date the author wrote.
 * "2026-09-14 00:00:00 +0700" returns its own date part; converting it through UTC
 * would shift midnight WIB back to the previous day.
 */
function formatDisplayDate(dateInput, fallbackPath = '') {
  const leading = typeof dateInput === 'string' && dateInput.match(/^(\d{4}-\d{2}-\d{2})/);
  if (leading) return leading[1];

  // Date objects (or other parseable formats) no longer carry the written offset,
  // so render them in WIB rather than UTC.
  if (dateInput) {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) return new Date(d.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
  }

  const fromFilename = fallbackPath.split('/').pop().match(/^(\d{4}-\d{2}-\d{2})/);
  if (fromFilename) return fromFilename[1];
  return dateInput ? String(dateInput) : '';
}

/**
 * Estimate reading time in minutes based on word count.
 */
function getReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return `${time} min read`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Preprocess markdown content to handle Chirpy/Jekyll extensions.
 */
function preprocessMarkdown(content, mediaSubpath = '') {
  let text = content;

  // 1. Remove markdownlint directives
  text = text.replace(/<!--\s*markdownlint-[^>]+-->/g, '');

  // 2. Handle YouTube embeds {% include embed/youtube.html id='...' %}
  text = text.replace(
    /\{%\s*include\s+embed\/youtube\.html\s+id=['"]([^'"]+)['"]\s*%\}/g,
    '<div class="my-8 aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-lg border border-white/15 bg-black"><iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
  );

  // 3. Handle Chirpy blockquote prompts like:
  // > An example showing the `tip` type prompt.
  // {: .prompt-tip }
  text = text.replace(
    /(?:^|\n)((?:>[^\n]*(?:\n|$))+)\s*\{:\s*\.prompt-([a-z]+)\s*\}/gm,
    (match, quoteBlock, promptType) => {
      const cleaned = quoteBlock.replace(/^>\s?/gm, '').trim();
      const colorMap = {
        tip: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/5', text: 'text-emerald-400', label: 'TIP' },
        info: { border: 'border-sky-500/40', bg: 'bg-sky-500/5', text: 'text-sky-400', label: 'INFO' },
        warning: { border: 'border-amber-500/40', bg: 'bg-amber-500/5', text: 'text-amber-400', label: 'WARNING' },
        danger: { border: 'border-rose-500/40', bg: 'bg-rose-500/5', text: 'text-rose-400', label: 'DANGER' }
      };
      const theme = colorMap[promptType] || colorMap.info;
      return `\n\n<div class="prompt-box my-6 rounded-none border ${theme.border} ${theme.bg} p-5 font-sans">
        <div class="mb-2 font-mono text-[11px] font-semibold tracking-wider ${theme.text}">[ ${theme.label} ]</div>
        <div class="text-sm leading-relaxed" style="color: var(--blog-text-primary); opacity: 0.9;">${marked.parseInline(cleaned)}</div>
      </div>\n\n`;
    }
  );

  // 4. Clean up remaining Kramdown attribute annotations like {: .mt-4 .mb-0 } or {: .filepath}
  // Leave code block {: file='...'} to be processed by renderer
  text = text.replace(/\{:\s*(?!\s*file=['"])[^}]+\}/g, '');

  // 5. Rewrite Jekyll /posts/:slug/ links to /blog/:slug
  text = text.replace(/\]\(\/posts\/([a-zA-Z0-9_-]+)\/?([#?][^)]*)?\)/g, '](/blog/$1$2)');

  // 6. Rewrite Jekyll relative links like [Text and Typography](../text-and-typography/) to /blog/:slug
  text = text.replace(/\]\(\.\.\/([a-zA-Z0-9_-]+)\/?([#?][^)]*)?\)/g, '](/blog/$1$2)');

  return text;
}

/**
 * Configure marked renderer with TOC collector.
 */
function createRenderer(mediaSubpath = '', tocCollector = []) {
  const renderer = new marked.Renderer();

  // Enhance link handling: external links open in new tab, relative links sanitized
  const origLink = renderer.link;
  renderer.link = function ({ href, title, text }) {
    let cleanHref = href || '';
    if (cleanHref.startsWith('/posts/')) {
      cleanHref = cleanHref.replace(/^\/posts\//, '/blog/').replace(/\/$/, '');
    } else if (cleanHref.startsWith('../') && !cleanHref.includes('assets/')) {
      cleanHref = '/blog/' + cleanHref.replace(/^\.\.\//, '').replace(/\/$/, '');
    }
    const titleAttr = title ? ` title="${title}"` : '';
    const isExternal = cleanHref.startsWith('http://') || cleanHref.startsWith('https://');
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${cleanHref}"${titleAttr}${targetAttr}>${text}</a>`;
  };

  // Custom heading renderer to assign IDs for Table of Contents & ScrollSpy
  renderer.heading = function ({ text, depth }) {
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    if (depth === 2 || depth === 3) {
      tocCollector.push({
        id,
        text: plainText,
        depth
      });
    }

    return `<h${depth} id="${id}" class="scroll-mt-28">${text}</h${depth}>`;
  };

  // Custom code renderer with PrismJS syntax highlighting
  renderer.code = function ({ text, lang }) {
    const rawCode = text || '';
    const language = (lang || '').trim().toLowerCase();

    // If it's a mermaid diagram, output a container for mermaid.js with expand control
    if (language === 'mermaid') {
      const escapedDiagram = escapeHtml(rawCode);
      return `<div class="mermaid-diagram group relative my-8 overflow-x-auto rounded-lg border p-6 text-center cursor-zoom-in transition-all duration-200" style="border-color: var(--blog-border); background-color: var(--blog-code-bg);" title="Click to expand diagram">
        <div class="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider opacity-60 transition-opacity group-hover:opacity-100" style="border-color: var(--blog-border); background-color: var(--blog-surface); color: var(--blog-text-muted);">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>Expand</span>
        </div>
        <div class="mermaid" data-diagram="${escapedDiagram}">${escapedDiagram}</div>
      </div>`;
    }

    // Check if there's a filename annotation like {: file='filename.ext'} in the rawCode
    let filename = '';
    let cleanCode = rawCode;
    const fileMatch = cleanCode.match(/\{:\s*file=['"]([^'"]+)['"]\}/);
    if (fileMatch) {
      filename = fileMatch[1];
      cleanCode = cleanCode.replace(/\{:\s*file=['"][^'"]+['"]\}/g, '').trim();
    }

    const header = filename || language;

    // Syntax highlighting via Prism
    const langAliases = {
      sh: 'bash',
      shell: 'bash',
      zsh: 'bash',
      bash: 'bash',
      yml: 'yaml',
      yaml: 'yaml',
      json: 'json',
      py: 'python',
      python: 'python',
      js: 'javascript',
      javascript: 'javascript',
      ts: 'typescript',
      typescript: 'typescript',
      docker: 'docker',
      dockerfile: 'docker',
      sql: 'sql',
      nginx: 'nginx',
      conf: 'nginx',
      ini: 'ini',
      html: 'markup',
      xml: 'markup',
      css: 'css',
      md: 'markdown',
      markdown: 'markdown'
    };

    const mappedLang = langAliases[language] || language;
    let formattedHtml = '';
    if (mappedLang && Prism.languages[mappedLang]) {
      try {
        formattedHtml = Prism.highlight(cleanCode, Prism.languages[mappedLang], mappedLang);
      } catch {
        formattedHtml = escapeHtml(cleanCode);
      }
    } else {
      formattedHtml = escapeHtml(cleanCode);
    }

    return `
      <div class="code-block my-6 overflow-hidden rounded-none border transition-all duration-300" style="background-color: var(--blog-code-bg); border-color: var(--blog-border);">
        <div class="code-block-header flex items-center justify-between border-b px-4 py-2 font-mono text-[11px]" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
          <span class="truncate max-w-[240px] sm:max-w-md">${header || 'code'}</span>
          <div class="flex items-center gap-3">
            <span class="text-[10px] uppercase tracking-wider" style="color: var(--blog-text-muted); opacity: 0.7;">${language || 'code'}</span>
            <button type="button" class="copy-btn text-[10px] uppercase tracking-wider transition-colors cursor-pointer border px-1.5 py-0.5 rounded-none tactical-invert-hover" style="border-color: var(--blog-border); color: var(--blog-text-muted); background-color: var(--blog-surface);" title="Copy code">Copy</button>
          </div>
        </div>
        <pre class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed language-${mappedLang || 'none'}" style="color: var(--blog-code-text); background-color: var(--blog-code-bg);"><code>${formattedHtml}</code></pre>
      </div>
    `;
  };

  // Responsive, lazy loaded images. Official AWS architecture screenshots (sourced
  // from assets/img/posts/resource/) are gated behind a "Secret Source" reveal toggle,
  // since the post body already has a hand-drawn Mermaid/prose walkthrough of the same
  // architecture and this is an optional deep-dive, not primary content.
  renderer.image = function ({ href, title, text }) {
    let cleanHref = href || '';
    if (mediaSubpath && !cleanHref.startsWith('http') && !cleanHref.startsWith('/')) {
      cleanHref = `${mediaSubpath.replace(/\/$/, '')}/${cleanHref.replace(/^\//, '')}`;
    }
    if (cleanHref.startsWith('assets/')) {
      cleanHref = '/' + cleanHref;
    } else if (cleanHref.startsWith('./assets/')) {
      cleanHref = cleanHref.replace(/^\.\//, '/');
    }
    const titleAttr = title ? `title="${title}"` : '';
    const altAttr = text ? `alt="${text}"` : '';
    const imgTag = `<img src="${cleanHref}" ${altAttr} ${titleAttr} loading="lazy" decoding="async" class="mx-auto rounded-lg border border-white/10 max-h-[550px] w-auto object-contain cursor-zoom-in transition-all duration-200 hover:brightness-110 hover:border-white/30" />`;
    const captionTag = text ? `<figcaption class="mt-2.5 text-center font-mono text-[11px] text-ash-2">${text}</figcaption>` : '';

    const isOfficialSource = /\/assets\/img\/posts\/resource\//.test(cleanHref);
    if (!isOfficialSource) {
      return `<figure class="my-8">${imgTag}${captionTag}</figure>`;
    }

    return `
      <details class="secret-source my-8 rounded-none border transition-all duration-300" style="border-color: var(--blog-border); background-color: var(--blog-code-bg);">
        <summary class="cursor-pointer select-none list-none px-4 py-3 font-mono text-[11px] uppercase tracking-wider flex items-center gap-2" style="color: var(--blog-text-muted);">
          <span class="secret-source-caret transition-transform duration-200">▸</span>
          <span>[ SECRET SOURCE ] Lihat arsitektur asli dari AWS</span>
        </summary>
        <div class="px-4 pb-5 pt-1 border-t" style="border-color: var(--blog-border);">
          <figure class="my-0">${imgTag}${captionTag}</figure>
        </div>
      </details>
      <style>
        .secret-source[open] .secret-source-caret { transform: rotate(90deg); }
      </style>
    `;
  };

  // Robust table renderer: Preserves marked native token generation wrapped in responsive container
  const origTable = renderer.table;
  renderer.table = function (token) {
    const tableHtml = origTable.call(this, token);
    return `<div class="table-wrapper my-8 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.01] p-1">${tableHtml}</div>`;
  };

  return renderer;
}

/**
 * Get all parsed posts (metadata only, sorted newest first).
 */
export function getAllPosts() {
  const posts = [];

  for (const [path, raw] of Object.entries(rawPosts)) {
    const { data, content } = parseFrontMatter(raw);
    const slug = extractSlug(path);

    // Skip Jekyll template post
    if (slug === 'template') continue;

    // Skip unpublished/draft posts
    if (data.published === false) continue;

    // Ensure tags and categories are arrays
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const tags = Array.isArray(data.tags) ? data.tags : [];

    posts.push({
      slug,
      path,
      title: data.title || slug,
      description: data.description || '',
      date: formatDisplayDate(data.date, path),
      rawDate: data.date,
      categories,
      tags,
      pin: Boolean(data.pin),
      mermaid: Boolean(data.mermaid || content.includes('```mermaid')),
      readingTime: getReadingTime(content)
    });
  }

  function getPostTimestamp(p) {
    if (p.rawDate) {
      const t = new Date(p.rawDate).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    if (p.date) {
      const t = new Date(p.date).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const match = (p.path || p.slug || '').match(/(\d{4}-\d{2}-\d{2})/);
    if (match) {
      const t = new Date(match[1]).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    return 0;
  }

  // Sort strictly newest date first
  return posts.sort((a, b) => {
    return getPostTimestamp(b) - getPostTimestamp(a);
  });
}

/**
 * Get single post by slug, with parsed HTML content and extracted TOC.
 */
export function getPostBySlug(slug) {
  for (const [path, raw] of Object.entries(rawPosts)) {
    const postSlug = extractSlug(path);
    if (postSlug === slug) {
      const { data, content } = parseFrontMatter(raw);
      if (data.published === false) return null;
      const mediaSubpath = data.media_subpath || '';
      const processedContent = preprocessMarkdown(content, mediaSubpath);

      const toc = [];
      const renderer = createRenderer(mediaSubpath, toc);
      const html = marked.parse(processedContent, {
        renderer,
        gfm: true,
        breaks: true
      });

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: formatDisplayDate(data.date, path),
        rawDate: data.date,
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        pin: Boolean(data.pin),
        mermaid: Boolean(data.mermaid || content.includes('```mermaid')),
        readingTime: getReadingTime(content),
        toc,
        html
      };
    }
  }

  return null;
}

/**
 * Build hierarchical categories tree from posts list:
 * [
 *   {
 *     name: "Cloud Computing",
 *     totalPosts: 7,
 *     subcategories: [
 *       { name: "AWS", count: 7, posts: [...] }
 *     ]
 *   },
 *   ...
 * ]
 */
export function getCategoriesTree(posts) {
  const map = new Map();

  for (const p of posts) {
    const cats = p.categories && p.categories.length > 0 ? p.categories : ['General'];
    const primary = cats[0];
    const secondary = cats[1] || 'General';

    if (!map.has(primary)) {
      map.set(primary, new Map());
    }
    const subMap = map.get(primary);
    if (!subMap.has(secondary)) {
      subMap.set(secondary, []);
    }
    subMap.get(secondary).push(p);
  }

  const result = [];
  for (const [primary, subMap] of map.entries()) {
    const subcategories = [];
    let primaryTotal = 0;

    for (const [sub, subPosts] of subMap.entries()) {
      primaryTotal += subPosts.length;
      subcategories.push({
        name: sub,
        count: subPosts.length,
        posts: subPosts
      });
    }

    // Sort subcategories by post count descending
    subcategories.sort((a, b) => b.count - a.count);

    result.push({
      name: primary,
      totalPosts: primaryTotal,
      subcategories
    });
  }

  // Sort primary categories by total posts descending
  return result.sort((a, b) => b.totalPosts - a.totalPosts);
}

/**
 * Get tag list with count and post references:
 * [
 *   { name: 'aws', count: 7, posts: [...] },
 *   ...
 * ]
 */
export function getTagsWithCount(posts) {
  const map = new Map();

  for (const p of posts) {
    if (!p.tags) continue;
    for (const t of p.tags) {
      const tagKey = t.toLowerCase().trim();
      if (!tagKey) continue;
      if (!map.has(tagKey)) {
        map.set(tagKey, { name: t, count: 0, posts: [] });
      }
      const entry = map.get(tagKey);
      entry.count += 1;
      entry.posts.push(p);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group posts by Year and Month/Date for archive timeline:
 * [
 *   {
 *     year: '2026',
 *     count: 14,
 *     posts: [...]
 *   },
 *   {
 *     year: '2019',
 *     count: 3,
 *     posts: [...]
 *   }
 * ]
 */
export function getArchiveByYear(posts) {
  const map = new Map();

  for (const p of posts) {
    const yearMatch = (p.date || '').match(/^(\d{4})/);
    const year = yearMatch ? yearMatch[1] : 'Undated';

    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year).push(p);
  }

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const result = [];
  for (const [year, yearPosts] of map.entries()) {
    // Group posts within this year by month
    const monthMap = new Map();
    for (const p of yearPosts) {
      const monthMatch = (p.date || '').match(/^\d{4}-(\d{2})/);
      const monthKey = monthMatch ? monthMatch[1] : '00';
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey).push(p);
    }

    const months = [];
    for (const [monthKey, mPosts] of monthMap.entries()) {
      const mNum = parseInt(monthKey, 10);
      const monthName = (mNum >= 1 && mNum <= 12) ? MONTH_NAMES[mNum - 1] : 'Undated';
      months.push({
        month: monthKey,
        monthName,
        count: mPosts.length,
        posts: mPosts
      });
    }

    // Sort months descending (12 -> 01)
    months.sort((a, b) => b.month.localeCompare(a.month));

    result.push({
      year,
      count: yearPosts.length,
      posts: yearPosts, // already sorted newest first
      months
    });
  }

  return result.sort((a, b) => b.year.localeCompare(a.year));
}
