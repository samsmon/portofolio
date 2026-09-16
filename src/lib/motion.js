// Central motion vocabulary. Every GSAP call site speaks this language so the
// whole site eases and times the same way.
//
//  ease.out  : things arriving / revealing. Deep deceleration (expo) reads as
//              "designed" and is the site's signature reveal curve.
//  ease.ui   : small, quick UI moves (nav rows, hovers, list entrances). Soft landing.
//  ease.in   : things leaving.
//  ease.draw : continuous draws (underline scaleX, scan beams) and anything scrubbed.
//
// The opening sequence is the one place allowed to reach past this list: its
// ratchet / elastic / stepped eases are bespoke choreography, not UI motion.

export const ease = {
  out: 'expo.out',
  ui: 'power3.out',
  in: 'power2.in',
  draw: 'power4.inOut'
};

// Duration scale, seconds. Pick by role, don't free-type numbers.
export const dur = {
  xs: 0.22, // micro: hover, tiny toggle, list item leave
  sm: 0.4, // standard UI move, card / row enter
  md: 0.6, // panel enter, badge snap
  lg: 0.9, // section reveal, hairline draw
  xl: 1.1 // long draw
};

export const stagger = {
  tight: 0.03, // dense lists: pills, chips
  base: 0.06, // cards, rows
  slow: 0.22 // two or three large blocks arriving one after another
};

// Media conditions shared by every gsap.matchMedia() context and by the plain
// matchMedia checks in components that animate with CSS / Svelte transitions.
export const media = {
  reduce: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)'
};
