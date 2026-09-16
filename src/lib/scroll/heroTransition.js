import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, media } from '$lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero to content scroll choreography. Client-only.
 *
 * mode:
 *  - 'full'   : pin the hero and scrub the overlay away. Desktop / capable devices.
 *  - 'lite'   : same pin + scrub with gentler distances. Mid devices.
 *  - 'static' : NO pin (pinning is the expensive part). The hero just scrolls
 *               away while the overlay cross-fades. Low-end / reduced-motion.
 *
 * The pinned modes are built inside gsap.matchMedia, so the pin distance and
 * scrub lag follow the viewport bucket live: crossing a breakpoint reverts and
 * rebuilds the timeline instead of keeping the numbers measured at mount.
 *
 * @param {{
 *   pinTarget: HTMLElement,
 *   trigger: HTMLElement,
 *   overlayEl: HTMLElement,
 *   mode: 'full' | 'lite' | 'static',
 *   onProgress: (p: number) => void
 * }} cfg
 * @returns {() => void} cleanup
 */
export function createHeroTransition(cfg) {
  const { pinTarget, trigger, overlayEl, mode, onProgress } = cfg;

  if (mode === 'static') {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          const p = self.progress;
          onProgress(p);
          overlayEl.style.opacity = String(Math.max(0, 1 - p * 1.6));
          overlayEl.style.transform = `translateY(${p * -20}px)`;
        }
      });
    });
    return () => ctx.revert();
  }

  const gentle = mode === 'lite';
  const mm = gsap.matchMedia();

  mm.add({ mobile: media.mobile, tablet: media.tablet, desktop: media.desktop }, (ctx) => {
    const { mobile, tablet } = ctx.conditions;
    const endDistance = mobile ? '+=40%' : tablet ? '+=60%' : gentle ? '+=75%' : '+=90%';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: endDistance,
        scrub: mobile ? 0.3 : 0.6,
        pin: pinTarget,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Refresh this pinned trigger BEFORE the section triggers below it, so
        // the pin spacer exists when they measure their positions.
        refreshPriority: 1,
        onUpdate: (self) => onProgress(self.progress)
      }
    });

    // Fade + lift the whole overlay (name + sub-line together) so it dissolves
    // as one. No scale: on a large left-aligned headline the shrink read as a
    // glitch rather than a transition.
    tl.to(
      overlayEl,
      {
        opacity: 0,
        y: gentle ? -18 : -28,
        filter: gentle ? 'blur(5px)' : 'blur(9px)',
        ease: ease.in
      },
      0
    );
  });

  // Pin spacer changes document height: recalc every trigger once it's laid out.
  ScrollTrigger.refresh();
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => mm.revert();
}

export { ScrollTrigger, gsap };
