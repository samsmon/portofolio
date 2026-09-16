import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, dur, stagger, media } from '$lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

// One shared refresh after a burst of sections mount, so triggers land in the
// right place relative to the pinned hero.
let queued = false;
function queueRefresh() {
  if (queued || typeof window === 'undefined') return;
  queued = true;
  // rAF catches the same-frame layout; the timeout catches the hero's async
  // pin setup (dynamic import) which adds a spacer and shifts everything down.
  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => {
    queued = false;
    ScrollTrigger.refresh();
  }, 350);
}

/**
 * Svelte action for a content section. Its `[data-anim]` descendants animate
 * in (staggered rise + fade) the first time the section enters the viewport
 * and then stay. A `[data-anim-line]` hairline is drawn in via scaleX,
 * `[data-anim-scan]` is the beam that sweeps along it, and
 * `[data-anim-badge]` is the section code that snaps in beside the title.
 *
 * Everything lives inside a gsap.matchMedia context keyed on the visitor's
 * reduced-motion preference, so flipping that preference at the OS level
 * reverts the tweens and ScrollTriggers and rebuilds the section in the other
 * mode without a reload.
 *
 * @param {HTMLElement} node
 */
export function sectionAnim(node) {
  const items = [...node.querySelectorAll('[data-anim]')];
  const line = node.querySelector('[data-anim-line]');
  const scan = node.querySelector('[data-anim-scan]');
  const index = node.querySelector('[data-anim-badge]') || node.querySelector('[data-anim-index]');

  const mm = gsap.matchMedia();

  mm.add({ reduce: media.reduce, motion: media.motion }, (ctx) => {
    if (ctx.conditions.reduce) {
      // Everything already sits in its resting state. The beam is the one
      // element that is only ever meant to be seen mid-sweep, so park it.
      if (scan) gsap.set(scan, { display: 'none' });
      return;
    }

    let alive = true;

    // Initial (hidden) state.
    if (index) gsap.set(index, { yPercent: 120, opacity: 0 });
    if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    if (scan) gsap.set(scan, { opacity: 0, x: -100 });
    gsap.set(items, { opacity: 0, y: 32, filter: 'blur(4px)' });

    const show = () => {
      // 1. Technical section badge snaps in
      if (index) {
        gsap.to(index, {
          yPercent: 0,
          opacity: 1,
          duration: dur.md,
          ease: ease.ui,
          delay: 0.08,
          overwrite: true
        });
      }

      // 2. Precision hairline draws in
      if (line) {
        gsap.to(line, {
          scaleX: 1,
          duration: dur.lg,
          ease: ease.ui,
          delay: 0.04,
          overwrite: true
        });
      }

      // 3. Luminous scanline beam sweeps across the hairline
      if (scan) {
        const sweepDistance = node.clientWidth ? Math.max(node.clientWidth, 1200) : 1200;
        gsap.fromTo(
          scan,
          { x: -120, opacity: 1 },
          {
            x: sweepDistance,
            opacity: 0,
            duration: dur.lg,
            ease: ease.draw,
            overwrite: true
          }
        );
      }

      // 4. Content items rise with optical unblur
      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: dur.sm,
        stagger: stagger.base,
        ease: ease.ui,
        overwrite: true,
        clearProps: 'filter'
      });
    };

    // Sections reveal once and then stay put. Re-hiding content as the
    // visitor scrolls back up reads as restless after the first pass.
    const st = ScrollTrigger.create({
      trigger: node,
      start: 'top 88%',
      once: true,
      onEnter: show
    });

    // Section already within or past the viewport on mount: enter straight away.
    requestAnimationFrame(() => {
      if (alive && st.progress > 0) show();
    });

    queueRefresh();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      let resizeTimer;
      ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
          if (typeof window !== 'undefined') {
            window.__lenis?.resize();
          }
        }, 50);
      });
      ro.observe(node);
    }

    // Tweens and the ScrollTrigger are reverted by the matchMedia context
    // itself; only the observer needs a manual teardown.
    return () => {
      alive = false;
      ro?.disconnect();
    };
  });

  return {
    destroy() {
      mm.revert();
    }
  };
}
