(() => {
  function flashClass(el, className, ms = 1200) {
    el.classList.add(className);
    window.setTimeout(() => el.classList.remove(className), ms);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }

  function getShareUrl(linkEl) {
    const href = linkEl.getAttribute('href') || '';
    // Prefer canonical origin/path to avoid sharing localhost URLs during dev.
    const canonicalHref = document.querySelector('link[rel="canonical"]')?.href;
    const base = canonicalHref || window.location.href;
    return new URL(href, base).href;
  }

  function normalizeSavedKey(href) {
    // Keep saved state in sync between EN/EL article variants.
    return String(href || '').replace(/-el\.html(\?.*)?$/i, '.html$1');
  }

  // Make the entire card clickable (except actions)
  document.querySelectorAll('.blog-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.blog-card-share, .blog-card-like')) return;
      if (e.target.closest('a')) return;
      const link = card.querySelector('.blog-card-link');
      if (link) window.location.href = link.href;
    });
  });

  // Share (Web Share API) with copy-link fallback
  document.querySelectorAll('.blog-card-share').forEach((btn) => {
    const labelShare = btn.dataset.labelShare || 'Share';
    const labelCopy = btn.dataset.labelCopy || 'Copy link';

    if (!navigator.share) {
      btn.setAttribute('aria-label', labelCopy);
      btn.setAttribute('title', labelCopy);
    } else {
      btn.setAttribute('aria-label', labelShare);
      btn.setAttribute('title', labelShare);
    }

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.blog-card');
      const link = card ? card.querySelector('.blog-card-link') : null;
      if (!link) return;

      const url = getShareUrl(link);
      const title = (
        (card && card.querySelector('h3') ? card.querySelector('h3').textContent : document.title) || ''
      ).trim();
      const textEl = card ? card.querySelector('p') : null;
      const text = (textEl ? textEl.textContent : '').trim();

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }

      try {
        await copyText(url);
        flashClass(btn, 'is-copied');
      } catch (err) {
        // Ignore copy failures (e.g., browser restrictions)
      }
    });
  });

  // Like/Save (localStorage)
  const savedStorageKey = 'rt_blog_saved';
  let savedMap = {};
  try {
    savedMap = JSON.parse(window.localStorage.getItem(savedStorageKey) || '{}') || {};
  } catch (err) {
    savedMap = {};
  }

  function persistSaved() {
    try {
      window.localStorage.setItem(savedStorageKey, JSON.stringify(savedMap));
    } catch (err) {
      // Ignore storage failures (private mode / quota / disabled)
    }
  }

  document.querySelectorAll('.blog-card').forEach((card) => {
    const likeBtn = card.querySelector('.blog-card-like');
    const link = card.querySelector('.blog-card-link');
    if (!likeBtn || !link) return;

    const hrefRaw = link.getAttribute('href');
    if (!hrefRaw) return;
    const hrefKey = normalizeSavedKey(hrefRaw);

    const labelOn = likeBtn.dataset.labelOn || 'Saved';
    const labelOff = likeBtn.dataset.labelOff || 'Save';
    const feedbackOn = likeBtn.dataset.feedbackOn || 'Saved';
    const feedbackOff = likeBtn.dataset.feedbackOff || 'Removed';

    const isSaved = !!savedMap[hrefKey];
    likeBtn.classList.toggle('is-on', isSaved);
    likeBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    likeBtn.setAttribute('aria-label', isSaved ? labelOn : labelOff);
    likeBtn.setAttribute('title', isSaved ? labelOn : labelOff);

    likeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const next = likeBtn.getAttribute('aria-pressed') !== 'true';
      likeBtn.classList.toggle('is-on', next);
      likeBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
      likeBtn.setAttribute('aria-label', next ? labelOn : labelOff);
      likeBtn.setAttribute('title', next ? labelOn : labelOff);

      if (next) savedMap[hrefKey] = 1;
      else delete savedMap[hrefKey];
      persistSaved();

      likeBtn.dataset.feedback = next ? feedbackOn : feedbackOff;
      flashClass(likeBtn, 'is-saved');
    });
  });
})();
