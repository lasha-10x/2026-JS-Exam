/* ============================================================
   glass-ui.js — BONUS visual layer (not part of the CRM).

   Three presentation touches that CSS alone cannot do:
     1. the topbar frosts once the page is scrolled
     2. cards tilt slightly towards the pointer
     3. newly rendered cards fade in one after another

   It never reads or writes CRM state. Everything is delegated from
   <body> or driven by an observer, so it also covers cards that the
   CRM JavaScript creates later — no need to call anything from your
   render code.

   Delete the <script> tag and the app looks static but works the same.
   ============================================================ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  /* ---------- 1. Sticky topbar ---------- */
  /* Which element actually scrolls depends on the stylesheet: with glass.css
     the window scrolls, without it .content does. Rather than assume, find
     the one that can really overflow. */
  function findScroller() {
    const content = document.querySelector('.content');
    if (content) {
      const oy = getComputedStyle(content).overflowY;
      const scrollable = oy === 'auto' || oy === 'scroll';
      if (scrollable && content.scrollHeight > content.clientHeight + 1) return content;
    }
    return null; // null means "the window scrolls"
  }

  function initStickyTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const scroller = findScroller();
    const target = scroller || window;
    const readTop = () => (scroller ? scroller.scrollTop : window.scrollY);

    const onScroll = () => topbar.classList.toggle('scrolled', readTop() > 8);
    onScroll();
    target.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Pointer tilt ---------- */
  /* One listener on <body> covers every card, including the ones the CRM
     renders after this file has run. */
  function initTilt() {
    if (coarse || reduce) return;

    document.body.addEventListener(
      'mousemove',
      (e) => {
        const card = e.target.closest('.card, .stat');
        if (!card) return;
        const b = card.getBoundingClientRect();
        const dx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
        const dy = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
        card.style.transition = 'none';
        card.style.transform =
          'translateY(-0.5rem) rotateX(' + -dy * 3 + 'deg) rotateY(' + dx * 3 + 'deg)';
      },
      { passive: true },
    );

    document.body.addEventListener(
      'mouseout',
      (e) => {
        const card = e.target.closest('.card, .stat');
        /* ignore moves between children of the same card */
        if (!card || card.contains(e.relatedTarget)) return;
        card.style.transform = '';
        card.style.transition = '';
      },
      { passive: true },
    );
  }

  /* ---------- 3. Staggered reveal ---------- */
  /* A MutationObserver spots cards the CRM adds to a render target and gives
     each one an increasing delay, so a list arrives as a wave. */
  function initReveal() {
    if (reduce) return;

    const stagger = (nodes) => {
      let i = 0;
      nodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (!node.matches('.client-card, .stat, .recent-row, .pipe-row')) return;
        node.style.animation = 'reveal-up 0.5s cubic-bezier(0.22,0.68,0,1.2) both';
        node.style.animationDelay = i * 40 + 'ms';
        i++;
      });
    };

    const observer = new MutationObserver((records) => {
      records.forEach((r) => {
        stagger(r.addedNodes);
        /* the cards usually arrive inside a wrapper (.client-grid), so look
           one level down as well */
        r.addedNodes.forEach((n) => {
          if (n.nodeType === 1 && n.children.length) stagger([...n.children]);
        });
      });
    });

    /* every render target the CRM fills; missing ones are simply skipped */
    ['clientsArea', 'statCards', 'recent', 'pipeline', 'pfStats'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });
  }

  function init() {
    initStickyTopbar();
    initTilt();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
