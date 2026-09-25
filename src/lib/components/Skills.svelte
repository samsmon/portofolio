<script>
  import { fade, fly } from 'svelte/transition';
  import { portal } from '$lib/actions/portal.js';
  import Section from './Section.svelte';
  import { stack, headings } from '$lib/content/site.js';
  import { prefersReducedMotion } from '$lib/utils/device.js';

  const reduce = prefersReducedMotion();

  const allTools = stack.flatMap((l) => l.items);
  const defaultTool = allTools.reduce(
    (best, t) => (best && best.readiness >= t.readiness ? best : t),
    allTools[0]
  );
  const defaultToolId = defaultTool ? defaultTool.id : null;

  let activeId = $state(defaultToolId);
  // The mobile spec bar waits for a real gesture rather than appearing on load.
  let interacted = $state(false);
  let showMobileInspector = $state(false);

  const activeTech = $derived(
    activeId ? allTools.find((t) => t.id === activeId) || null : null
  );

  let leaveTimer = null;

  function handleTechEnter(id) {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    interacted = true;
    activeId = id;
  }

  function handleTechLeave() {
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      activeId = defaultToolId;
    }, 120);
  }

  function selectTech(id, openMobile = false) {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    interacted = true;
    activeId = id;
    if (openMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
      showMobileInspector = true;
    }
  }
</script>

