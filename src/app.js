// Inject shared header and footer
function injectHeaderAndFooter() {
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="container">
          <nav aria-label="グローバルナビゲーション">
            <a href="index.html">ホーム</a>
            <a href="portfolio.html">製品サンプル</a>
            <a href="about.html">私について</a>
            <a href="lab.html">デザイン例</a>
            <a href="pricing.html">料金について</a>
            <a href="contact.html">お問い合わせ</a>
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
          <p>© <span id="year"></span> まぐろろウェブサービス. All rights reserved.</p>
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
  }, { threshold: 0.10, root: null, rootMargin: '0px' });
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
  const form = document.querySelector('form[data-demo-contact], form[data-contact-form]');
  if (!form) return;
  form.setAttribute('novalidate', 'true');

  const status = form.querySelector('.form-status');
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function ensureHint(input, text) {
    const parent = input.closest('label') || input.parentElement;
    let hint = parent.querySelector('.hint-text');
    if (!hint) {
      hint = document.createElement('small');
      hint.className = 'hint-text';
      parent.appendChild(hint);
    }
    hint.textContent = text;
    return hint;
  }

  const hintName = ensureHint(nameInput, 'お名前を入力してください');
  const hintEmail = ensureHint(emailInput, 'メール形式の例: name@example.com');
  const hintMsg = ensureHint(messageInput, '本文は20文字以上で入力してください');

  function updateHints() {
    const nv = (nameInput.value || '').trim();
    const ev = (emailInput.value || '').trim();
    const mv = (messageInput.value || '').trim();
    hintName.style.display = nv ? 'none' : '';
    hintEmail.style.display = ev ? 'none' : '';
    hintMsg.style.display = mv ? 'none' : '';
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
    const parent = input.closest('label') || input.parentElement;
    const err = parent && parent.querySelector('.error-text');
    if (err) err.remove();
  }

  function setError(input, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const parent = input.closest('label') || input.parentElement;
    // Hide hint while showing error on the same field
    const hint = parent.querySelector('.hint-text');
    if (hint) hint.style.display = 'none';
    let err = parent.querySelector('.error-text');
    if (!err) {
      err = document.createElement('small');
      err.className = 'error-text';
      parent.appendChild(err);
    }
    err.textContent = message;
  }

  function validate() {
    let ok = true;
    clearError(nameInput); clearError(emailInput); clearError(messageInput);

    const nameVal = (nameInput.value || '').trim();
    if (!nameVal) { setError(nameInput, 'お名前を入力してください。'); ok = false; }

    const emailVal = (emailInput.value || '').trim();
    if (!EMAIL_RE.test(emailVal)) { setError(emailInput, 'メールアドレスの形式が正しくありません。'); ok = false; }

    const msgVal = (messageInput.value || '').trim();
    if (msgVal.length < 20) { setError(messageInput, '本文は20文字以上で入力してください。'); ok = false; }

    if (status) {
      status.classList.toggle('error', !ok);
      status.textContent = ok ? '' : '入力内容を確認してください。';
    }
    updateHints();
    return ok;
  }

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t === nameInput || t === emailInput || t === messageInput) {
      // live validate lightly
      if (t === emailInput) {
        EMAIL_RE.test((t.value || '').trim()) ? clearError(t) : null;
      } else if (t === messageInput) {
        (t.value || '').trim().length >= 20 ? clearError(t) : null;
      } else if (t === nameInput) {
        (t.value || '').trim() ? clearError(t) : null;
      }
      updateHints();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const first = form.querySelector('.is-invalid');
      if (first) first.focus();
      return;
    }

    const nameVal = (nameInput.value || '').trim();
    const emailVal = (emailInput.value || '').trim();
    const msgVal = (messageInput.value || '').trim();

    // Build mailto URL
    const to = 'maguroro326@gmail.com';
    const subject = encodeURIComponent('ポートフォリオサイトからのお問い合わせ');
    const body = encodeURIComponent(
      `お名前: ${nameVal}\nメール: ${emailVal}\n\n本文:\n${msgVal}`
    );
    const href = `mailto:${to}?subject=${subject}&body=${body}`;

    // Open mail client
    window.location.href = href;
    if (status) status.textContent = 'お使いのメールアプリが起動します。送信を完了してください。';
  });

  // Initialize hints on load
  updateHints();
}

document.addEventListener('DOMContentLoaded', () => {
  // JS is running; remove no-JS fallback flag
  document.documentElement.classList.remove('no-js');
  injectHeaderAndFooter();
  initTheme();
  highlightActiveNav();
  initReveal();
  initParallax();
  initScrollProgress();
  setupContactForm();
  initScrollRevealRestart();
  initParallax();
  initSiteInversion();
});

function initScrollRevealRestart() {
  const revealElements = document.querySelectorAll('.reveal');

  revealElements.forEach(element => {
    element.addEventListener('click', () => {
      // For the specific scroll-reveal-demo card, handle its children
      if (element.classList.contains('scroll-reveal-demo')) {
        const children = element.querySelectorAll('.reveal-child');
        element.classList.remove('reveal-visible');
        children.forEach(el => el.classList.add('no-anim'));
        void element.offsetHeight; // Force reflow
        children.forEach(el => el.classList.remove('no-anim'));
        setTimeout(() => {
          element.classList.add('reveal-visible');
        }, 10);
      } else {
        // For all other .reveal elements
        element.classList.remove('reveal-visible');
        void element.offsetHeight; // Force reflow
        setTimeout(() => {
          element.classList.add('reveal-visible');
        }, 10);
      }
    });
  });
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

// Site-wide color inversion toggled by clicking the Neumorphism card (persists)
function initSiteInversion() {
  const stored = localStorage.getItem('inverted') === '1';
  if (stored) {
    document.documentElement.setAttribute('data-inverted', 'true');
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.neumorphism');
    if (!card) return;
    const turnOn = !document.documentElement.hasAttribute('data-inverted');
    if (turnOn) {
      document.documentElement.setAttribute('data-inverted', 'true');
      localStorage.setItem('inverted', '1');
    } else {
      document.documentElement.removeAttribute('data-inverted');
      localStorage.setItem('inverted', '0');
    }
  });
}
