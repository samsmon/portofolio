<script>
  import Section from './Section.svelte';
  import PortraitSwap from './PortraitSwap.svelte';
  import SnakePlaceholder from './SnakePlaceholder.svelte';
  import StatsTelemetry from './StatsTelemetry.svelte';
  import { about, headings } from '$lib/content/site.js';
</script>

<Section id="about" title={headings.about}>
  <div class="grid gap-8 md:grid-cols-[260px_1fr] md:gap-16">
    <!-- Portrait column -->
    <div data-anim class="w-full max-w-sm sm:max-w-[260px] mx-auto md:mx-0">
      <div class="flex sm:flex-col items-stretch sm:items-start gap-4">
        <div class="w-28 sm:w-40 md:w-full shrink-0">
          {#if about.portrait}
            <PortraitSwap
              primary={about.portrait.primary}
              secondary={about.portrait.secondary}
              alt={about.portrait.alt}
            />
          {:else}
            <SnakePlaceholder />
          {/if}
        </div>

        <div class="flex min-w-0 flex-col justify-center gap-1.5 font-mono text-label tracking-[0.16em]">
          {#if about.status}
            <div class="inline-flex items-center gap-2 leading-none" style="color: var(--tactical-text-primary);">
              <span class="h-2 w-2 shrink-0 rounded-full" style="background-color: var(--tactical-accent);"></span>
              <span class="leading-none">{about.status}</span>
            </div>
          {/if}
          <div class="uppercase" style="color: var(--tactical-text-muted);">
            {about.location}
          </div>
        </div>
      </div>
    </div>

    <!-- Prose column -->
    <div class="space-y-6">
      <p
        data-anim
        class="max-w-[var(--measure)] text-balance text-lead font-medium leading-relaxed"
        style="color: var(--tactical-text-primary);"
      >
        {about.intro}
      </p>
      {#each about.body as para}
        <p
          data-anim
          class="max-w-[var(--measure)] text-body leading-relaxed"
          style="color: var(--tactical-text-primary); opacity: 0.85;"
        >
          {para}
        </p>
      {/each}

      <div data-anim class="!mt-8">
        <StatsTelemetry />
      </div>
    </div>
  </div>
</Section>
