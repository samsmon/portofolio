<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import IntroCalibration from '$lib/components/intro/IntroCalibration.svelte';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';
  import { restoreMainPageScrollIfNeeded } from '$lib/utils/navigationState.js';

  // Opening sequence: once per browser session, motion-capable tiers only.
  // Decided during client init (not onMount) so the black overlay is in the
  // very first client paint — otherwise the hero flashes through first.
  function wantIntro() {
    if (!browser) return false;
    try {
      if (sessionStorage.getItem('intro:seen')) return false;
    } catch {
      return false;
    }
    return !prefersReducedMotion() && detectTier() !== 'static';
  }

  let intro = $state(wantIntro());
  // Hero's supporting lines wait for the intro to hand over (or start straight
  // away when there's no intro).
  let heroReady = $state(!intro);

  onMount(() => {
    restoreMainPageScrollIfNeeded();
  });
</script>

{#if intro}
  <IntroCalibration
    onDone={() => {
      intro = false;
      heroReady = true;
    }}
  />
{/if}

<Hero {heroReady} />

<div class="relative z-10 yorha-tech-bg" style="background-color: var(--yorha-bg);">
  <!-- Seamless Grid Dissolve Mask: Top 260px smoothly dissolves the 3px tech grid in -->
  <div
    class="pointer-events-none absolute top-0 left-0 right-0 h-56 sm:h-72 z-0 bg-gradient-to-b from-[var(--yorha-bg)] via-[var(--yorha-bg)]/85 to-transparent"
    aria-hidden="true"
  ></div>

  <!-- A single quiet hairline marks the hand-over from sky to page. Any label
       here would be the strongest attention magnet on the page, so it stays
       empty on purpose. -->
  <div class="relative z-10 w-full border-b border-current/15" aria-hidden="true"></div>

  <About />
  <Skills />
  <Portfolio />
  <Contact />
</div>
