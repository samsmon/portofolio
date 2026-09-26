<script>
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { beforeNavigate, pushState, replaceState } from '$app/navigation';
  import { gsap } from 'gsap';
  import { ease, dur, stagger } from '$lib/motion.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';

  let { data } = $props();

  const reduce = prefersReducedMotion();
  /** @type {gsap.Context | null} */ let ctx = null;

  // ---------------------------------------------------------------------------
  // View state lives in the URL. `?tab=`, `?category=`, `?sub=` and `?tag=` are
  // the single source of truth, so every view has a link, the back button
  // works, and a refresh lands where the visitor was. Shallow pushState keeps
  // it instant: no load function re-runs.
  // ---------------------------------------------------------------------------
  const VALID_TABS = ['home', 'categories', 'tags', 'archive'];

  // Prerendering forbids reading searchParams (the static HTML must not depend
  // on them), so the server renders the home view and the client adopts the
  // URL's view right after hydration. Shallow pushState leaves `page.url`
  // untouched by design, so the query string is mirrored here and kept in
  // sync on popstate for the back and forward buttons.
  let search = $state('');
  const params = $derived(new URLSearchParams(search));

  const activeTab = $derived.by(() => {
    if (params.get('tag')) return 'tags';
    if (params.get('category')) return 'categories';
    const t = params.get('tab');
    return VALID_TABS.includes(t) ? t : 'home';
  });

  const selectedTag = $derived(params.get('tag'));

  const selectedCategory = $derived.by(() => {
    const c = params.get('category');
    if (!c) return null;
    return data.categoriesTree.find((x) => x.name.toLowerCase() === c.toLowerCase()) ?? null;
  });

  const selectedSubcategory = $derived(params.get('sub'));

  /** @type {HTMLElement | null} */ let contentPanel = $state(null);
  /** @type {HTMLInputElement | null} */ let searchInput = $state(null);

  function scrollToPanel() {
    if (typeof window === 'undefined' || !contentPanel) return;
    const rect = contentPanel.getBoundingClientRect();
    // Only pull the page up when the panel top has scrolled out of view.
    if (rect.top >= 0) return;
    const top = rect.top + window.scrollY - 96;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 0.6 });
    else window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }

  function setView(params) {
    const url = new URL(page.url);
    url.search = '';
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
    pushState(url.pathname + url.search, {});
    search = url.search;
    readHomeState(url.searchParams);
    scrollToPanel();
  }

  const switchTab = (id) => setView(id === 'home' ? {} : { tab: id });
  const selectCategory = (cat) => setView({ category: cat.name });
  const backToCategories = () => setView({ tab: 'categories' });
  const selectSubcategory = (name) =>
    setView({ category: selectedCategory?.name, sub: name || undefined });
  const selectTag = (tag) => setView({ tag });
  const backToTags = () => setView({ tab: 'tags' });

  const tabs = [
    { id: 'home', num: '01', label: 'Home' },
    { id: 'categories', num: '02', label: 'Categories' },
    { id: 'tags', num: '03', label: 'Tags' },
    { id: 'archive', num: '04', label: 'Archive' }
  ];

  // ---------------------------------------------------------------------------
  // Home tab: search, quick filter, pagination. Mirrored into `?q=`, `?filter=`
  // and `?page=` with replaceState, so opening a post and pressing back lands
  // on the same filtered page without every keystroke or page flip becoming
  // its own history entry.
  // ---------------------------------------------------------------------------
  let searchQuery = $state('');
  let homeFilterTag = $state('all');
  const POSTS_PER_PAGE = 10;
  let currentPage = $state(1);

  const filteredHomePosts = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    return data.posts.filter((post) => {
      const matchTag =
        homeFilterTag === 'all' ||
        (post.tags && post.tags.some((t) => t.toLowerCase() === homeFilterTag));
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q))) ||
        (post.categories && post.categories.some((c) => c.toLowerCase().includes(q)));
      return matchTag && matchQuery;
    });
  });

  const totalPages = $derived(Math.max(1, Math.ceil(filteredHomePosts.length / POSTS_PER_PAGE)));

  const displayedHomePosts = $derived.by(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredHomePosts.slice(start, start + POSTS_PER_PAGE);
  });

  const topTags = $derived(['all', ...data.tagsWithCount.slice(0, 8).map((t) => t.name.toLowerCase())]);

  /** Adopt the home state from the query string, correcting invalid values. */
  function readHomeState(params) {
    searchQuery = params.get('q') ?? '';
    const f = (params.get('filter') ?? 'all').toLowerCase();
    homeFilterTag = topTags.includes(f) ? f : 'all';
    const p = Number.parseInt(params.get('page') ?? '1', 10);
    // totalPages is derived from the query and filter just set above.
    currentPage = Number.isFinite(p) ? Math.min(Math.max(1, p), totalPages) : 1;
  }

  let urlSyncTimer;

  /** Write the home state back to the URL without adding a history entry. */
  function writeHomeState({ debounce = false } = {}) {
    clearTimeout(urlSyncTimer);
    urlSyncTimer = undefined;
    const write = () => {
      urlSyncTimer = undefined;
      if (activeTab !== 'home') return;
      const url = new URL(window.location.href);
      url.search = '';
      const q = searchQuery.trim();
      if (q) url.searchParams.set('q', q);
      if (homeFilterTag !== 'all') url.searchParams.set('filter', homeFilterTag);
      if (currentPage > 1) url.searchParams.set('page', String(currentPage));
      if (url.search === window.location.search) return;
      replaceState(url.pathname + url.search, page.state);
      search = url.search;
    };
    if (debounce) urlSyncTimer = setTimeout(write, 300);
    else write();
  }

  // Leaving mid-debounce (typing, then opening a post): flush the pending sync
  // while this page's history entry is still current, so back restores it.
  beforeNavigate(() => {
    if (urlSyncTimer) writeHomeState();
  });

  function onSearchInput() {
    currentPage = 1;
    writeHomeState({ debounce: true });
  }

  function clearSearch() {
    searchQuery = '';
    currentPage = 1;
    writeHomeState();
  }

  function goToPage(p) {
    if (p < 1 || p > totalPages || p === currentPage) return;
    currentPage = p;
    writeHomeState();
    scrollToPanel();
  }

  function setHomeFilterTag(tag) {
    if (homeFilterTag === tag) return;
    homeFilterTag = tag;
    currentPage = 1;
    writeHomeState();
  }

  // ---------------------------------------------------------------------------
  // Category and tag views
  // ---------------------------------------------------------------------------
  const categoryPosts = $derived.by(() => {
    if (!selectedCategory) return [];
    if (!selectedSubcategory) {
      const all = [];
      const seen = new Set();
      for (const sub of selectedCategory.subcategories || []) {
        for (const p of sub.posts || []) {
          if (!seen.has(p.slug)) {
            seen.add(p.slug);
            all.push(p);
          }
        }
      }
      return all;
    }
    const sub = selectedCategory.subcategories?.find((s) => s.name === selectedSubcategory);
    return sub?.posts || [];
  });

  const tagPosts = $derived.by(() => {
    if (!selectedTag) return [];
    const found = data.tagsWithCount.find((t) => t.name.toLowerCase() === selectedTag.toLowerCase());
    return found?.posts || [];
  });

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  onMount(() => {
    search = window.location.search;
    readHomeState(new URLSearchParams(search));
    window.__lenis?.start();
    ctx = gsap.context(() => {});

    const onPop = () => {
      search = window.location.search;
      readHomeState(new URLSearchParams(search));
    };
    window.addEventListener('popstate', onPop);

    function onKey(e) {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (activeTab !== 'home') switchTab('home');
        tick().then(() => searchInput?.focus());
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      // A pending search sync must not rewrite the URL of the next page.
      clearTimeout(urlSyncTimer);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      ctx?.revert();
      ctx = null;
    };
  });

  // List entrance whenever the visible set changes.
  $effect(() => {
    activeTab;
    currentPage;
    homeFilterTag;
    searchQuery;
    selectedCategory;
    selectedSubcategory;
    selectedTag;

    if (reduce) return;
    requestAnimationFrame(() => {
      if (!ctx) return;
      ctx.add(() => {
        for (const sel of ['[data-post-card]', '[data-category-card]', '[data-tag-pill]', '[data-archive-group]']) {
          const dense = sel === '[data-tag-pill]';
          gsap.killTweensOf(sel);
          gsap.fromTo(
            sel,
            { y: dense ? 12 : 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: dur.sm,
              stagger: dense ? stagger.tight : stagger.base,
              ease: ease.ui,
              // Never 'all': that wipes the inline theme colours on the cards.
              clearProps: 'transform,opacity'
            }
          );
        }
      });
    });
  });
