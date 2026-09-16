<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';
  import SnakePlaceholder from './SnakePlaceholder.svelte';

  /**
   * Two portraits in one frame. `primary` (the illustration) is what visitors
   * see first; `secondary` (the formal photo) wipes down over it behind a thin
   * scan beam on hover, on keyboard focus, or on tap where there is no hover.
   *
   * @type {{ primary: string, secondary: string, alt?: string }}
   */
  let { primary, secondary, alt = 'Portrait' } = $props();

  const reduce = prefersReducedMotion();

  /** @type {HTMLElement | null} */ let root = $state(null);
  /** @type {HTMLElement | null} */ let front = $state(null);
  /** @type {HTMLElement | null} */ let back = $state(null);
  /** @type {HTMLElement | null} */ let beam = $state(null);
  /** @type {gsap.Context | null} */ let ctx = null;

  let revealed = $state(false);
  let primaryBroken = $state(false);
  let secondaryBroken = $state(false);
  let coarse = $state(false);

  const HIDDEN = 'inset(0 0 100% 0)';
  const SHOWN = 'inset(0 0 0% 0)';

  function setRevealed(on) {
    if (secondaryBroken || revealed === on || !ctx) return;
    revealed = on;
    ctx.add(() => {
      if (reduce) {
        gsap.set(back, { clipPath: on ? SHOWN : HIDDEN });
        return;
      }
      gsap.to(back, {
        clipPath: on ? SHOWN : HIDDEN,
        duration: dur.md,
        ease: on ? ease.out : ease.in,
        overwrite: 'auto'
      });
      gsap.fromTo(
        beam,
        { top: on ? '0%' : '100%', autoAlpha: 1 },
        { top: on ? '100%' : '0%', autoAlpha: 0, duration: dur.md, ease: ease.draw, overwrite: 'auto' }
      );
      gsap.to(front, { scale: on ? 1.04 : 1, duration: dur.lg, ease: ease.out, overwrite: 'auto' });
    });
  }

  onMount(() => {
    coarse = window.matchMedia('(hover: none)').matches;
    ctx = gsap.context(() => {
      gsap.set(back, { clipPath: HIDDEN });
      gsap.set(beam, { autoAlpha: 0 });
    }, root);
    return () => {
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
    style="border-color: var(--yorha-border); background-color: var(--yorha-surface);"
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
    <img
      bind:this={front}
      src={primary}
      {alt}
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onerror={() => (primaryBroken = true)}
    />
    <img
      bind:this={back}
      src={secondary}
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full object-cover"
      style="clip-path: inset(0 0 100% 0);"
      loading="lazy"
      decoding="async"
      onerror={() => (secondaryBroken = true)}
    />

    <!-- Scan beam that leads the wipe -->
    <span
      bind:this={beam}
      class="pointer-events-none absolute inset-x-0 h-px"
      style="top: 0; background: linear-gradient(to right, transparent, var(--yorha-accent), transparent);"
      aria-hidden="true"
    ></span>

    <!-- Corner reticles, only while the frame is active -->
    <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

    {#if !secondaryBroken}
      <span
        class="pointer-events-none absolute bottom-2 right-2 border px-1.5 py-0.5 font-mono text-label tracking-[0.2em]"
        style="background-color: var(--yorha-bg); border-color: var(--yorha-border); color: var(--yorha-text-muted);"
        aria-hidden="true"
      >
        {revealed ? '02 / 02' : '01 / 02'}
      </span>
    {/if}
  </button>
{/if}
