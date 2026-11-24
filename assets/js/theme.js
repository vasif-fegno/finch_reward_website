/* Light / dark theme toggle, remembered between visits */
(() => {
  const root = document.documentElement, btn = document.querySelector('.themebtn'); if (!btn) return;
  const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const logos = () => document.querySelectorAll('img[src$="logo.svg"],img[src$="logo-dark.svg"]');
  const paint = () => {
    const light = root.getAttribute('data-finch') === 'light';
    btn.innerHTML = light ? MOON : SUN;
    btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); btn.title = btn.getAttribute('aria-label');
    logos().forEach(i => { if (i.closest('.mcard,.tcard,.hc,.seal,.coin,.phone')) return; i.src = 'assets/img/' + (light ? 'logo-dark.svg' : 'logo.svg'); });
  };
  btn.addEventListener('click', () => {
    const light = root.getAttribute('data-finch') !== 'light';
    root.classList.add('theming');
    if (light) root.setAttribute('data-finch', 'light'); else root.removeAttribute('data-finch');
    try { localStorage.setItem('finch-theme', light ? 'light' : 'dark'); } catch (e) {}
    paint(); setTimeout(() => root.classList.remove('theming'), 700);
    window.finchSound && finchSound.play('whoosh', 0);
  });
  paint();
})();
