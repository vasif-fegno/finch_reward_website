/* Video banner: fade the city in from black, then raise the headline */
(() => {
  const st = document.querySelector('.vstick'); if (!st) return;
  const v = st.querySelector('video'), root = document.documentElement;
  let started = false;
  const go = () => { if (started) return; started = true;
    requestAnimationFrame(() => st.classList.add('go'));
    setTimeout(() => st.classList.remove('entering'), 1600);
    setTimeout(() => root.classList.remove('intro'), 3400);
  };
  if (v) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {});
    if (v.readyState >= 3) go(); else { v.addEventListener('canplay', go, { once: true }); setTimeout(go, 2500); } }
  else go();
  /* save battery: pause when the banner is off screen */
  if (v && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => { if (e.isIntersecting) { const p = v.play(); p && p.catch && p.catch(() => {}); } else v.pause(); }).observe(st);
})();
