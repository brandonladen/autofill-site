// Guide page: nav, device tabs (open on the visitor's platform), copy-link buttons,
// click-to-play YouTube, a once-a-week group invite card, and light reveal motion.
(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setOpen(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

  // ---- Device tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  select(document.getElementById(isIOS ? 'tab-ios' : isAndroid ? 'tab-android' : 'tab-desktop'));

  // ---- Copy extension link
  document.querySelectorAll('.copy').forEach(function (btn) {
    var label = btn.querySelector('span');
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.classList.add('done'); label.textContent = 'Copied';
        setTimeout(function () { btn.classList.remove('done'); label.textContent = 'Copy extension link'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this link:', text); });
      } else {
        window.prompt('Copy this link:', text);
      }
    });
  });

  // ---- YouTube: load the player only when asked
  document.querySelectorAll('.yt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-id') + '?autoplay=1&rel=0';
      iframe.title = btn.getAttribute('aria-label').replace(/^Play: /, '');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window;
  if (motion) document.documentElement.classList.add('motion');

  // ---- Group invite: small card after a few seconds, at most once a week
  var KEY = 'lacefi_wa_popup_seen_v1';
  var WEEK = 7 * 24 * 60 * 60 * 1000;
  var invite = document.getElementById('invite');
  function stamp() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  try {
    var last = parseInt(localStorage.getItem(KEY) || '0', 10) || 0;
    if (Date.now() - last > WEEK) {
      setTimeout(function () {
        invite.hidden = false;
        requestAnimationFrame(function () { invite.classList.add('in'); });
        stamp();
      }, 6000);
    }
  } catch (e) { /* storage blocked: skip the card */ }
  document.getElementById('invite-close').addEventListener('click', function () { invite.hidden = true; stamp(); });
  invite.querySelector('a').addEventListener('click', function () { invite.hidden = true; });

  // ---- Reveal on scroll
  if (!motion) return;
  var groups = new Map();
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    var i = groups.get(el.parentElement) || 0;
    el.style.setProperty('--d', Math.min(i * 0.07, 0.4) + 's');
    groups.set(el.parentElement, i + 1);
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
})();
