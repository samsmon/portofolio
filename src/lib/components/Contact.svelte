<script>
  import { onMount } from 'svelte';
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  import ResumeModal from './ResumeModal.svelte';
  import SiteTelemetry from './SiteTelemetry.svelte';
  import { contact, headings, identity, availability } from '$lib/content/site.js';

  const year = new Date().getFullYear();

  let copied = $state(false);
  let copyTimer;
  let showResume = $state(false);

  // Public visit counter. The endpoint counts every hit and this footer
  // remounts on client-side navigation, so bump it once per session and read
  // the cached value afterwards. There is no local fallback on purpose:
  // inventing a number only that visitor can see is worse than showing nothing.
  let visitorCount = $state(null);

  const COUNTER_URL = 'https://api.counterapi.dev/v1/suryatmaja-portfolio/visits';
  const COUNTER_SESSION_KEY = 'visitor_count';

  onMount(async () => {
    let cached = null;
    try {
      cached = sessionStorage.getItem(COUNTER_SESSION_KEY);
    } catch {
      /* private mode */
    }

    if (cached) {
      visitorCount = Number(cached) || null;
      return;
    }

    try {
      const signal = AbortSignal?.timeout ? AbortSignal.timeout(4000) : undefined;
      const res = await fetch(`${COUNTER_URL}/up`, { signal });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data?.count !== 'number') return;
      visitorCount = data.count;
      try {
        sessionStorage.setItem(COUNTER_SESSION_KEY, String(data.count));
      } catch {
        /* private mode */
      }
    } catch {
      // Offline, blocked or too slow: the badge simply does not render.
    }
  });

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      copied = true;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // Clipboard blocked: the mailto link above still works.
    }
  }
</script>

<footer
  id="contact"
  data-section
  use:sectionAnim
  class="relative flex flex-col justify-center py-12 sm:py-24"