</script>

<svelte:head>
  <title>Engineering Journal — Suryatmaja</title>
  <meta
    name="description"
    content="Technical notes, cloud architectures, homelab logs and software engineering investigations by Bakti Surya Atmaja."
  />
</svelte:head>

<!-- One post row, shared by the home, category and tag lists. -->
{#snippet postCard(post)}
  <article
    data-post-card
    class="group relative flex flex-col justify-between gap-4 rounded-none border p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6"
    style="background-color: var(--blog-surface); border-color: var(--blog-border);"
  >
    <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
    <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
    <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
    <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
      style="background-color: var(--blog-accent);"
      aria-hidden="true"
    ></span>

    <div>
      <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-label" style="color: var(--blog-text-muted);">
        <div class="flex items-center gap-2">
          <time datetime={post.date}>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
        {#if post.categories && post.categories.length > 0}
          <span class="uppercase tracking-widest font-semibold" style="color: var(--blog-accent);">
            {post.categories.slice(0, 3).join(' / ')}
          </span>
        {/if}
      </div>

      <a href={`/blog/${post.slug}`} class="mt-2 block">
        <h2 class="text-h3 font-display font-semibold leading-snug tracking-tight transition-colors duration-150" style="color: var(--blog-text-primary);">
          {post.title}
        </h2>
      </a>

      {#if post.description}
        <p class="mt-2 max-w-3xl text-caption leading-relaxed" style="color: var(--blog-text-muted);">
          {post.description}
        </p>
      {/if}
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 border-t pt-3 font-mono text-label" style="border-color: var(--blog-border);">
      <ul class="flex flex-wrap items-center gap-1.5">
        {#each (post.tags || []).slice(0, 4) as t}
          <li class="rounded-none border px-2 py-0.5 transition-colors" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-text-muted);">
            #{t}
          </li>
        {/each}
        {#if (post.tags || []).length > 4}
          <li
            class="rounded-none border px-1.5 py-0.5 font-semibold"
            style="border-color: var(--blog-accent); color: var(--blog-accent); background-color: var(--blog-surface);"
            title={(post.tags || []).slice(4).map((t) => '#' + t).join(' ')}
          >
            {(post.tags || []).length - 4}+
          </li>
        {/if}
      </ul>

      <a href={`/blog/${post.slug}`} class="inline-flex items-center gap-1 font-medium hover:underline" style="color: var(--blog-text-primary);">
        <span>Read</span>
        <span class="transition-transform duration-150 group-hover:translate-x-1" style="color: var(--blog-accent);" aria-hidden="true">→</span>
      </a>
    </div>
  </article>
{/snippet}

<!-- Small pill used by the quick filter and subgroup rows. -->
{#snippet pill(label, active, onclick)}
  <button
    type="button"
    {onclick}
    aria-pressed={active}
    class="group relative shrink-0 cursor-pointer select-none rounded-none border px-3 py-1 font-mono text-label uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 {active ? 'font-medium' : 'hover:border-current/60'}"
    style={active
      ? 'background-color: var(--tactical-invert-bg); color: var(--tactical-invert-text); border-color: var(--tactical-invert-bg);'
      : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
  >
    <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t transition-opacity duration-150 {active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-opacity duration-150 {active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
    <span class="relative z-10">{label}</span>
  </button>
{/snippet}

<div class="tactical-tech-bg w-full min-h-screen">
  <section class="wrap pt-24 pb-20 lg:pt-28">
    <!-- Breadcrumb and header -->
    <header data-blog-header class="mb-8 space-y-3 border-b pb-5" style="border-color: var(--blog-border);">
      <nav aria-label="Breadcrumbs" class="flex items-center gap-2 font-mono text-label uppercase tracking-[0.2em]" style="color: var(--blog-text-muted);">
        <a href="/" class="hover:underline">Home</a>
        <span aria-hidden="true">/</span>
        {#if activeTab === 'home'}
          <span style="color: var(--blog-text-primary);">Blog</span>
        {:else}
          <button type="button" onclick={() => switchTab('home')} class="cursor-pointer hover:underline" style="color: var(--blog-text-primary);">Blog</button>
          <span aria-hidden="true">/</span>
          {#if (activeTab === 'categories' && selectedCategory) || (activeTab === 'tags' && selectedTag)}
            <button
              type="button"
              onclick={() => (activeTab === 'categories' ? backToCategories() : backToTags())}
              class="cursor-pointer capitalize hover:underline"
              style="color: var(--blog-accent);"
            >
              {activeTab}
            </button>
            <span aria-hidden="true">/</span>
            <span style="color: var(--blog-text-primary);">
              {activeTab === 'categories' ? selectedCategory.name : `#${selectedTag}`}
            </span>
          {:else}
            <span class="capitalize" style="color: var(--blog-accent);">{activeTab}</span>
          {/if}
        {/if}
      </nav>

      <div>
        <h1 class="text-h2 font-display leading-tight tracking-tight" style="color: var(--blog-text-primary);">
          Engineering Journal
        </h1>
        <p class="mt-1.5 max-w-[var(--measure)] text-caption leading-relaxed" style="color: var(--blog-text-muted);">
          Technical documentation, cloud architecture and systems engineering field notes.
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      <!-- Sidebar: sticks on desktop, scrolls as a row on mobile -->
      <aside data-blog-sidebar class="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
        <nav aria-label="Journal sections" class="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs sm:flex-wrap lg:flex-col lg:items-stretch lg:overflow-visible lg:pb-0">
          {#each tabs as tab}
            {@const active = activeTab === tab.id}
            <button
              type="button"
              onclick={() => switchTab(tab.id)}
              aria-current={active ? 'page' : undefined}
              class="group relative flex shrink-0 cursor-pointer select-none items-center justify-between rounded-none border px-3.5 py-2.5 text-left transition-all duration-200 lg:w-full {active
                ? 'font-semibold hover:translate-x-1 active:translate-x-0'
                : 'tactical-invert-hover hover:translate-x-0.5 active:translate-x-0'}"
              style={active
                ? 'background-color: var(--blog-accent-subtle); color: var(--blog-text-primary); border-color: var(--blog-accent);'
                : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
            >
              {#if active}
                <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
              {/if}
              <span class="flex items-center gap-2.5">
                <span data-tab-num class="text-label" style={active ? 'color: var(--blog-accent); font-weight: 700;' : 'color: var(--blog-text-muted);'}>{tab.num}</span>
                <span class="font-medium uppercase tracking-wider">{tab.label}</span>
              </span>
              {#if active}
                <span class="hidden text-xs transition-transform duration-200 group-hover:translate-x-1 lg:inline" style="color: var(--blog-accent);" aria-hidden="true">→</span>
              {/if}
            </button>
          {/each}
        </nav>

        <dl class="mt-5 hidden space-y-2 border-t pt-4 font-mono text-label uppercase tracking-wider lg:block" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
          <div class="flex items-center justify-between py-0.5">
            <dt>Articles</dt>
            <dd class="font-bold" style="color: var(--blog-accent);">{data.posts.length}</dd>
          </div>
          <div class="flex items-center justify-between py-0.5">
            <dt>Categories</dt>
            <dd class="font-bold" style="color: var(--blog-accent);">{data.categoriesTree.length}</dd>
          </div>
          <div class="flex items-center justify-between py-0.5">
            <dt>Tags</dt>
            <dd class="font-bold" style="color: var(--blog-accent);">{data.tagsWithCount.length}</dd>
          </div>
        </dl>
      </aside>

      <!-- Content -->
      <main bind:this={contentPanel} class="min-w-0 lg:col-span-9">
        {#if activeTab === 'home'}
          <div class="space-y-5">
            <div class="space-y-3 border-b pb-4" style="border-color: var(--blog-border);">
              <div class="relative">
                <label for="journal-search" class="sr-only">Search articles</label>
                <input
                  id="journal-search"
                  bind:this={searchInput}
                  type="search"
                  bind:value={searchQuery}
                  oninput={onSearchInput}
                  placeholder="Search by title, topic or tech stack"
                  class="w-full rounded-none border px-3.5 py-2.5 font-mono text-base transition-colors sm:text-sm"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                />
                {#if searchQuery}
                  <button
                    type="button"
                    onclick={clearSearch}
                    class="absolute right-3 top-2.5 cursor-pointer font-mono text-label uppercase hover:underline"
                    style="color: var(--blog-text-muted);"
                  >
                    Clear
                  </button>
                {/if}
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1 sm:flex-wrap sm:overflow-visible">
                  <span class="mr-1 inline-flex shrink-0 items-center gap-1.5 font-mono text-label uppercase tracking-wider" style="color: var(--blog-text-muted);">
                    <span class="block h-1.5 w-1.5 shrink-0" style="background-color: var(--blog-accent);" aria-hidden="true"></span>
                    Filter
                  </span>
                  {#each topTags as tag}
                    {@render pill(`#${tag}`, homeFilterTag === tag, () => setHomeFilterTag(tag))}
                  {/each}
                </div>
                <span class="font-mono text-label" style="color: var(--blog-text-muted);">
                  {filteredHomePosts.length} {filteredHomePosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            {#if displayedHomePosts.length === 0}
              <div class="rounded-none border p-8 text-center font-mono text-sm" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                No articles match the current search or filter.
              </div>
            {:else}
              <div class="space-y-4">
                {#each displayedHomePosts as post (post.slug)}
                  {@render postCard(post)}
                {/each}
              </div>
            {/if}

            {#if totalPages > 1}
              <nav aria-label="Pagination" class="flex items-center justify-between border-t pt-4 font-mono text-xs" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onclick={() => goToPage(currentPage - 1)}
                  class="tactical-invert-hover inline-flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
                >
                  <span aria-hidden="true">←</span>
                  <span>Previous</span>
                </button>

                <div class="flex items-center gap-1">
                  {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
                    {@const isPageActive = currentPage === pageNum}
                    <button
                      type="button"
                      onclick={() => goToPage(pageNum)}
                      aria-current={isPageActive ? 'page' : undefined}
                      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none border font-mono text-xs transition-colors {isPageActive ? '' : 'tactical-invert-hover'}"
                      style={isPageActive
                        ? 'background-color: var(--tactical-invert-bg); color: var(--tactical-invert-text); border-color: var(--tactical-invert-bg); font-weight: 600;'
                        : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
                    >
                      {pageNum}
                    </button>
                  {/each}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onclick={() => goToPage(currentPage + 1)}
                  class="tactical-invert-hover inline-flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
                >
                  <span>Next</span>
                  <span aria-hidden="true">→</span>
                </button>
              </nav>
            {/if}
          </div>

        {:else if activeTab === 'categories'}
          {#if !selectedCategory}
            <div class="space-y-5">
              <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--blog-border);">
                <div>
                  <h2 class="font-mono text-sm font-semibold uppercase tracking-widest" style="color: var(--blog-text-primary);">Categories</h2>
                  <p class="mt-0.5 text-caption" style="color: var(--blog-text-muted);">Pick a category to see its articles.</p>
                </div>
                <span class="rounded-none border px-2 py-0.5 font-mono text-xs" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{data.categoriesTree.length}</strong> categories
                </span>
              </div>

              <div class="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2">
                {#each data.categoriesTree as cat (cat.name)}
                  <button
                    type="button"
                    data-category-card
                    onclick={() => selectCategory(cat)}
                    class="group relative flex cursor-pointer flex-col justify-between gap-4 rounded-none border p-5 text-left transition-colors duration-150"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                  >
                    <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"></span>

                    <div>
                      <div class="mb-2 flex items-center justify-between font-mono text-label" style="color: var(--blog-text-muted);">
                        <span class="font-semibold uppercase tracking-widest" style="color: var(--blog-accent);">Category</span>
                        <span class="rounded-none border px-2 py-0.5" style="background-color: var(--blog-bg); border-color: var(--blog-border);">
                          <strong style="color: var(--blog-accent);">{cat.totalPosts}</strong> {cat.totalPosts === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                      <h3 class="text-h3 font-display font-semibold transition-colors" style="color: var(--blog-text-primary);">{cat.name}</h3>
                      {#if cat.subcategories && cat.subcategories.length > 0}
                        <div class="mt-2.5 flex flex-wrap gap-1.5 font-mono text-label" style="color: var(--blog-text-muted);">
                          {#each cat.subcategories as sub}
                            <span class="rounded-none border px-1.5 py-0.5" style="background-color: var(--blog-bg); border-color: var(--blog-border);">
                              {sub.name} <span style="color: var(--blog-accent);">{sub.count}</span>
                            </span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                    <div class="flex items-center justify-between border-t pt-3 font-mono text-label" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                      <span>Browse</span>
                      <span class="transition-transform duration-150 group-hover:translate-x-1" style="color: var(--blog-accent);" aria-hidden="true">→</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {:else}
            <div class="space-y-5">
              <div class="space-y-3 border-b pb-4" style="border-color: var(--blog-border);">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      onclick={backToCategories}
                      class="tactical-invert-hover flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1 font-mono text-xs transition-all duration-150"
                      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                    >
                      <span aria-hidden="true">←</span>
                      <span>All categories</span>
                    </button>
                    <h2 class="font-mono text-base font-bold uppercase tracking-wider" style="color: var(--blog-text-primary);">{selectedCategory.name}</h2>
                  </div>
                  <span class="rounded-none border px-2 py-0.5 font-mono text-xs" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                    <strong style="color: var(--blog-accent);">{categoryPosts.length}</strong> {categoryPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>

                {#if selectedCategory.subcategories && selectedCategory.subcategories.length > 1}
                  <div class="flex flex-wrap items-center gap-2 py-1">
                    <span class="mr-1 inline-flex shrink-0 items-center gap-1.5 font-mono text-label uppercase tracking-wider" style="color: var(--blog-text-muted);">
                      <span class="block h-1.5 w-1.5 shrink-0" style="background-color: var(--blog-accent);" aria-hidden="true"></span>
                      Subgroup
                    </span>
                    {@render pill(`All (${selectedCategory.totalPosts})`, selectedSubcategory === null, () => selectSubcategory(null))}
                    {#each selectedCategory.subcategories as sub}
                      {@render pill(`${sub.name} (${sub.count})`, selectedSubcategory === sub.name, () => selectSubcategory(sub.name))}
                    {/each}
                  </div>
                {/if}
              </div>

              <div class="space-y-4">
                {#each categoryPosts as p (p.slug)}
                  {@render postCard(p)}
                {/each}
              </div>
            </div>
          {/if}

        {:else if activeTab === 'tags'}
          {#if !selectedTag}
            <div class="space-y-5">
              <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--blog-border);">
                <div>
                  <h2 class="font-mono text-sm font-semibold uppercase tracking-widest" style="color: var(--blog-text-primary);">Tags</h2>
                  <p class="mt-0.5 text-caption" style="color: var(--blog-text-muted);">Pick a tag to see every note that carries it.</p>
                </div>
                <span class="rounded-none border px-2 py-0.5 font-mono text-xs" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{data.tagsWithCount.length}</strong> tags
                </span>
              </div>

              <div class="flex flex-wrap content-start gap-2.5">
                {#each data.tagsWithCount as t (t.name)}
                  <button
                    type="button"
                    data-tag-pill
                    onclick={() => selectTag(t.name)}
                    class="tactical-invert-hover group inline-flex cursor-pointer items-center gap-2 rounded-none border px-3 py-2 transition-colors duration-150"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                  >
                    <span class="font-medium">#{t.name}</span>
                    <span class="rounded-none border px-1.5 py-0.5 font-mono text-label" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-accent);">{t.count}</span>
                  </button>
                {/each}
              </div>
            </div>
          {:else}
            <div class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style="border-color: var(--blog-border);">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    onclick={backToTags}
                    class="tactical-invert-hover flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1 font-mono text-xs transition-all duration-150"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                  >
                    <span aria-hidden="true">←</span>
                    <span>All tags</span>
                  </button>
                  <h2 class="font-mono text-base font-bold uppercase tracking-wider" style="color: var(--blog-accent);">#{selectedTag}</h2>
                </div>
                <span class="rounded-none border px-2 py-0.5 font-mono text-xs" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{tagPosts.length}</strong> {tagPosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <div class="space-y-4">
                {#each tagPosts as p (p.slug)}
                  {@render postCard(p)}
                {/each}
              </div>
            </div>
          {/if}

        {:else if activeTab === 'archive'}
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--blog-border);">
              <div>
                <h2 class="font-mono text-sm font-semibold uppercase tracking-widest" style="color: var(--blog-text-primary);">Archive</h2>
                <p class="mt-0.5 text-caption" style="color: var(--blog-text-muted);">Everything, newest first, by year and month.</p>
              </div>
              <span class="rounded-none border px-2 py-0.5 font-mono text-xs" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                <strong style="color: var(--blog-accent);">{data.posts.length}</strong> entries
              </span>
            </div>

            <div class="space-y-10 pl-4 pr-2 pt-2">
              {#each data.archiveByYear as yearGroup, i (yearGroup.year)}
                <div data-archive-group class="relative ml-4 space-y-4 pl-6 sm:pl-8">
                  <span
                    class="pointer-events-none absolute left-0 top-3 w-px {i < data.archiveByYear.length - 1 ? '-bottom-10' : 'bottom-2'}"
                    style="background-color: var(--blog-border);"
                    aria-hidden="true"
                  ></span>
                  <div class="absolute -left-3 top-0.5 z-10 flex items-center justify-center" aria-hidden="true">
                    <span class="flex h-6 w-6 items-center justify-center rounded-none border font-mono text-label font-bold" style="border-color: var(--blog-accent); background-color: var(--blog-bg); color: var(--blog-accent);">✦</span>
                  </div>

                  <div class="flex items-baseline gap-3 pt-0.5">
                    <h3 class="font-mono text-xl font-bold tracking-tight" style="color: var(--blog-text-primary);">{yearGroup.year}</h3>
                    <span class="font-mono text-label uppercase tracking-wider" style="color: var(--blog-text-muted);">
                      {yearGroup.count} {yearGroup.count === 1 ? 'publication' : 'publications'}
                    </span>
                  </div>

                  <div class="space-y-6 pt-1">
                    {#each yearGroup.months || [{ month: '', monthName: '', count: yearGroup.count, posts: yearGroup.posts }] as monthGroup}
                      <div class="space-y-3">
                        {#if monthGroup.monthName}
                          <div class="flex items-center gap-2 pt-1 font-mono">
                            <span class="inline-block h-1.5 w-1.5 shrink-0" style="background-color: var(--blog-accent);" aria-hidden="true"></span>
                            <h4 class="text-xs font-semibold uppercase tracking-widest" style="color: var(--blog-accent);">{monthGroup.monthName}</h4>
                            <span class="text-label" style="color: var(--blog-text-muted);">{monthGroup.count} {monthGroup.count === 1 ? 'post' : 'posts'}</span>
                            <div class="ml-2 h-px flex-1 border-t border-dashed opacity-50" style="border-color: var(--blog-border);" aria-hidden="true"></div>
                          </div>
                        {/if}

                        <ul class="space-y-2.5">
                          {#each monthGroup.posts as p (p.slug)}
                            <li data-archive-item>
                              <a
                                href={`/blog/${p.slug}`}
                                class="group flex cursor-pointer flex-col justify-between gap-3 rounded-none border p-3.5 transition-all duration-150 hover:translate-x-1 sm:flex-row sm:items-center"
                                style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                              >
                                <div class="flex items-center gap-3">
                                  <span class="shrink-0 font-mono text-label" style="color: var(--blog-text-muted);">{p.date ? p.date.slice(5) : ''}</span>
                                  <span class="text-body transition-colors group-hover:text-[var(--blog-accent)]" style="color: var(--blog-text-primary);">{p.title}</span>
                                </div>
                                <div class="flex shrink-0 items-center gap-3 font-mono text-label" style="color: var(--blog-text-muted);">
                                  {#if p.categories && p.categories.length > 0}
                                    <span class="hidden border px-1.5 py-0.5 uppercase tracking-wider sm:inline-block" style="background-color: var(--blog-bg); border-color: var(--blog-border);">{p.categories[0]}</span>
                                  {/if}
                                  <span>{p.readingTime}</span>
                                  <span class="transition-transform group-hover:translate-x-1" style="color: var(--blog-accent);" aria-hidden="true">→</span>
                                </div>
                              </a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </main>
    </div>
  </section>
</div>

<style>
  section {
    background-color: transparent;
    color: var(--blog-text-primary);
  }

  [data-post-card],
  [data-category-card],
  [data-archive-item] a {
    background-color: var(--blog-surface) !important;
    border-color: var(--blog-border) !important;
    color: var(--blog-text-primary);
  }

  [data-post-card]:hover,
  [data-category-card]:hover,
  [data-archive-item] a:hover,
  [data-tag-pill]:hover,
  aside nav button:hover {
    border-color: var(--blog-hover-border) !important;
  }

  .corner-reticle {
    border-color: var(--blog-accent) !important;
  }

  input[type='search'] {
    background-color: var(--blog-input-bg) !important;
    border-color: var(--blog-border) !important;
    color: var(--blog-text-primary) !important;
  }
  input[type='search']::placeholder {
    color: var(--blog-text-muted) !important;
  }

  [data-tag-pill]:hover {
    color: var(--blog-accent) !important;
  }

  [data-post-card]:hover h2,
  [data-category-card]:hover h3,
  [data-post-card]:hover a span,
  aside nav button:hover [data-tab-num] {
    color: var(--blog-accent) !important;
  }

  /* No shadows anywhere in the journal, in either theme. */
  :global([data-blog-theme]) *,
  :global([data-blog-theme]) *::before,
  :global([data-blog-theme]) *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }
</style>
