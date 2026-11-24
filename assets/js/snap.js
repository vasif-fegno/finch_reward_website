/* Guided story: inside the homepage's animated scenes, each scroll gesture glides smoothly to the next point.
   Plain sections (brands, rewards, calculator, promise, footer) scroll normally. */
(() => {
  const story = document.getElementById('story');
  if (!story || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const root = document.documentElement, DUR = 950;
  let stops = [], ranges = [];
  const build = () => {
    const vh = innerHeight; stops = []; ranges = [];
    story.querySelectorAll(':scope > .pin').forEach(s => {
      const top = s.getBoundingClientRect().top + scrollY, L = s.offsetHeight - vh, k = +s.dataset.beats || 0, scene = s.dataset.scene;
      let v = [];
      if (scene === 'one') v = [.17, .5, .84, .97];
      else if (k > 1) for (let i = 0; i < k; i++) v.push((i + .5) / k);
      else if (scene === 'open') v = [0, .97];
      else if (scene === 'bridge') v = [.06, .353, .607, .9];
      else if (scene === 'invite') v = [.06, .97];
      else v = [.5];
      v.forEach(x => stops.push(Math.round(top + L * x)));
      ranges.push([top - 2, top + L + 2]);
    });
    story.querySelectorAll(':scope > section:not(.pin)').forEach(s => { const top = s.getBoundingClientRect().top + scrollY, H = s.offsetHeight; stops.push(Math.round(H < vh ? top - (vh - H) / 2 : top)); });
    stops.sort((a, b) => a - b); window.__finchStops = stops;
  };
  const inStory = y => ranges.some(([a, b]) => y >= a && y <= b);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let anim = false, lastEvt = 0;
  const glide = to => { anim = true; const from = scrollY, d = to - from, DUR = Math.min(1700, Math.max(1100, 1100 + (Math.abs(d) / innerHeight - .5) * 450)), t0 = performance.now(), prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto';
    const f = n => { const k = Math.min(1, (n - t0) / DUR); scrollTo(0, from + d * ease(k)); if (k < 1) requestAnimationFrame(f); else { root.style.scrollBehavior = prev; setTimeout(() => { anim = false; }, 60); } }; requestAnimationFrame(f); };
  /* returns true when the gesture was handled as a story step */
  const step = dir => {
    if (root.classList.contains('intro') || root.classList.contains('menu-open')) return false;
    const y = scrollY, next = dir > 0 ? stops.find(s => s > y + 3) : [...stops].reverse().find(s => s < y - 3);
    if (next == null) return false;
    if (!inStory(y) && Math.abs(next - y) > innerHeight * 1.1) return false;
    glide(next); return true;
  };
  addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaY) < 2) return;
    const now = performance.now(), fresh = now - lastEvt > 180; lastEvt = now;
    if (anim) { e.preventDefault(); return; }
    if (!fresh) { if (inStory(scrollY)) e.preventDefault(); return; }
    if (step(Math.sign(e.deltaY))) e.preventDefault();
  }, { passive: false });
  addEventListener('keydown', e => {
    const dir = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir || /input|textarea|select/i.test(e.target.tagName) || e.target.closest('[role=tablist]')) return;
    if (anim) { e.preventDefault(); return; }
    if (step(e.shiftKey && e.key === ' ' ? -1 : dir)) e.preventDefault();
  });
  let ty = null, tx = 0;
  addEventListener('touchstart', e => { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchmove', e => { if (ty == null) return; if (anim || inStory(scrollY)) e.preventDefault(); }, { passive: false });
  addEventListener('touchend', e => { if (ty == null) return; const dy = ty - e.changedTouches[0].clientY, dx = tx - e.changedTouches[0].clientX; ty = null; if (anim || Math.abs(dy) < 28 || Math.abs(dx) > Math.abs(dy)) return; if (!step(Math.sign(dy)) && inStory(scrollY)) glide(scrollY + Math.sign(dy) * innerHeight * .6); }, { passive: true });
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 250); });
  if (document.readyState === 'complete') build(); else addEventListener('load', build);
  setTimeout(build, 1500);
})();
