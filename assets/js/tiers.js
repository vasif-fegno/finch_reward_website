/* Membership page: tier calculator where the card upgrades as you cross tiers */
(() => {
  const lab = document.getElementById('tierlab'); if (!lab) return;
  const range = lab.querySelector('#tl-range'), card = lab.querySelector('.tcard'), $o = s => lab.querySelector(s);
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const T = [
    { cls: 'silver', label: 'SILVER', mult: '1X', x: 1, from: 0, next: 'Gold', at: 50000 },
    { cls: 'gold', label: 'GOLD', mult: '1.5X', x: 1.5, from: 50000, next: 'Platinum', at: 100000 },
    { cls: 'platinum', label: 'PLATINUM', mult: '2X', x: 2, from: 100000, next: null, at: null }
  ];
  const fmt = n => Math.round(n).toLocaleString('en-IN');
  let cur = -1, busy = false, pending = null;
  const apply = i => { const t = T[i]; card.classList.remove('silver', 'gold', 'platinum'); card.classList.add(t.cls); card.querySelector('.tier').textContent = t.label; card.querySelector('.mult').textContent = t.mult; lab.querySelectorAll('[data-jump]').forEach((b, k) => b.classList.toggle('on', k === i)); };
  const morph = i => {
    if (calm || !card.animate || cur < 0) { apply(i); cur = i; return; }
    if (busy) { pending = i; return; }
    busy = true; const up = i > cur;
    if (window.finchSound) finchSound.play(up ? 'coin' : 'whoosh', 0);
    card.animate([{ transform: 'rotateY(0) scale(1)' }, { transform: 'rotateY(90deg) scale(.95)' }], { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).onfinish = () => {
      apply(i); cur = i;
      card.animate([{ transform: 'rotateY(-90deg) scale(.95)' }, { transform: 'rotateY(0) scale(1.04)', offset: .7 }, { transform: 'rotateY(0) scale(1)' }], { duration: 700, easing: 'cubic-bezier(.25,1,.5,1)', fill: 'forwards' }).onfinish = () => {
        if (up) { card.querySelector('.sheen').animate([{ transform: 'translateX(-70%)' }, { transform: 'translateX(70%)' }], { duration: 1000, easing: 'cubic-bezier(.33,0,.15,1)' }); lab.classList.add('lvl'); setTimeout(() => lab.classList.remove('lvl'), 1300); }
        busy = false; if (pending != null && pending !== cur) { const p = pending; pending = null; morph(p); } else pending = null;
      };
    };
  };
  const update = () => {
    const m = +range.value, a = m * 12, i = a >= 100000 ? 2 : a >= 50000 ? 1 : 0, t = T[i], pts = Math.floor(a / 100 * t.x);
    $o('#tl-m').textContent = '₹' + fmt(m); $o('#tl-a').textContent = '₹' + fmt(a); $o('#tl-x').textContent = t.mult; $o('#tl-p').textContent = fmt(pts); $o('#tl-c').textContent = '₹' + fmt(pts * .1);
    $o('#tl-n').textContent = t.next ? '₹' + fmt(t.at - a) + ' more a year to reach ' + t.next : 'You have reached the highest tier';
    $o('#tl-bar').style.width = (t.at ? (a - t.from) / (t.at - t.from) * 100 : 100) + '%';
    range.style.setProperty('--v', (m - range.min) / (range.max - range.min) * 100 + '%');
    if (i !== cur) morph(i);
  };
  range.addEventListener('input', update);
  lab.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => { range.value = b.dataset.jump; update(); }));
  update();
})();
