<script>
  import { goto } from '$app/navigation';
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  import ImageLightbox from '$lib/components/ImageLightbox.svelte';

  let { data } = $props();
  const project = $derived(data.project);
  const prevProject = $derived(data.prevProject);
  const nextProject = $derived(data.nextProject);

  /** @type {number | null} */
  let lightboxIndex = $state(null);

  function handleKeyDown(e) {
    if (e.key === 'Escape' && lightboxIndex === null) {
      e.preventDefault();
      goto('/projects');
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
  <title>{project.title} — Architecture & Case Study — Suryatmaja</title>
  <meta name="description" content={project.summary} />
  <meta property="og:title" content={`${project.title} — Suryatmaja`} />
  <meta property="og:description" content={project.summary} />
</svelte:head>

<div class="w-full min-h-screen tactical-tech-bg">
<section class="wrap pt-32 pb-24 min-h-screen" style="color: var(--tactical-text-primary);">
  <!-- Top Navigation Bar: Breadcrumbs (Left) & All Projects Shortcut (Right) -->
  <div class="flex items-center justify-between gap-4 mb-8 max-w-5xl">
    <nav aria-label="Breadcrumbs" class="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.2em] min-w-0">
      <a href="/" class="hover:underline transition-colors shrink-0" style="color: var(--tactical-text-muted);">Home</a>
      <span class="shrink-0" style="color: var(--tactical-text-muted);">/</span>
      <a href="/projects" class="hover:underline transition-colors shrink-0" style="color: var(--tactical-text-muted);">Projects</a>
      <span class="shrink-0" style="color: var(--tactical-text-muted);">/</span>
      <span class="truncate" style="color: var(--tactical-text-primary);">{project.title}</span>
    </nav>

    <a
      href="/projects"
      class="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs border rounded-none transition-all duration-150 hover:-translate-y-0.5 tactical-invert-hover cursor-pointer shrink-0"
      style="background-color: var(--tactical-surface); border-color: var(--tactical-border); color: var(--tactical-text-primary);"
      title="Return to all projects (Press ESC)"
    >
      <span>← [ ALL PROJECTS ]</span>
      <kbd class="px-1.5 py-0.5 text-label font-mono border rounded-none opacity-80" style="border-color: var(--tactical-border); background-color: var(--tactical-bg); color: var(--tactical-text-muted);">ESC</kbd>
    </a>
  </div>

  <!-- Header -->
  <header use:sectionAnim class="mb-12 space-y-4 max-w-4xl">
    <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
      <span
        class="px-2 py-0.5 text-label uppercase tracking-widest font-medium rounded-none border"
        style="border-color: var(--tactical-accent-border); background-color: var(--tactical-accent-subtle); color: var(--tactical-accent);"
      >
        {project.kind}
      </span>
      <span class="uppercase tracking-widest" style="color: var(--tactical-text-muted);">{project.year}</span>
    </div>

    <h1 class="text-h1 font-display tracking-normal leading-[1.15] sm:leading-[1.18] pt-1 pb-1" style="color: var(--tactical-text-primary);">
      {project.title}
    </h1>

    <p class="text-lead leading-relaxed max-w-[var(--measure)]" style="color: var(--tactical-text-muted);">
      {project.summary}
    </p>
  </header>

  <!-- Technical Spec Grid -->
  <div class="grid gap-12 lg:grid-cols-[280px_1fr] max-w-5xl border-t pt-10" style="border-color: var(--tactical-border);">
    <!-- Sidebar: Tactical System Specs -->
    <aside class="group relative border border-current/15 p-5 sm:p-7 space-y-6 font-mono text-xs transition-colors hover:border-current/40" style="background-color: var(--tactical-surface);">
      
      <!-- Top Sweep Line -->
      <span class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style="background-color: var(--tactical-accent);" aria-hidden="true"></span>

      <div class="flex items-center justify-between border-b border-current/10 pb-3 mb-4 uppercase tracking-wider font-semibold opacity-80" style="color: var(--tactical-text-primary);">
        <span>SYSTEM_DATA</span>
        <span class="inline-flex items-center gap-1.5" style="color: var(--tactical-accent);">
          <span class="w-1.5 h-1.5 bg-current animate-ping rounded-full absolute opacity-75"></span>
          <span class="w-1.5 h-1.5 bg-current rounded-full relative"></span>
          <span class="text-label">ONLINE</span>
        </span>
      </div>

      <div>
        <span class="text-label uppercase tracking-[0.2em] block mb-1.5" style="color: var(--tactical-text-muted);">Category</span>
        <span class="font-medium" style="color: var(--tactical-text-primary);">{project.kind} System</span>
      </div>

      <div>
        <span class="text-label uppercase tracking-[0.2em] block mb-1.5" style="color: var(--tactical-text-muted);">Timeline</span>
        <span class="font-medium" style="color: var(--tactical-text-primary);">{project.year}</span>
      </div>

      <div>
        <span class="text-label uppercase tracking-[0.2em] block mb-2" style="color: var(--tactical-text-muted);">Technologies</span>
        <div class="flex flex-wrap gap-1.5">
          {#each project.stack as tech}
            <span
              class="rounded-none border px-2 py-1 text-label"
              style="background-color: var(--tactical-bg); border-color: var(--tactical-border); color: var(--tactical-text-muted);"
            >
              {tech}
            </span>
          {/each}
        </div>
      </div>

      {#if project.links && project.links.length > 0}
        <div class="border-t pt-5 mt-6" style="border-color: var(--tactical-border);">
          <span class="text-label uppercase tracking-[0.2em] block mb-2" style="color: var(--tactical-text-muted);">External Nodes</span>
          <div class="flex flex-col gap-2">
            {#each project.links as link}
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                class="inline-flex items-center justify-between border px-3 py-2 transition-colors rounded-none tactical-invert-hover"
                style="background-color: var(--tactical-bg); border-color: var(--tactical-border); color: var(--tactical-text-primary);"
              >
                <span>[ {link.label.toUpperCase()} ]</span>
                <span style="color: var(--tactical-accent);">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </aside>

    <!-- Main Content: Architecture Breakdown & Gallery -->
    <div class="space-y-10">
      <!-- Detail Paragraphs -->
      <div class="space-y-4">
        <h2 class="font-mono text-xs uppercase tracking-[0.2em] mb-3" style="color: var(--tactical-accent);">
          Architecture & Engineering Notes
        </h2>
        {#each project.detail as para}
          <p class="font-sans text-body leading-relaxed tracking-wide" style="color: var(--tactical-text-muted);">
            {para}
          </p>
        {/each}
      </div>

      <!-- Gallery Images / Illustrations if available -->
      {#if project.images && project.images.length > 0}
        <div class="space-y-4 border-t pt-8" style="border-color: var(--tactical-border);">
          <h2 class="font-mono text-xs uppercase tracking-[0.2em]" style="color: var(--tactical-accent);">
            System Diagrams & Artifacts
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            {#each project.images as img, i}
              <button
                type="button"
                onclick={() => (lightboxIndex = i)}
                class="group relative block w-full overflow-hidden rounded-none border text-left transition-colors hover:border-current/40 cursor-pointer"
                style="background-color: var(--tactical-surface); border-color: var(--tactical-border);"
                aria-label={`View ${project.title} diagram ${i + 1} full size`}
              >
                <!-- Image Metadata Bar (also the click affordance) -->
                <div class="absolute top-0 inset-x-0 z-10 px-2 py-1 font-mono text-label uppercase tracking-widest flex items-center justify-between border-b" style="background-color: var(--tactical-bg); border-color: var(--tactical-border); color: var(--tactical-text-muted);">
                  <span>IMG_DATA // ARCH_{String(i + 1).padStart(2, '0')}</span>
                  <span style="color: var(--tactical-accent);">[VIEW]</span>
                </div>

                <!-- Tactical Corner Reticle Brackets (SVG for perfect pixel alignment) -->
                <svg class="pointer-events-none absolute -top-px -left-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20" style="color: var(--tactical-accent);" viewBox="0 0 8 8" fill="none"><path d="M0 8V0H8" stroke="currentColor" stroke-width="2" /></svg>
                <svg class="pointer-events-none absolute -top-px -right-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20" style="color: var(--tactical-accent);" viewBox="0 0 8 8" fill="none"><path d="M0 0H8V8" stroke="currentColor" stroke-width="2" /></svg>
                <svg class="pointer-events-none absolute -bottom-px -left-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20" style="color: var(--tactical-accent);" viewBox="0 0 8 8" fill="none"><path d="M0 0V8H8" stroke="currentColor" stroke-width="2" /></svg>
                <svg class="pointer-events-none absolute -bottom-px -right-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20" style="color: var(--tactical-accent);" viewBox="0 0 8 8" fill="none"><path d="M8 0V8H0" stroke="currentColor" stroke-width="2" /></svg>
                
                <!-- Scanline Overlay -->
                <div class="pointer-events-none absolute inset-0 z-10 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px] mix-blend-overlay"></div>
                
                <img
                  src={img}
                  alt={`${project.title} diagram ${i + 1}`}
                  loading="lazy"
                  class="w-full h-full object-cover rounded-none mt-6 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if lightboxIndex !== null}
        <ImageLightbox
          images={project.images}
          index={lightboxIndex}
          alt={project.title}
          onClose={() => (lightboxIndex = null)}
        />
      {/if}

      <!-- Bottom Pager -->
      <nav class="border-t pt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs" style="border-color: var(--tactical-border); color: var(--tactical-text-muted);">
        {#if prevProject}
          <a href={`/projects/${prevProject.slug}`} class="hover:underline transition-colors" style="color: var(--tactical-text-primary);">
            ← {prevProject.title}
          </a>
        {:else}
          <a href="/projects" class="hover:underline transition-colors" style="color: var(--tactical-text-primary);">
            ← All Projects
          </a>
        {/if}

        <a
          href="/projects"
          class="inline-flex items-center gap-1.5 px-3 py-1 border rounded-none transition-all duration-150 hover:-translate-y-0.5 tactical-invert-hover cursor-pointer order-last sm:order-none"
          style="background-color: var(--tactical-surface); border-color: var(--tactical-border); color: var(--tactical-text-primary);"
        >
          <span>[ ALL PROJECTS ARCHIVE ]</span>
        </a>

        {#if nextProject}
          <a href={`/projects/${nextProject.slug}`} class="hover:underline transition-colors" style="color: var(--tactical-text-primary);">
            {nextProject.title} →
          </a>
        {:else}
          <a href="/projects" class="hover:underline transition-colors" style="color: var(--tactical-text-primary);">
            Back to Archive ↑
          </a>
        {/if}
      </nav>
    </div>
  </div>
</section>
</div>
