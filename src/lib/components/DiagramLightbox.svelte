<script>
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { portal } from '$lib/actions/portal.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';

  /** @type {{ svg: string, title?: string, onClose: () => void }} */
  let { svg, title = 'SYSTEM_ARCHITECTURE', onClose } = $props();

  const reduce = prefersReducedMotion();

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;

  let zoom = $state(1);
  let panX = $state(0);
  let panY = $state(0);
  let isDragging = $state(false);
  let startX = 0;
  let startY = 0;

  // Active pointers on the canvas: one pans, two pinch-zoom.
  /** @type {Map<number, { x: number, y: number }>} */
  const pointers = new Map();
  let pinchStartDist = 0;
  let pinchStartZoom = 1;

  /** @type {HTMLElement} */ let closeBtn;
  /** @type {HTMLElement} */ let overlay;
  /** @type {HTMLElement} */ let viewport;
  let restoreFocus;

  function close() {
    onClose();
  }

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(z.toFixed(2))));

  function zoomIn() {
    zoom = clampZoom(zoom + 0.25);
  }

  function zoomOut() {
    zoom = clampZoom(zoom - 0.25);
  }

  function resetView() {
    zoom = 1;
    panX = 0;
    panY = 0;
  }

  // Attached manually as non-passive: Svelte 5 registers `onwheel` as passive,
  // so preventDefault() there is ignored and the page behind would scroll.
  // Blocked over the whole overlay, but only zooms over the canvas.
  function handleWheel(e) {
    e.preventDefault();
    if (!viewport.contains(/** @type {Node} */ (e.target))) return;
    if (e.deltaY < 0) zoomIn();
    else if (e.deltaY > 0) zoomOut();
  }

  const pinchDistance = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  function handlePointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      viewport.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety (keeps drags alive off-canvas); never block on it.
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
    } else if (pointers.size === 2) {
      isDragging = false;
      pinchStartDist = pinchDistance();
      pinchStartZoom = zoom;
    }
  }

  function handlePointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinchStartDist > 0) {
      zoom = clampZoom((pinchStartZoom * pinchDistance()) / pinchStartDist);
    } else if (isDragging) {
      panX = e.clientX - startX;
      panY = e.clientY - startY;
    }
  }

  function handlePointerUp(e) {
    pointers.delete(e.pointerId);
    pinchStartDist = 0;
    if (pointers.size === 1) {
      // Lifting one finger of a pinch: keep panning with the remaining one.
      const [p] = [...pointers.values()];
      isDragging = true;
      startX = p.x - panX;
      startY = p.y - panY;
    } else {
      isDragging = false;
    }
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
    // Freeze the page behind the viewer so wheel and touch only drive the diagram.
    // Only restart Lenis if this viewer was the one that stopped it.
    const ownsLenis = window.__lenis && !window.__lenis.isStopped;
    if (ownsLenis) window.__lenis.stop();
    overlay.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      overlay.removeEventListener('wheel', handleWheel);
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
    bind:this={viewport}
    class="relative flex-1 min-h-0 my-3 flex items-center justify-center overflow-hidden border touch-none {isDragging ? 'cursor-grabbing' : 'cursor-grab'}"
    style="background-color: var(--tactical-bg); border-color: var(--tactical-border);"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    role="presentation"
  >
    <!-- Tactical Corner Accents -->
    <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 z-20" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>

    <!-- Draggable & Scalable Diagram Container -->
    <div
      class="diagram-content h-full w-full origin-center flex items-center justify-center p-6 sm:p-10"
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
  /* Mermaid emits width="100%" with no height, which collapses to 0x0 inside a
     shrink-to-fit box. Fill the canvas instead; the viewBox keeps the aspect. */
  :global(.diagram-content svg) {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  }
</style>
