// The home page's opening scene (Intro.astro, scripts/intro.ts) plays whenever a visitor arrives from
// outside the site and on every reload, as the old site's splash did (owner's requests, 2026-10-25):
// not on back or forward, not on a link to a section, and not when coming from another page of this
// site. This gate runs inline in <head>, before the first paint, so the curtain is there from the
// first frame or not at all; without JavaScript it never shows. It sets two classes: `has-intro`
// shows the curtain, `intro-hold` keeps the hero's entrance waiting for it.
// BaseLayout adds its hash to the CSP. One line, so HTML compression cannot change what is hashed.
export const INTRO_GATE = `(function(){try{var n=performance.getEntriesByType('navigation')[0],t=n?n.type:'navigate';var r=document.referrer&&new URL(document.referrer).origin===location.origin;if(location.hash||!(t==='reload'||(t==='navigate'&&!r)))return;document.documentElement.classList.add('has-intro','intro-hold')}catch(e){}})();`;
