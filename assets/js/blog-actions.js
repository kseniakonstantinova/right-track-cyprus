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

  // Share dropdown menu
  function closeAllShareMenus(except) {
    document.querySelectorAll('.share-menu.is-open').forEach((m) => {
      if (m !== except) m.classList.remove('is-open');
    });
  }

  document.addEventListener('click', () => closeAllShareMenus());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllShareMenus();
  });

  document.querySelectorAll('.blog-card-share').forEach((btn) => {
    const labelShare = btn.dataset.labelShare || 'Share';
    const labelCopy = btn.dataset.labelCopy || 'Copy link';
    const labelWhatsapp = btn.dataset.labelWhatsapp || 'WhatsApp';
    const labelTelegram = btn.dataset.labelTelegram || 'Telegram';
    const labelEmail = btn.dataset.labelEmail || 'Email';
    const labelTwitter = btn.dataset.labelTwitter || 'X (Twitter)';

    btn.setAttribute('aria-label', labelShare);
    btn.setAttribute('title', labelShare);

    // Build dropdown menu
    const menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.setAttribute('role', 'menu');

    function createMenuItem(label, svgHTML) {
      const b = document.createElement('button');
      b.className = 'share-menu-item';
      b.setAttribute('role', 'menuitem');
      b.type = 'button';
      b.innerHTML = svgHTML + '<span>' + label + '</span>';
      menu.appendChild(b);
      return b;
    }

    function getCardData() {
      const card = btn.closest('.blog-card');
      const link = card ? card.querySelector('.blog-card-link') : null;
      if (!link) return null;
      const url = getShareUrl(link);
      const title = ((card.querySelector('h3')?.textContent) || '').trim();
      return { url, title };
    }

    function handleClick(ev, handler) {
      ev.preventDefault();
      ev.stopPropagation();
      menu.classList.remove('is-open');
      const data = getCardData();
      if (data) handler(data);
    }

    // WhatsApp
    const waBtn = createMenuItem(labelWhatsapp,
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>');
    waBtn.addEventListener('click', (ev) => handleClick(ev, ({ url, title }) => {
      const msg = title ? title + ' — ' + url : url;
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    }));

    // Telegram
    const tgBtn = createMenuItem(labelTelegram,
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>');
    tgBtn.addEventListener('click', (ev) => handleClick(ev, ({ url, title }) => {
      window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), '_blank', 'noopener');
    }));

    // X (Twitter)
    const xBtn = createMenuItem(labelTwitter,
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>');
    xBtn.addEventListener('click', (ev) => handleClick(ev, ({ url, title }) => {
      const text = title ? title + ' ' + url : url;
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }));

    // Email
    const emailBtn = createMenuItem(labelEmail,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>');
    emailBtn.addEventListener('click', (ev) => handleClick(ev, ({ url, title }) => {
      window.location.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(url);
    }));

    // Copy link
    const copyBtn = createMenuItem(labelCopy,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>');
    copyBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      menu.classList.remove('is-open');
      const data = getCardData();
      if (!data) return;
      try {
        await copyText(data.url);
        flashClass(btn, 'is-copied');
      } catch (_) {}
    });

    btn.parentElement.style.position = 'relative';
    btn.parentElement.appendChild(menu);

    // Toggle menu on share button click
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      closeAllShareMenus();
      if (!isOpen) menu.classList.add('is-open');
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
