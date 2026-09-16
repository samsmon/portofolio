<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';
  import { engineTrivia } from '$lib/content/site.js';

  // Every value on this panel is measured on the visitor's device or stamped
  // at build time. Nothing here is decorative.
  let isOpen = $state(false);
  let tier = $state('evaluating');
  let fps = $state('');
  let cores = $state('n/a');
  let memory = $state('n/a');
  let connection = $state('n/a');
  let reducedMotion = $state(false);

  // Injected by vite.config.js at build time (ISO string).
  const buildTime = typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : '';
  const buildLabel = buildTime ? buildTime.slice(0, 10) : 'dev';

  onMount(() => {
    if (!browser) return;
    tier = detectTier();
    reducedMotion = prefersReducedMotion();

    if (navigator.hardwareConcurrency) cores = `${navigator.hardwareConcurrency} cores`;
    if (navigator.deviceMemory) memory = `~${navigator.deviceMemory} GB`;
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn?.effectiveType) connection = conn.effectiveType.toUpperCase();

    // Live canvas FPS, written by the hero scene's frame loop while it runs.
    const timer = setInterval(() => {
      const canvas = document.querySelector('canvas[data-fps]');
      fps = canvas?.dataset?.fps ?? '';
    }, 500);

    return () => clearInterval(timer);
  });
</script>

<div class="border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-muted);">
  <button
    type="button"
    onclick={() => (isOpen = !isOpen)}
    class="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer group rounded-none"
    style="color: var(--yorha-text-primary);"
    aria-expanded={isOpen}
  >
    <div class="flex flex-wrap items-center gap-3 font-mono text-label">
      <span class="inline-flex items-center gap-1.5 tracking-[0.16em] uppercase" style="color: var(--yorha-accent);">
        <span class="h-1.5 w-1.5 rounded-none" style="background-color: var(--yorha-accent);"></span>
        Engine telemetry
      </span>
      <span aria-hidden="true" style="color: var(--yorha-border);">·</span>
      <span>
        Tier <span class="uppercase font-medium" style="color: var(--yorha-accent);">{tier}</span>
      </span>
      {#if fps}
        <span style="color: var(--yorha-text-muted);">{fps} fps</span>
      {/if}
      <span aria-hidden="true" style="color: var(--yorha-border);">·</span>
      <span style="color: var(--yorha-text-muted);">Build {buildLabel}</span>
    </div>

    <div class="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em]" style="color: var(--yorha-text-muted);">
      <span>{isOpen ? 'Close' : 'Inspect'}</span>
      <span class="transition-transform duration-300" class:rotate-180={isOpen} aria-hidden="true">↓</span>
    </div>
  </button>

  {#if isOpen}
    <div transition:slide={{ duration: 320, easing: cubicOut }} class="border-t p-5 space-y-6" style="border-color: var(--yorha-border); background-color: var(--yorha-bg);">
      <div>
        <div class="font-mono text-label uppercase tracking-[0.2em] mb-3" style="color: var(--yorha-text-muted);">
          Your device, as this page sees it
        </div>
        <dl class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-caption font-mono">
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <dt class="text-label uppercase" style="color: var(--yorha-text-muted);">Render tier</dt>
            <dd class="uppercase font-medium" style="color: var(--yorha-text-primary);">{tier}</dd>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <dt class="text-label uppercase" style="color: var(--yorha-text-muted);">CPU threads</dt>
            <dd style="color: var(--yorha-text-primary);">{cores}</dd>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <dt class="text-label uppercase" style="color: var(--yorha-text-muted);">Memory class</dt>
            <dd style="color: var(--yorha-text-primary);">{memory}</dd>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <dt class="text-label uppercase" style="color: var(--yorha-text-muted);">Network / motion</dt>
            <dd style="color: var(--yorha-text-primary);">{connection}{reducedMotion ? ' · reduced' : ''}</dd>
          </div>
        </dl>
      </div>

      <div class="space-y-3">
        <div class="font-mono text-label uppercase tracking-[0.2em]" style="color: var(--yorha-text-muted);">
          {engineTrivia.title}
        </div>
        <p class="text-caption max-w-[var(--measure)]" style="color: var(--yorha-text-muted);">
          {engineTrivia.overview}
        </p>

        <div class="grid gap-3 sm:grid-cols-3 pt-2">
          {#each engineTrivia.items as item}
            <div class="p-3 border space-y-1.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="font-mono text-label font-medium block" style="color: var(--yorha-accent);">
                {item.label}
              </span>
              <p class="text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
                {item.desc}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
