/* Redeem: the receipt payoff scene and the "treat yourself" showcase */
(() => {
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => cl((p - a) / (b - a)), ease = t => 1 - Math.pow(1 - t, 3);
  const inr = n => Math.round(n).toLocaleString('en-IN'), calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const gone = n => n.parentNode && n.parentNode.removeChild(n);
  const burst = (el, count = 26) => { if (calm) return; const b = el.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    for (let i = 0; i < count; i++) { const m = document.createElement('i'); m.className = 'mini'; const s = 12 + Math.random() * 16; m.style.width = m.style.height = s + 'px'; document.body.append(m);
      const a = Math.random() * 6.283, d = 90 + Math.random() * 260, ex = x + Math.cos(a) * d, ey = y + Math.sin(a) * d * .75;
      m.animate([{ transform: `translate(${x}px,${y}px) scale(.4)`, opacity: 1 }, { transform: `translate(${ex}px,${ey - 40}px) scale(1) rotateY(360deg)`, opacity: 1, offset: .5 }, { transform: `translate(${ex}px,${ey + 120}px) scale(.5) rotateY(720deg)`, opacity: 0 }], { duration: 1000 + Math.random() * 700, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'both' }).onfinish = () => gone(m); } };
  let fired = false; window.finchBurst = burst;
  window.payoffScene = (s, p) => {
    const a = ease(seg(p, .02, .16)), r = q('.po-r', s); r.style.transform = `translateY(${(1 - a) * 60}vh) rotate(${(1 - a) * -7 + 1.5}deg)`; r.style.opacity = seg(p, .02, .08);
    const k = ease(seg(p, .21, .29)), pts = Math.round(k * 20) * 50;  q('#poN', s).textContent = inr(pts); q('#poB', s).textContent = inr(2500 - pts); q('.po-pts', s).style.opacity = seg(p, .21, .25); q('.po-r', s).classList.toggle('tense', p > .42 && p < .58); q('.po-bar i', s).style.width = k * 100 + '%';
    const f = ease(seg(p, .58, .68)); q('#poT', s).textContent = '₹' + inr(600 - 100 * f); q('.po-old', s).style.opacity = seg(p, .57, .6); q('.po-tot', s).classList.toggle('won', f > .98);
    const st = seg(p, .76, .84), m = q('.po-stamp', s); m.style.opacity = st > 0 ? 1 : 0; m.style.transform = `rotate(-11deg) scale(${2.4 - 1.4 * ease(st)})`;
    if (p > .8 && !fired) { fired = true; burst(m, 30); if (window.finchSound) { finchSound.play('timpani'); setTimeout(() => finchSound.play('chime', 0), 260); } const g = q('.glow', s); if (g && !calm) g.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(2.2)', offset: .2 }, { filter: 'brightness(1)' }], { duration: 1400 }); } if (p < .72) fired = false;
  };
  const t = q('.treat'); if (!t) return;
  const tabs = qa('.tt', t), panes = qa('.tp', t); let i = 0, timer, seen = false;
  const show = (n, user) => { i = n; tabs.forEach((b, x) => { b.classList.toggle('on', x === n); b.setAttribute('aria-selected', x === n); }); panes.forEach((v, x) => { v.classList.remove('play'); v.hidden = x !== n; }); void panes[n].offsetWidth; panes[n].classList.add('play'); if (user) { clearInterval(timer); timer = null; burst(tabs[n], 12); window.finchSound && finchSound.play('coin'); } };
  tabs.forEach((b, n) => b.onclick = () => { seen = true; show(n, true); });
  new IntersectionObserver(e => { const on = e[0].isIntersecting; if (on && !seen) { seen = true; show(0); } if (on && !timer && seen && !t.dataset.stop && !calm) timer = setInterval(() => show((i + 1) % tabs.length), 5200); if (!on && timer) { clearInterval(timer); timer = null; } }, { threshold: .35 }).observe(t);
  tabs.forEach(b => b.addEventListener('click', () => t.dataset.stop = 1));
  show(0);
})();
