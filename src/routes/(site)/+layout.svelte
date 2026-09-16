<script>
  import { onMount } from 'svelte';
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { identity } from '$lib/content/site.js';
  import SideNav from '$lib/components/SideNav.svelte';
  import CornerTelemetry from '$lib/components/CornerTelemetry.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { theme } from '$lib/stores/theme.svelte.js';

  let { children } = $props();

  let activeId = $state('');

  const sectionIds = ['about', 'skills', 'portfolio', 'contact'];

  const paletteScopedAway = $derived(
    page.url.pathname.startsWith('/blog') || page.url.pathname.startsWith('/projects')
  );

  onNavigate((navigation) => {
    if (!document.startViewTransition) {
      window.scrollTo(0, 0);
      window.__lenis?.scrollTo(0, { immediate: true });
      return;
    }

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        try {
          resolve();
          await navigation.complete;
        } finally {
          window.scrollTo(0, 0);
          window.__lenis?.scrollTo(0, { immediate: true });
        }
      });
      // A transition is skipped by the browser when the tab is hidden or a
      // second navigation lands first. That is fine; it must not surface as
      // an unhandled rejection.
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    });
  });

  onMount(() => {
    theme.init();

    let stopSmooth = () => {};
    let alive = true;
    import('$lib/scroll/smoothScroll.js').then(({ initSmoothScroll }) => {
      if (alive) stopSmooth = initSmoothScroll();
    });

    const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && docTop(el) <= probe) current = id;
      }
      activeId = current;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      alive = false;
      stopSmooth();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });
</script>

<svelte:head>
  <title>{identity.title}</title>
  <meta name="description" content={identity.tagline} />
  <!-- OpenGraph / Social Cards. Image URLs must be absolute: crawlers do not
       resolve relative paths against the page. -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={identity.name} />
  <meta property="og:title" content={identity.title} />
  <meta property="og:description" content={identity.tagline} />
  <meta property="og:url" content={`${identity.url}${page.url.pathname}`} />
  <meta property="og:image" content={`${identity.url}/og-preview.png`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={identity.title} />
  <meta name="twitter:description" content={identity.tagline} />
  <meta name="twitter:image" content={`${identity.url}/og-preview.png`} />
</svelte:head>

<!-- Top Right Tactical HUD Bar: Theme Switcher & Command Palette -->
<div class="fixed right-4 top-4 sm:right-10 sm:top-7 z-40 flex items-center gap-2 sm:gap-3 pointer-events-auto">
  <ThemeToggle />

  {#if !paletteScopedAway}
    <button
      type="button"
      aria-label="Open Command Palette"
      onclick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }}
      class="group flex items-center gap-2 font-mono text-label uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity"
      style="color: var(--yorha-text-primary);"
    >
      <span class="sm:hidden border border-current/20 px-2 py-1 backdrop-blur-sm font-semibold tracking-wider" style="background-color: var(--yorha-surface);">Menu</span>
      <span class="hidden sm:inline">Menu</span>
      <span class="hidden sm:flex items-center border border-current/20 px-2 py-0.5 backdrop-blur-sm transition-colors group-hover:border-current/40" style="background-color: var(--yorha-surface);">
        <kbd class="font-mono">⌘K</kbd>
      </span>
    </button>
  {/if}
</div>

<SideNav {activeId} />
<CornerTelemetry {activeId} />
<CommandPalette />

<main id="top">
  {@render children()}
</main>