>
  <div class="wrap">
    <header class="relative mb-6 sm:mb-10 pb-3 sm:pb-4">
      <div class="flex items-end justify-between gap-4 pb-1">
        <h2 class="text-h2 font-semibold uppercase tracking-tight font-display">
          {headings.contact}
        </h2>
        <div class="overflow-hidden pb-1">
          <span
            data-anim-badge
            class="block font-mono text-label font-medium tracking-[0.25em] uppercase will-change-transform"
            style="color: var(--yorha-text-muted);"
          >
            SEC // 05
          </span>
        </div>
      </div>

      <div class="relative mt-3 h-px w-full overflow-hidden" style="background-color: var(--yorha-border);">
        <span
          data-anim-line
          class="absolute inset-y-0 left-0 h-full w-full origin-left bg-gradient-to-r from-current/50 via-current/25 to-transparent"
          aria-hidden="true"
        ></span>
        <span
          data-anim-scan
          class="absolute inset-y-0 -left-28 h-full w-28 bg-gradient-to-r from-transparent via-current to-transparent opacity-40"
          aria-hidden="true"
        ></span>
      </div>
    </header>

    <!-- Intro and journal link -->
    <div data-anim class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
      <p class="max-w-[var(--measure)] text-lead leading-relaxed" style="color: var(--yorha-text-primary); opacity: 0.85;">
        {contact.body}
      </p>

      <a
        href="/blog"
        class="yorha-invert-hover group inline-flex items-center gap-2 self-start sm:self-auto border border-current/20 bg-current/5 px-4 py-2.5 font-mono text-label uppercase tracking-[0.2em] transition-all duration-150 shrink-0"
      >
        <span style="color: var(--yorha-accent);">■</span>
        <span>Engineering journal</span>
        <span class="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>

    <!-- Availability and resume -->
    {#if availability}
      <div
        data-anim
        class="mt-8 sm:mt-10 grid gap-5 border-t border-current/10 pt-6 md:grid-cols-[1fr_auto] md:items-end"
      >
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2.5 font-display text-h3 font-semibold tracking-tight" style="color: var(--yorha-text-primary);">
            <span class="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style="background-color: var(--yorha-accent);"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full" style="background-color: var(--yorha-accent);"></span>
            </span>
            <span>{availability.status}</span>
          </div>

          <dl class="grid gap-x-8 gap-y-2 font-mono text-caption sm:grid-cols-[auto_1fr]">
            <dt class="text-label uppercase tracking-[0.2em] sm:pt-0.5" style="color: var(--yorha-text-muted);">Type</dt>
            <dd style="color: var(--yorha-text-primary);">{availability.type}</dd>
            <dt class="text-label uppercase tracking-[0.2em] sm:pt-0.5" style="color: var(--yorha-text-muted);">Location</dt>
            <dd style="color: var(--yorha-text-primary);">{availability.location}</dd>
            <dt class="text-label uppercase tracking-[0.2em] sm:pt-0.5" style="color: var(--yorha-text-muted);">Roles</dt>
            <dd style="color: var(--yorha-text-primary);">{availability.roles.join(' · ')}</dd>
          </dl>
        </div>

        <button
          type="button"
          onclick={() => (showResume = true)}
          class="yorha-invert-hover inline-flex items-center justify-center gap-2 border border-current/20 bg-current/5 px-5 py-3 font-mono text-label uppercase tracking-[0.18em] transition-all duration-150 cursor-pointer"
        >
          <span>View resume / CV</span>
          <span style="color: var(--yorha-accent);">↗</span>
        </button>
      </div>
    {/if}

    <!-- Channels -->
    <div data-anim class="mt-8 sm:mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
      <!-- Email -->
      <div
        class="group relative flex flex-col justify-between border border-current/15 p-5 sm:p-7 transition-all duration-150 hover:-translate-y-0.5 hover:border-current/40"
        style="background-color: var(--yorha-surface);"
      >
        <span class="pointer-events-none absolute top-[-1px] left-[-1px] h-2.5 w-2.5 border-l-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute top-[-1px] right-[-1px] h-2.5 w-2.5 border-r-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] left-[-1px] h-2.5 w-2.5 border-b-2 border-l-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] right-[-1px] h-2.5 w-2.5 border-b-2 border-r-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
          style="background-color: var(--yorha-accent);"
          aria-hidden="true"
        ></span>

        <div>
          <div class="flex items-center justify-between font-mono text-label uppercase tracking-wider" style="color: var(--yorha-text-muted);">
            <span>01</span>
            <span>Email</span>
          </div>
          <h3 class="mt-3 font-display text-lg font-semibold tracking-tight">Write to me directly</h3>
          <p class="mt-2 text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
            Fastest channel for infrastructure work, cloud contracts, or a quick question.
          </p>
        </div>

        <div class="mt-6 flex flex-col gap-2 border-t border-current/10 pt-4">
          <a
            href={'mailto:' + contact.email}
            class="font-mono text-sm font-medium tracking-tight hover:underline select-all truncate"
            style="color: var(--yorha-accent);"
          >
            {contact.email}
          </a>
          <button
            type="button"
            onclick={copyEmail}
            aria-label="Copy email address"
            aria-live="polite"
            class="w-full yorha-invert-hover inline-flex items-center justify-center gap-2 border px-3 py-2 font-mono text-label uppercase tracking-[0.16em] transition-all cursor-pointer {copied ? 'border-current font-semibold' : 'border-current/20 bg-current/5 hover:border-current/50'}"
            style={copied ? 'color: var(--yorha-accent);' : ''}
          >
            <span>{copied ? 'Copied' : 'Copy address'}</span>
          </button>
        </div>
      </div>

      <!-- Profiles -->
      <div
        class="group relative flex flex-col justify-between border border-current/15 p-5 sm:p-7 transition-all duration-150 hover:-translate-y-0.5 hover:border-current/40"
        style="background-color: var(--yorha-surface);"
      >
        <span class="pointer-events-none absolute top-[-1px] left-[-1px] h-2.5 w-2.5 border-l-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute top-[-1px] right-[-1px] h-2.5 w-2.5 border-r-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] left-[-1px] h-2.5 w-2.5 border-b-2 border-l-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] right-[-1px] h-2.5 w-2.5 border-b-2 border-r-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
          style="background-color: var(--yorha-accent);"
          aria-hidden="true"
        ></span>

        <div>
          <div class="flex items-center justify-between font-mono text-label uppercase tracking-wider" style="color: var(--yorha-text-muted);">
            <span>02</span>
            <span>Profiles</span>
          </div>
          <h3 class="mt-3 font-display text-lg font-semibold tracking-tight">Code and career</h3>
          <p class="mt-2 text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
            Public repositories, and the longer version of the story on LinkedIn.
          </p>
        </div>

        <div class="mt-6 flex flex-col gap-2 border-t border-current/10 pt-4">
          <a
            href="https://github.com/srytmj"
            target="_blank"
            rel="noopener noreferrer"
            class="group/item flex items-center justify-between border border-current/15 bg-current/[0.02] px-3 py-2 font-mono transition-all hover:border-current/40 hover:bg-current/5"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-label" style="color: var(--yorha-accent);">■</span>
              <div class="flex flex-col">
                <span class="text-xs font-semibold tracking-tight">GitHub</span>
                <span class="text-label select-all" style="color: var(--yorha-text-muted);">github.com/srytmj</span>
              </div>
            </div>
            <span class="text-label uppercase tracking-wider transition-transform group-hover/item:translate-x-1" style="color: var(--yorha-accent);">Open →</span>
          </a>

          <a
            href="https://www.linkedin.com/in/suryatmaja/"
            target="_blank"
            rel="noopener noreferrer"
            class="group/item flex items-center justify-between border border-current/15 bg-current/[0.02] px-3 py-2 font-mono transition-all hover:border-current/40 hover:bg-current/5"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-label" style="color: var(--yorha-accent);">■</span>
              <div class="flex flex-col">
                <span class="text-xs font-semibold tracking-tight">LinkedIn</span>
                <span class="text-label select-all" style="color: var(--yorha-text-muted);">linkedin.com/in/suryatmaja</span>
              </div>
            </div>
            <span class="text-label uppercase tracking-wider transition-transform group-hover/item:translate-x-1" style="color: var(--yorha-accent);">Open →</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Real telemetry: how this page runs on the visitor's device -->
    <div data-anim class="mt-8 sm:mt-12">
      <SiteTelemetry />
    </div>

    <!-- Footer bar -->
    <div
      data-anim
      class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-current/10 pt-4 sm:pt-6 font-mono text-label uppercase tracking-[0.22em]"
    >
      <span style="color: var(--yorha-text-muted);">© {year} {identity.name}</span>

      <div class="flex flex-wrap items-center gap-3">
        {#if availability}
          <span
            class="inline-flex items-center gap-2 border px-3 py-1.5 select-none"
            style="border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle); color: var(--yorha-accent);"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background-color: var(--yorha-accent);"></span>
            <span class="font-medium leading-none">{availability.status} · UTC+7</span>
          </span>
        {/if}

        {#if visitorCount && visitorCount > 1000}
          <span class="inline-flex items-center border border-current/15 bg-current/[0.02] px-2.5 py-1.5 leading-none" style="color: var(--yorha-text-muted);">
            Visited by {visitorCount.toLocaleString()}
          </span>
        {/if}
      </div>
    </div>
  </div>
</footer>

{#if showResume}
  <ResumeModal onClose={() => (showResume = false)} />
{/if}