<!-- One spec sheet, rendered in the desktop inspector and the mobile sheet. -->
{#snippet spec(tech)}
  <div class="flex flex-col gap-3">
    <div class="flex items-baseline justify-between gap-3 border-b pb-2" style="border-color: var(--yorha-border);">
      <div>
        <span class="block font-mono text-label uppercase tracking-widest" style="color: var(--yorha-text-muted);">Selected</span>
        <h4 class="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span>{tech.name}</span>
          <span class="font-mono text-label font-normal" style="color: var(--yorha-accent);">{tech.id}</span>
        </h4>
      </div>
      <div class="text-right">
        <span class="block font-mono text-label uppercase tracking-widest" style="color: var(--yorha-text-muted);">Level</span>
        <span class="font-mono text-label uppercase">{tech.badge}</span>
      </div>
    </div>

    <div class="flex flex-col gap-1.5 border-t pt-2.5" style="border-color: var(--yorha-border);">
      <div class="flex items-center justify-between font-mono text-label">
        <span class="uppercase tracking-wider" style="color: var(--yorha-text-muted);">Operational Scope</span>
        <span class="font-medium uppercase tracking-wider px-1.5 py-0.2 border" style="border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle); color: var(--yorha-accent);">
          {tech.badge === 'DAILY' ? 'Daily Workflow' : tech.badge === 'CORE' ? 'System Foundation' : tech.badge === 'PROD' ? 'Production Deployed' : 'Homelab Cluster'}
        </span>
      </div>
      <p class="text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
        {tech.detail}
      </p>
    </div>

    <div class="flex flex-col gap-1 border-t pt-2.5" style="border-color: var(--yorha-border);">
      <span class="font-mono text-label uppercase tracking-wider" style="color: var(--yorha-text-muted);">Role</span>
      <p class="border-l pl-2.5 text-caption leading-relaxed" style="border-color: var(--yorha-accent-border); color: var(--yorha-text-primary);">
        {tech.role}
      </p>
    </div>

    <div class="flex flex-col gap-1 border-t pt-2.5" style="border-color: var(--yorha-border);">
      <span class="font-mono text-label uppercase tracking-wider" style="color: var(--yorha-text-muted);">Used in</span>
      <p class="pl-2.5 text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
        {tech.deployedAt}
      </p>
    </div>
  </div>
{/snippet}

<Section id="skills" title={headings.skills}>
  <div class="relative flex flex-col gap-8">
    <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-12 lg:gap-8">
      <!-- Left: technologies grouped by layer -->
      <div
        onpointerleave={handleTechLeave}
        class="flex flex-col gap-5 sm:gap-6 md:col-span-7"
        role="presentation"
      >
        {#each stack as layer, li (layer.layer)}
          <div data-anim data-skill-layer class="flex flex-col gap-2.5">
            <div class="flex w-full items-center justify-between border-b border-current/10 pb-2 font-mono text-label uppercase tracking-[0.2em]">
              <div class="flex items-center gap-2">
                <span style="color: var(--yorha-text-muted);">{layer.code || String(li + 1).padStart(2, '0')}</span>
                <span class="font-medium">{layer.layer}</span>
              </div>
              <span style="color: var(--yorha-text-muted);">{layer.items.length} {layer.items.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div class="flex flex-wrap gap-2 py-1 font-mono">
              {#each layer.items as it (it.id)}
                {@const isCurrent = it.id === activeTech?.id}
                <button
                  type="button"
                  onclick={() => selectTech(it.id, true)}
                  onpointerenter={() => handleTechEnter(it.id)}
                  onpointerleave={handleTechLeave}
                  aria-pressed={isCurrent}
                  class="group relative inline-flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-xs transition-colors duration-150 {isCurrent
                    ? 'border-current font-semibold'
                    : 'border-current/20 opacity-80 hover:border-current/50 hover:opacity-100'}"
                  style="background-color: {isCurrent ? 'var(--yorha-surface-elevated)' : 'var(--yorha-surface)'};"
                >
                  <span class="flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden="true">
                    {#if isCurrent}
                      <span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--yorha-accent);"></span>
                    {:else}
                      <span class="text-label leading-none opacity-40">›</span>
                    {/if}
                  </span>
                  <span class="truncate" style="color: {isCurrent ? 'var(--yorha-accent)' : 'inherit'};">{it.name}</span>
                  <span class="border px-1.5 py-0.5 text-label uppercase tracking-wider opacity-60" style="border-color: currentColor;">{it.badge}</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Right: inspector (tablet and desktop) -->
      <div data-anim class="hidden md:sticky md:top-24 md:col-span-5 md:block">
        <div
          class="relative flex min-h-[460px] flex-col justify-between gap-4 border border-current/20 p-5 font-mono text-xs"
          style="background-color: var(--yorha-surface-elevated);"
        >
          <span class="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 border-current/35" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 border-current/35" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-current/35" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-current/35" aria-hidden="true"></span>

          <div class="flex items-center justify-between border-b border-current/10 pb-3">
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full {activeTech ? '' : 'opacity-40'}"
                style="background-color: {activeTech ? 'var(--yorha-accent)' : 'var(--yorha-text-muted)'};"
              ></span>
              <span class="text-label font-bold uppercase tracking-wider">Stack inspector</span>
            </div>
            <span class="text-label uppercase tracking-wider" style="color: var(--yorha-text-muted);">
              {activeTech ? 'Hover another to compare' : 'Hover a technology'}
            </span>
          </div>

          {#if activeTech}
            {#key activeTech.id}
              <div in:fade={{ duration: reduce ? 0 : 150 }} class="flex-1">
                {@render spec(activeTech)}
              </div>
            {/key}
          {:else}
            <div in:fade={{ duration: reduce ? 0 : 150 }} class="my-1 flex flex-1 flex-col items-center justify-center gap-3 border border-dashed border-current/15 px-4 py-12 text-center">
              <div class="flex h-10 w-10 items-center justify-center border border-current/25 text-sm opacity-60">
                <span style="color: var(--yorha-accent);">✦</span>
              </div>
              <p class="mx-auto max-w-[26ch] text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
                Hover a technology on the left to see where and how I use it.
              </p>
            </div>
          {/if}

          <!-- Real counts only -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-t border-current/10 pt-3 text-label" style="color: var(--yorha-text-muted);">
            <span>{allTools.length} technologies · {stack.length} layers</span>
            <span>{activeTech ? `${activeTech.id} selected` : 'Nothing selected'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: compact bar that opens the sheet -->
    {#if interacted && activeTech}
      <div class="sticky bottom-4 z-30 pt-1 md:hidden">
        <button
          type="button"
          onclick={() => (showMobileInspector = true)}
          class="yorha-invert-hover flex w-full cursor-pointer items-center justify-between border px-3.5 py-2.5 font-mono text-xs backdrop-blur-md transition-all"
          style="background-color: var(--yorha-surface-elevated); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
        >
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full" style="background-color: var(--yorha-accent);"></span>
            <span class="font-semibold tracking-wider">{activeTech.name}</span>
            <span class="text-label border px-1 py-0.5 uppercase tracking-wider" style="border-color: var(--yorha-border); color: var(--yorha-accent);">{activeTech.badge}</span>
          </div>
          <span class="border px-1.5 py-0.5 text-label uppercase tracking-wider" style="border-color: var(--yorha-border);">Details ↗</span>
        </button>
      </div>
    {/if}
  </div>
</Section>

<!-- Mobile: bottom sheet with the same spec sheet -->
{#if showMobileInspector && (activeTech || allTools[0])}
  {@const modalTech = activeTech || allTools[0]}
  <div
    use:portal
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-[998] flex flex-col justify-end p-0 backdrop-blur-sm md:hidden"
    style="background-color: var(--yorha-backdrop);"
    onclick={() => (showMobileInspector = false)}
    role="presentation"
  >
    <div
      transition:fly={{ y: 200, duration: 200 }}
      class="relative flex max-h-[85vh] w-full flex-col gap-4 overflow-y-auto rounded-none border-t p-5 font-mono text-xs"
      style="background-color: var(--yorha-surface-elevated); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Technology details"
      tabindex="-1"
      data-lenis-prevent
    >
      <span class="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

      <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--yorha-border);">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full" style="background-color: var(--yorha-accent);"></span>
          <span class="text-label font-bold uppercase tracking-wider">Stack inspector</span>
        </div>
        <button
          type="button"
          onclick={() => (showMobileInspector = false)}
          class="yorha-invert-hover cursor-pointer border px-2 py-1 font-mono text-label uppercase tracking-wider transition-colors"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
        >
          Close
        </button>
      </div>

      {@render spec(modalTech)}

      <button
        type="button"
        onclick={() => (showMobileInspector = false)}
        class="yorha-invert-hover mt-2 w-full cursor-pointer border py-2.5 text-center font-mono text-xs uppercase tracking-wider transition-colors"
        style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
      >
        Back to the list
      </button>
    </div>
  </div>
{/if}
