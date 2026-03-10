/**
 * Blog Engagement Tracking (GA4)
 * Fires custom events for article pages under /pages/blog/
 *
 * Events:
 *   blog_read_30s  – user stayed on article for 30+ seconds
 *   blog_read_75   – user scrolled past 75% of the article body
 *   blog_cta_click – user clicked a CTA button inside the article
 */
(() => {
  // Only run on individual article pages, not the blog listing
  const path = window.location.pathname;
  if (!path.includes('/blog/') || path.endsWith('blog.html') || path.endsWith('blog-el.html')) return;

  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;

  const articleTitle = document.title.split('|')[0].trim();
  const lang = document.documentElement.lang || 'en';

  // --- 30-second read timer ---
  let timer30 = null;
  let fired30 = false;

  function start30sTimer() {
    if (fired30 || timer30) return;
    timer30 = window.setTimeout(() => {
      fired30 = true;
      gtag('event', 'blog_read_30s', {
        article_title: articleTitle,
        article_path: path,
        article_lang: lang
      });
    }, 30000);
  }

  function pause30sTimer() {
    if (timer30) {
      window.clearTimeout(timer30);
      timer30 = null;
    }
  }

  // Start when page is visible, pause when hidden
  start30sTimer();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause30sTimer();
    else start30sTimer();
  });

  // --- 75% scroll depth ---
  let fired75 = false;

  function checkScrollDepth() {
    if (fired75) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = window.scrollY / docHeight;
    if (pct >= 0.75) {
      fired75 = true;
      gtag('event', 'blog_read_75', {
        article_title: articleTitle,
        article_path: path,
        article_lang: lang
      });
      window.removeEventListener('scroll', onScroll);
    }
  }

  let scrollTick = false;
  function onScroll() {
    if (!scrollTick) {
      scrollTick = true;
      window.requestAnimationFrame(() => {
        checkScrollDepth();
        scrollTick = false;
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- CTA click tracking ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.article-cta .btn-book, .blog-cta .btn-book');
    if (!btn) return;
    gtag('event', 'blog_cta_click', {
      article_title: articleTitle,
      article_path: path,
      article_lang: lang,
      cta_text: btn.textContent.trim(),
      cta_url: btn.href || ''
    });
  });
})();
