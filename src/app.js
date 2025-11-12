// Inject shared header and footer
function injectHeaderAndFooter() {
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="logo" href="index.html" aria-label="トップへ">Kanki</a>
          <nav aria-label="グローバルナビゲーション">
            <a href="index.html">Home</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="about.html">About</a>
            <a href="lab.html">Lab</a>
            <a href="contact.html">Contact</a>
          </nav>
          <button id="theme-toggle" class="icon-btn" aria-label="テーマ切替">🌓</button>
        </div>
      </header>`;
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <p>© <span id="year"></span> Kanki. All rights reserved.</p>
        </div>
      </footer>`;
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }
}

function highlightActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-header nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
}

// Theme handling
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function initTheme() {
  const stored = localStorage.getItem('theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (systemDark ? 'dark' : 'light'));
  document.addEventListener('click', (e) => {
    const tg = e.target.closest('#theme-toggle');
    if (!tg) return;
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

// Reveal on scroll
function initReveal() {
  const toReveal = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window)) {
    toReveal.forEach(el => el.classList.add('reveal-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) {
        ent.target.classList.add('reveal-visible');
        io.unobserve(ent.target);
      }
    }
  }, { threshold: 0.12 });
  toReveal.forEach(el => io.observe(el));
}

// Light parallax for hero
function initParallax() {
  const box = document.querySelector('.hero[data-parallax] .container');
  if (!box) return;
  const onScroll = () => {
    const y = Math.min(40, window.scrollY * 0.10);
    box.style.transform = `translate3d(0, ${y}px, 0)`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Scroll progress bar (only on lab)
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? (window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Contact form demo
function setupContactForm() {
  const form = document.querySelector('form[data-demo-contact]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('送信しました！（デモ）');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectHeaderAndFooter();
  initTheme();
  highlightActiveNav();
  initReveal();
  initParallax();
  initScrollProgress();
  setupContactForm();
});

