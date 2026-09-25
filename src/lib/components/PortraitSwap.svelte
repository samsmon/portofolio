<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { ease, dur } from '$lib/motion.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';
  import SnakePlaceholder from './SnakePlaceholder.svelte';

  gsap.registerPlugin(ScrollTrigger);

  /**
   * Two portraits treated as data the HUD has to decode.
   *
   * Boot: when the frame scrolls into view the illustration resolves out of
   * black pixel blocks behind a scan front, once.
   * Swap: on hover, keyboard focus, or tap where there is no hover, the image
   * pixelates, a scan front walks down the grid flipping cells from the
   * illustration to the photo with a brief accent flash and a few displaced
   * rows, then the photo sharpens. Leaving runs the same sequence backwards.
   *
   * Everything is drawn on one canvas from two same-origin images. Reduced
   * motion, a missing canvas, or a missing file falls back to plain images.
   *
   * @type {{ primary: string, secondary: string, alt?: string }}
   */
  let { primary, secondary, alt = 'Portrait' } = $props();

  const reduce = prefersReducedMotion();

  /** @type {HTMLElement | null} */ let root = $state(null);
  /** @type {HTMLCanvasElement | null} */ let canvas = $state(null);

  let revealed = $state(false);
  let primaryBroken = $state(false);
  let secondaryBroken = $state(false);
  let canvasReady = $state(false);
  let coarse = $state(false);
  // Real progress of the running decode, 0 = illustration, 100 = photo.
  let percent = $state(0);

  /** @type {gsap.Context | null} */ let ctx = null;

  // ---- canvas state -------------------------------------------------------
  const COLS = 22;
  const anim = { p: 0, q: 0 }; // p: swap progress, q: boot progress
  let g = null;
  let dpr = 1;
  let W = 0;
  let H = 0;
  let rows = 0;
  let cellW = 0;
  let cellH = 0;
  /** @type {HTMLImageElement | null} */ let imgA = null;
  /** @type {HTMLImageElement | null} */ let imgB = null;
  let lowA = null;
  let lowB = null;
  /** @type {Float32Array} */ let thresholds = new Float32Array(0);
  let accent = '#34d399';
  let bg = '#000000';

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hash = (r, c) => {
    const s = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };

  function readTokens() {
    const cs = getComputedStyle(document.documentElement);
    accent = cs.getPropertyValue('--tactical-accent').trim() || accent;
    bg = cs.getPropertyValue('--tactical-bg').trim() || bg;
  }

  function fit() {
    if (!canvas || !root) return;
    const r = root.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    g = canvas.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    rows = Math.max(4, Math.round((COLS * H) / W));
    cellW = W / COLS;
    cellH = H / rows;
    // Scan order: fully random per cell, so the decode reads as noise
    // resolving rather than a curtain sweeping top to bottom.
    thresholds = new Float32Array(COLS * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLS; c++) {
        thresholds[r * COLS + c] = hash(r, c);
      }
    }
    lowA = document.createElement('canvas');
    lowB = document.createElement('canvas');
    draw();
  }

  // Cover-fit an image into a canvas of the given size.
  function drawCover(target, img, w, h) {
    const tc = target.getContext('2d');
    if (!tc) return;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let sw, sh, sx, sy;
    if (ir > cr) {
      sh = img.naturalHeight;
      sw = sh * cr;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / cr;
      sx = 0;
      sy = (img.naturalHeight - sh) * 0.15;
    }
    tc.imageSmoothingEnabled = true;
    tc.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  // Block size for the current progress: sharp at rest, cell-sized mid-swap.
  function blockSize(p, q) {
    const cell = Math.max(cellW, cellH);
    const swap =
      p < 0.3 ? lerp(1, cell, p / 0.3) : p > 0.7 ? lerp(cell, 1, (p - 0.7) / 0.3) : cell;
    const boot = lerp(cell, 1, q);
    return Math.max(1, Math.max(swap, boot));
  }

  function draw() {
    if (!g || !imgA || !imgB || !lowA || !lowB) return;
    const p = clamp01(anim.p);
    const q = clamp01(anim.q);
    const bs = blockSize(p, q);
    const lw = Math.max(1, Math.ceil(W / bs));
    const lh = Math.max(1, Math.ceil(H / bs));

    lowA.width = lw;
    lowA.height = lh;
    lowB.width = lw;
    lowB.height = lh;
    drawCover(lowA, imgA, lw, lh);
    drawCover(lowB, imgB, lw, lh);

    g.imageSmoothingEnabled = bs <= 1.5;
    g.clearRect(0, 0, W, H);

    // Fully revealed: draw the photo straight through, no per-cell grid,
    // so nothing can linger un-decoded after a hover.
    if (p >= 1) {
      g.drawImage(lowB, 0, 0, lw, lh, 0, 0, W, H);
      percent = 100;
      return;
    }

    g.drawImage(lowA, 0, 0, lw, lh, 0, 0, W, H);

    // Swap front: cells past the front show the photo. Starts a beat after
    // the tween begins (boot-style delay) but finishes exactly when the
    // tween does, so there's no dead time at the end waiting on nothing.
    const f = clamp01((p - 0.12) / 0.88);
    if (f > 0) {
      const scale = lw / W;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = thresholds[r * COLS + c];
          if (t >= f) continue;
          const x = c * cellW;
          const y = r * cellH;
          g.drawImage(lowB, x * scale, y * scale, cellW * scale, cellH * scale, x, y, cellW, cellH);
        }
      }
      // Cells right at the front flash in the accent, like a lock-on.
      g.fillStyle = accent;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const d = Math.abs(thresholds[r * COLS + c] - f);
          if (d < 0.05) {
            g.globalAlpha = 0.85 * (1 - d / 0.05);
            g.fillRect(c * cellW, r * cellH, cellW, cellH);
          }
        }
      }
      g.globalAlpha = 1;

      // A few rows near the front slip sideways while the decode runs.
      if (f > 0.02 && f < 0.98) {
        const band = Math.max(2, cellH * 0.6);
        for (let i = 0; i < 3; i++) {
          const yy = clamp01(f + (hash(i, 7) - 0.5) * 0.12) * H;
          const dx = (hash(i, 3) - 0.5) * 18;
          // Source rect is in device pixels; destination is in CSS pixels.
          g.drawImage(canvas, 0, yy * dpr, W * dpr, band * dpr, dx, yy, W, band);
        }
      }

      // Scan beam at the front.
      const by = f * H;
      const grad = g.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, accent);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, by - 0.5, W, 1);
    }

    // Boot: cells the front has not reached yet are still black.
    if (q < 1) {
      g.fillStyle = bg;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          if (thresholds[r * COLS + c] > q) g.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
      const by = q * H;
      const grad = g.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, accent);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, by - 0.5, W, 1);
    }

    percent = Math.round(p * 100);
  }

  function setRevealed(on) {
    if (secondaryBroken || revealed === on) return;
    revealed = on;
    if (!canvasReady || !ctx) return;
    if (anim.q < 1) {
      gsap.killTweensOf(anim, { q: true });
      anim.q = 1;
    }
    ctx.add(() => {
      gsap.to(anim, {
        p: on ? 1 : 0,
        duration: dur.lg,
        ease: ease.draw,
        overwrite: 'auto',
        onUpdate: draw
      });
      gsap.to(canvas, { scale: on ? 1.03 : 1, duration: dur.xl, ease: ease.out, overwrite: 'auto' });
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = src;
    });
  }

  onMount(() => {
    coarse = window.matchMedia('(hover: none)').matches;
    if (reduce) return;

    let alive = true;
    let ro = null;
    let mo = null;
    ctx = gsap.context(() => {}, root);

    Promise.all([loadImage(primary), loadImage(secondary)])
      .then(([a, b]) => {
        if (!alive || !canvas) return;
        imgA = a;
        imgB = b;
        readTokens();
        fit();
        canvasReady = true;

        ro = new ResizeObserver(() => {
          fit();
        });
        ro.observe(root);

        // Boot once, when the frame is actually on screen. If the images
        // finished loading with the frame already in view, boot right away
        // instead of waiting for a scroll that may never come.
        let booted = false;
        const boot = () => {
          if (booted) return;
          booted = true;
          ctx?.add(() => {
            gsap.to(anim, { q: 1, duration: dur.xl, ease: ease.out, onUpdate: draw });
          });
        };
        ctx?.add(() => {
          ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: boot });
        });
        if (ScrollTrigger.isInViewport(root, 0.1)) boot();

        // Theme switch repaints in the new accent and background.
        mo = new MutationObserver(() => {
          readTokens();
          draw();
        });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      })
      .catch(() => {
        // A missing file: mark whichever failed and let the img fallback show.
        if (!alive) return;
        canvasReady = false;
      });

    return () => {
      alive = false;
      ro?.disconnect();
      mo?.disconnect();
      ctx?.revert();
      ctx = null;
    };
  });
