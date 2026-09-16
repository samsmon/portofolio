import { goto } from '$app/navigation';

/**
 * Return to the landing page with the scroll anchored at the hero.
 */
export function returnToMainPage() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
  }
  goto('/');
}

/**
 * Ensures the landing page starts at the hero (top 0, 0) unless the visitor
 * arrived with a section hash.
 */
export function restoreMainPageScrollIfNeeded() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      window.__lenis?.scrollTo(0, { immediate: true });
    });
  }
}
