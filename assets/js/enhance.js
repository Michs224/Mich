/* ============================================================
   enhance.js — modern interactivity layer (additive)
   Scroll progress, scroll-reveal (stagger), back-to-top,
   hero scroll-down chevron. Degrades gracefully.
   ============================================================ */
(function () {
	'use strict';

	var docEl = document.documentElement;
	var reduceMotion = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function onReady(fn) {
		if (document.readyState !== 'loading') fn();
		else document.addEventListener('DOMContentLoaded', fn);
	}

	onReady(function () {

		/* ---- Scroll progress bar ---- */
		var bar = document.createElement('div');
		bar.id = 'scrollProgress';
		document.body.appendChild(bar);

		function updateProgress() {
			var scrolled = window.pageYOffset || docEl.scrollTop;
			var height = docEl.scrollHeight - docEl.clientHeight;
			var pct = height > 0 ? (scrolled / height) * 100 : 0;
			bar.style.width = pct + '%';
		}
		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress);
		updateProgress();

		/* ---- Back to top ---- */
		var btt = document.createElement('button');
		btt.id = 'backToTop';
		btt.type = 'button';
		btt.setAttribute('aria-label', 'Back to top');
		btt.innerHTML = '<span class="icon solid fa-arrow-up" aria-hidden="true"></span>';
		document.body.appendChild(btt);

		btt.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
		});

		function toggleBtt() {
			var scrolled = window.pageYOffset || docEl.scrollTop;
			if (scrolled > 600) btt.classList.add('visible');
			else btt.classList.remove('visible');
		}
		window.addEventListener('scroll', toggleBtt, { passive: true });
		toggleBtt();

		/* ---- Scroll reveal with stagger ---- */
		if (reduceMotion || !('IntersectionObserver' in window)) return;

		var targets = [];
		function collect(selector) {
			var nodes = document.querySelectorAll(selector);
			for (var i = 0; i < nodes.length; i++) targets.push(nodes[i]);
		}

		// Section headers (skip the hero)
		var sections = document.querySelectorAll('#main > section');
		for (var s = 0; s < sections.length; s++) {
			if (sections[s].id === 'top') continue;
			var header = sections[s].querySelector('.container > header');
			if (header) targets.push(header);
			// intro paragraph right under a section header (e.g. Projects, Contact)
			var lead = sections[s].querySelector('.container > header + p');
			if (lead) targets.push(lead);
		}

		collect('.timeline-item');
		collect('.education-card');
		collect('#projects .row > *');
		collect('.cert-item');
		collect('.other-cert-item');
		collect('.achievement-item');
		collect('#about .image.featured');
		collect('#about > .container > p');
		collect('#contact form');

		if (!targets.length) return;

		// Assign a stagger delay based on position among reveal siblings
		targets.forEach(function (el) { el.classList.add('reveal'); });
		targets.forEach(function (el) {
			var siblings = [];
			var kids = el.parentNode.children;
			for (var i = 0; i < kids.length; i++) {
				if (kids[i].classList && kids[i].classList.contains('reveal')) siblings.push(kids[i]);
			}
			var idx = siblings.indexOf(el);
			var delay = Math.min(idx, 6) * 70;
			el.style.transitionDelay = delay + 'ms';
		});

		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

		var vh = window.innerHeight || docEl.clientHeight;
		targets.forEach(function (el) {
			var rect = el.getBoundingClientRect();
			// Already visible on load: show immediately, no stagger.
			if (rect.top < vh * 0.92 && rect.bottom > 0) {
				el.style.transitionDelay = '0ms';
				el.classList.add('is-visible');
			} else {
				io.observe(el);
			}
		});
	});
})();