</script>

{#if primaryBroken}
  <SnakePlaceholder />
{:else}
  <button
    type="button"
    bind:this={root}
    class="group relative block aspect-[3/4] w-full overflow-hidden rounded-none border cursor-pointer"
    style="border-color: var(--tactical-border); background-color: var(--tactical-surface);"
    aria-pressed={revealed}
    aria-label={revealed ? 'Showing the photo. Switch back to the illustration.' : 'Showing the illustration. Switch to the photo.'}
    onpointerenter={() => {
      if (!coarse) setRevealed(true);
    }}
    onpointerleave={() => {
      if (!coarse) setRevealed(false);
    }}
    onclick={() => {
      if (coarse) setRevealed(!revealed);
    }}
    onfocusin={() => {
      if (root?.matches(':focus-visible')) setRevealed(true);
    }}
    onfocusout={() => {
      if (!coarse) setRevealed(false);
    }}
  >
    <!-- Plain images: what search engines and screen readers get, and the
         fallback when the canvas is not running. -->
    <img
      src={primary}
      {alt}
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-150"
      class:opacity-0={canvasReady || (revealed && !secondaryBroken)}
      loading="lazy"
      decoding="async"
      onerror={() => (primaryBroken = true)}
    />
    <img
      src={secondary}
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-150"
      class:opacity-0={canvasReady || !revealed || secondaryBroken}
      loading="lazy"
      decoding="async"
      onerror={() => (secondaryBroken = true)}
    />

    {#if !reduce}
      <canvas
        bind:this={canvas}
        class="absolute inset-0 h-full w-full transition-opacity duration-150"
        class:opacity-0={!canvasReady}
        aria-hidden="true"
      ></canvas>
    {/if}

    <!-- Corner reticles, only while the frame is active -->
    <span class="pointer-events-none absolute -top-px -left-px z-10 h-3 w-3 border-l-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px z-10 h-3 w-3 border-r-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px z-10 h-3 w-3 border-b-2 border-l-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px z-10 h-3 w-3 border-b-2 border-r-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--tactical-accent);" aria-hidden="true"></span>

  </button>
{/if}
