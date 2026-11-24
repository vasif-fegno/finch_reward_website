/* Finch sound: a restrained, royal palette (bells, harp, low strings, timpani) in a soft hall reverb.
   Plays only after the visitor's first tap or key press, and can be muted. */
(() => {
  let ctx = null, on = true, unlocked = false, wet = null, dry = null;
  try { on = localStorage.getItem('finch-sound') !== 'off'; } catch (e) {}
  const hall = c => { const len = Math.floor(c.sampleRate * 3.6), b = c.createBuffer(2, len, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); } return b; };
  const ac = () => {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A();
      const master = ctx.createGain(); master.gain.value = .7; const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
      const verb = ctx.createConvolver(); verb.buffer = hall(ctx); const vg = ctx.createGain(); vg.gain.value = .42; verb.connect(vg); vg.connect(master);
      dry = ctx.createGain(); dry.gain.value = .8; dry.connect(master); wet = verb; }
    if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  const out = n => { n.connect(dry); n.connect(wet); };
  const env = (t, a, d, v) => { const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); return g; };
  const osc = (type, f, t, stop) => { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(stop); return o; };
  const bell = (f, t, v = .11, d = 3.4) => { [[1, 1, 1], [2, .45, .7], [2.76, .3, .55], [5.4, .14, .35], [8.93, .06, .25]].forEach(([r, a, k]) => { const g = env(t, .004, d * k, v * a); osc('sine', f * r, t, t + d * k + .1).connect(g); out(g); }); };
  const pluck = (f, t, v = .09, d = 1.6) => { const g = env(t, .003, d, v); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(700, t + d); osc('triangle', f, t, t + d + .1).connect(lp); lp.connect(g); const g2 = env(t, .003, d * .7, v * .35); osc('sine', f * 2, t, t + d).connect(g2); out(g); out(g2); };
  const strings = (fs, t, a, d, v = .05, f1 = 500, f2 = 1600) => { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .6; lp.frequency.setValueAtTime(f1, t); lp.frequency.exponentialRampToValueAtTime(f2, t + a); const g = env(t, a, d, v); lp.connect(g); out(g); fs.forEach(f => [-5, 5].forEach(c => { const o = osc('sawtooth', f, t, t + a + d + .1); o.detune.value = c; o.connect(lp); })); };
  const air = (t, d, f, v) => { const n = Math.floor(ctx.sampleRate * d), b = ctx.createBuffer(1, n, ctx.sampleRate), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = b; const lp = ctx.createBiquadFilter(); lp.type = 'bandpass'; lp.Q.value = .7; lp.frequency.value = f; const g = env(t, d * .4, d * .6, v); s.connect(lp); lp.connect(g); out(g); s.start(t); s.stop(t + d); };
  const D = [146.8, 220, 293.7, 370, 440, 587.3, 740, 880];
  let stepN = 0;
  const S = {
    bell: t => bell(392, t),
    chime: t => { bell(392, t, .09); bell(587.3, t + .16, .07); },
    coin: t => { bell(1567, t, .045, 1.4); bell(2349, t + .05, .025, 1.1); },
    step: () => {},
    harp: t => { strings([146.8, 220, 293.7], t, 1.1, 1.8, .035, 300, 1100); },
    low: t => { strings([73.4, 110], t, .9, 2.6, .045, 260, 700); bell(196, t + .1, .05, 4); },
    drone: t => { strings([146.8, 220, 293.7], t, 1.8, 1.4, .05, 300, 2200); },
    timpani: t => { const g = env(t, .006, 1.6, .38); const o = osc('sine', 98, t, t + 1.7); o.frequency.exponentialRampToValueAtTime(58, t + .7); o.connect(g); out(g); air(t, .25, 180, .06); },
    rise: t => { [293.7, 440, 587.3].forEach((f, i) => bell(f, t + i * .32, .08, 3.2)); },
    swell: t => { strings([146.8, 220, 293.7, 370, 440], t, 1.6, 2.6, .05, 320, 2400); [587.3, 740, 880].forEach((f, i) => bell(f, t + 1.2 + i * .14, .055, 3.6)); },
    whoosh: t => air(t, .6, 700, .03),
    paper: t => air(t, .45, 1400, .028),
    crack: t => { air(t, .07, 2200, .07); bell(220, t + .02, .04, 1.2); },
    thud: t => S.timpani(t),
    tick: () => {}
  };
  /* basic effects only: no musical cues */
  ['bell', 'step', 'harp', 'low', 'drone', 'rise', 'swell'].forEach(n => { S[n] = () => {}; });
  S.chime = t => S.coin(t);
  S.thud = t => { const g = env(t, .006, .9, .3); const o = osc('sine', 110, t, t + 1); o.frequency.exponentialRampToValueAtTime(52, t + .5); o.connect(g); out(g); air(t, .18, 260, .05); };
  S.timpani = t => S.thud(t);
  const last = {};
  const unlock = () => { unlocked = true; if (on) ac(); };
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(e => addEventListener(e, unlock, { once: true, passive: true }));
  window.finchSound = {
    quiet: false,
    play(n, gap = 260) { if (!on || !unlocked || !S[n] || window.finchSound.quiet) return; const c = ac(); if (!c) return; const now = performance.now(); if (last[n] && now - last[n] < gap) return; last[n] = now; try { S[n](c.currentTime + .02); } catch (e) {} },
    get on() { return on; }
  };
  const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'snd';
  const paint = () => { btn.setAttribute('aria-pressed', on); btn.setAttribute('aria-label', on ? 'Mute sound' : 'Turn sound on'); btn.title = on ? 'Sound on' : 'Sound off'; btn.innerHTML = on ? ICON_ON : ICON_OFF; };
  btn.onclick = () => { on = !on; unlocked = true; try { localStorage.setItem('finch-sound', on ? 'on' : 'off'); } catch (e) {} paint(); if (on) { ac(); window.finchSound.play('chime', 0); } };
  paint(); document.body.append(btn);
})();
