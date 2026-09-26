<script>
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { portal } from '$lib/actions/portal.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';

  /** @type {{ svg: string, title?: string, onClose: () => void }} */
  let { svg, title = 'SYSTEM_ARCHITECTURE', onClose } = $props();

  const reduce = prefersReducedMotion();

  let zoom = $state(1);
  let panX = $state(0);
  let panY = $state(0);
  let isDragging = $state(false);
  let startX = 0;
  let startY = 0;

  /** @type {HTMLElement} */ let closeBtn;
  let restoreFocus;

  function close() {
    onClose();
  }

  function zoomIn() {
    zoom = Math.min(4, Number((zoom + 0.25).toFixed(2)));
  }

  function zoomOut() {
    zoom = Math.max(0.5, Number((zoom - 0.25).toFixed(2)));
  }

  function resetView() {
    zoom = 1;
    panX = 0;
    panY = 0;
  }

  function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function key(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomOut();
    } else if (e.key === '0' || e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      resetView();
    }
  }

  onMount(() => {
    restoreFocus = document.activeElement;
    tick().then(() => closeBtn?.focus());
    return () => {
      /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    };
  });
</script>

<svelte:window onkeydown={key} onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div
  use:portal
  transition:fade={{ duration: reduce ? 0 : 150 }}
  class="fixed inset-0 z-[1000] flex flex-col justify-between overflow-hidden p-3 sm:p-6 backdrop-blur-md select-none"
  style="background-color: var(--tactical-backdrop);"
  onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  role="presentation"
>
  <!-- Top Bar -->
  <div class="relative z-20 flex items-center justify-between px-3 py-2.5 sm:px-6 font-mono text-label uppercase tracking-widest border"
    style="background-color: var(--tactical-surface); border-color: var(--tactical-border); color: var(--tactical-text-primary);">
    <div class="flex items-center gap-2 truncate">
      <span class="text-xs" style="color: var(--tactical-accent);">[ ⛶ ]</span>
      <span class="truncate font-semibold">DIAGRAM_VIEW // {title}</span>
    </div>

    <!-- Zoom & Close Controls -->
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="hidden sm:flex items-center gap-1 border px-2 py-1 font-mono text-[11px]" style="border-color: var(--tactical-border); background-color: var(--tactical-bg);">
        <button
          type="button"
          onclick={zoomOut}
          class="px-1.5 py-0.5 hover:text-[var(--tactical-accent)] cursor-pointer"
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >−</button>
        <span class="w-12 text-center text-[10px]" style="color: var(--tactical-text-muted);">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onclick={zoomIn}
          class="px-1.5 py-0.5 hover:text-[var(--tactical-accent)] cursor-pointer"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >+</button>
        <button
          type="button"
          onclick={resetView}
          class="ml-1 px-1.5 py-0.5 text-[10px] border-l hover:text-[var(--tactical-accent)] cursor-pointer"
          style="border-color: var(--tactical-border);"
          title="Reset View (R)"
        >RESET</button>
      </div>

      <button
        bind:this={closeBtn}
        type="button"
        onclick={close}
        class="grid h-8 w-8 place-items-center border font-mono text-sm transition-colors cursor-pointer rounded-none tactical-invert-hover"
        style="border-color: var(--tactical-border); background-color: var(--tactical-surface); color: var(--tactical-text-primary);"
        aria-label="Close diagram viewer"
      >
        ✕
      </button>
    </div>
  </div>

  <!-- Interactive Canvas / Viewport -->
  <div
    class="relative flex-1 my-3 flex items-center justify-center overflow-hidden border cursor-grab active:cursor-grabbing"
    style="background-color: var(--tactical-bg); border-color: var(--tactical-border);"
    onwheel={handleWheel}
    onmousedown={handleMouseDown}
    role="presentation"
  >
    <!-- Tactical Corner Accents -->
    <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>

    <!-- Draggable & Scalable Diagram Container -->
    <div
      class="diagram-content transition-transform duration-75 origin-center max-w-full max-h-full flex items-center justify-center p-6"
      style="transform: translate3d({panX}px, {panY}px, 0) scale({zoom});"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html svg}
    </div>

    <!-- Floating Help / Mobile Controls -->
    <div class="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center">
      <div class="flex items-center gap-2 px-3 py-1 font-mono text-[10px] uppercase tracking-wider border backdrop-blur-sm"
        style="background-color: var(--tactical-surface); border-color: var(--tactical-border); color: var(--tactical-text-muted);">
        <span>Drag to pan</span>
        <span>•</span>
        <span>Scroll / Pinch to zoom</span>
        <span>•</span>
        <span>ESC to close</span>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.diagram-content svg) {
    max-width: 90vw !important;
    max-height: 75vh !important;
    height: auto !important;
    width: auto !important;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  }
</style>
