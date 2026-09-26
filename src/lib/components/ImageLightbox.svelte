<script>
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { portal } from '$lib/actions/portal.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';

  /** @type {{ images: string[], index?: number, alt?: string, onClose: () => void }} */
  let { images, index = 0, alt = '', onClose } = $props();

  const reduce = prefersReducedMotion();

  let current = $state(index);
  // Intrinsic size of the shown image, used to scale small screenshots up to
  // the screen instead of leaving them at their tiny native size.
  let naturalWidth = $state(0);
  let naturalHeight = $state(0);
  /** @type {HTMLElement} */ let closeBtn;
  /** @type {HTMLElement} */ let overlay;
  let restoreFocus;

  function close() {
    onClose();
  }

  function next() {
    current = (current + 1) % images.length;
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
  }

  function key(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (images.length > 1 && (e.key === 'ArrowRight')) {
      e.preventDefault();
      next();
    } else if (images.length > 1 && (e.key === 'ArrowLeft')) {
      e.preventDefault();
      prev();
    }
  }

  onMount(() => {
    restoreFocus = document.activeElement;
    tick().then(() => closeBtn?.focus());
    // Freeze the page behind the viewer; Svelte's `onwheel` is passive, so the
    // wheel is blocked with a manual non-passive listener.
    // A host modal (ProjectModal) may have stopped Lenis already; only restart
    // it if this viewer was the one that stopped it.
    const blockWheel = (e) => e.preventDefault();
    const ownsLenis = window.__lenis && !window.__lenis.isStopped;
    if (ownsLenis) window.__lenis.stop();
    overlay.addEventListener('wheel', blockWheel, { passive: false });
    return () => {
      overlay.removeEventListener('wheel', blockWheel);
      if (ownsLenis) window.__lenis?.start();
      /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    };
  });
</script>

<svelte:window onkeydown={key} />

<div
  bind:this={overlay}
  use:portal
  transition:fade={{ duration: reduce ? 0 : 150 }}
  class="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden p-4 sm:p-10 backdrop-blur-md"
  style="background-color: var(--tactical-backdrop);"
  onclick={close}
  role="presentation"
>
  <!-- Top bar -->
  <div class="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 font-mono text-label uppercase tracking-widest" style="color: var(--tactical-text-primary);">
    <span>
      IMG_VIEW
      {#if images.length > 1}
        <span style="color: var(--tactical-text-muted);">// {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      {/if}
    </span>
    <button
      bind:this={closeBtn}
      type="button"
      onclick={(e) => { e.stopPropagation(); close(); }}
      class="grid h-8 w-8 place-items-center border font-mono text-sm transition-colors cursor-pointer rounded-none tactical-invert-hover"
      style="border-color: var(--tactical-border); background-color: var(--tactical-surface); color: var(--tactical-text-primary);"
      aria-label="Close image viewer"
    >
      ✕
    </button>
  </div>

  <!-- Prev / Next -->
  {#if images.length > 1}
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); prev(); }}
      class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center border font-mono transition-colors cursor-pointer rounded-none tactical-invert-hover"
      style="border-color: var(--tactical-border); background-color: var(--tactical-surface); color: var(--tactical-text-primary);"
      aria-label="Previous image"
    >
      ‹
    </button>
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); next(); }}
      class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center border font-mono transition-colors cursor-pointer rounded-none tactical-invert-hover"
      style="border-color: var(--tactical-border); background-color: var(--tactical-surface); color: var(--tactical-text-primary);"
      aria-label="Next image"
    >
      ›
    </button>
  {/if}

  <!-- Image -->
  {#key current}
    <div
      transition:scale={{ duration: reduce ? 0 : 150, start: 0.97, easing: cubicOut }}
      class="relative max-h-[85vh] max-w-full border p-1"
      style="background-color: var(--tactical-surface); border-color: var(--tactical-border);"
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
      <img
        src={images[current]}
        {alt}
        bind:naturalWidth
        bind:naturalHeight
        class="fit-screen block h-auto object-contain"
        style:--ratio={naturalWidth && naturalHeight ? naturalWidth / naturalHeight : null}
      />
    </div>
  {/key}
</div>

<style>
  /* Until the image reports its size, just keep it inside the screen. */
  .fit-screen {
    --fit-w: calc(100vw - 2.5rem);
    width: auto;
    max-width: var(--fit-w);
    max-height: 80vh;
  }

  /* Known aspect ratio: grow (or shrink) to the largest size that fits both
     axes, so small screenshots are enlarged instead of staying tiny. */
  .fit-screen[style*='--ratio'] {
    width: min(var(--fit-w), calc(80vh * var(--ratio)));
    max-height: none;
  }

  @media (min-width: 640px) {
    /* Room for the prev/next buttons and the wider sm padding. */
    .fit-screen {
      --fit-w: calc(100vw - 9rem);
    }
  }
</style>
