<script>
  import { theme } from '$lib/stores/theme.svelte.js';

  let { class: className = '' } = $props();

  const isLight = $derived(theme.current === 'light');

  function toggle() {
    theme.toggle();
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={isLight ? 'Switch to Tactical (dark) theme' : 'Switch to Archive (light) theme'}
  aria-pressed={isLight}
  class="group inline-flex items-center gap-1.5 px-2 py-1 border-0 bg-transparent opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-pointer font-mono text-label uppercase tracking-wider select-none {className}"
  style="color: var(--yorha-accent);"
  title={isLight ? 'Archive theme active. Switch to Tactical.' : 'Tactical theme active. Switch to Archive.'}
>
  <!-- Inline icons: no icon font request just for two glyphs. -->
  {#if isLight}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </svg>
    <span class="hidden sm:inline">Archive</span>
  {:else}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
    <span class="hidden sm:inline">Tactical</span>
  {/if}
</button>
