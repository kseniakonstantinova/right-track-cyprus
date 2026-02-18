/**
 * Floating WhatsApp + Phone CTA buttons
 * Right Track Physiotherapy & Performance Centre
 * Auto-detects page language (EN/EL) for labels and WhatsApp message
 * Includes GA4 event tracking for all social/contact clicks
 */
(function () {
    'use strict';

    var PHONE = '+35799126824';
    var WHATSAPP = '35799126824';
    var isGreek = document.documentElement.lang === 'el';

    var waMessage = isGreek
        ? 'Γεια σας! Θα ήθελα να κλείσω ραντεβού στο Right Track Physiotherapy.'
        : 'Hello! I\'d like to book an appointment at Right Track Physiotherapy.';

    // --- Styles ---
    var css = document.createElement('style');
    css.textContent =
        '.floating-cta{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:flex-end}' +
        '.floating-cta a{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,.25);transition:transform .3s,box-shadow .3s}' +
        '.floating-cta a:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(0,0,0,.3)}' +
        '.floating-cta .cta-whatsapp{background:#25D366}' +
        '.floating-cta .cta-phone{background:#FF6B35}' +
        '.floating-cta svg{width:28px;height:28px;fill:#fff}' +
        '.floating-cta .cta-label{position:absolute;right:66px;background:#222;color:#fff;padding:6px 12px;border-radius:6px;font-size:13px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .3s;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif}' +
        '.floating-cta a:hover .cta-label{opacity:1}' +
        '@media(max-width:768px){.floating-cta{bottom:16px;right:16px;gap:10px}.floating-cta a{width:52px;height:52px}.floating-cta .cta-label{display:none}}';
    document.head.appendChild(css);

    // --- HTML ---
    var phoneLabel = isGreek ? 'Καλέστε μας' : 'Call us';
    var waLabel = 'WhatsApp';

    var wrap = document.createElement('div');
    wrap.className = 'floating-cta';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', isGreek ? 'Γρήγορη επικοινωνία' : 'Quick contact');

    // Phone button
    var phoneBtn = document.createElement('a');
    phoneBtn.href = 'tel:' + PHONE;
    phoneBtn.className = 'cta-phone';
    phoneBtn.setAttribute('aria-label', phoneLabel);
    phoneBtn.innerHTML =
        '<span class="cta-label">' + phoneLabel + '</span>' +
        '<svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>';

    // WhatsApp button
    var waBtn = document.createElement('a');
    waBtn.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(waMessage);
    waBtn.target = '_blank';
    waBtn.rel = 'noopener nofollow';
    waBtn.className = 'cta-whatsapp';
    waBtn.setAttribute('aria-label', waLabel);
    waBtn.innerHTML =
        '<span class="cta-label">' + waLabel + '</span>' +
        '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

    wrap.appendChild(phoneBtn);
    wrap.appendChild(waBtn);
    document.body.appendChild(wrap);

    // --- GA4 event tracking ---
    function trackClick(category, label) {
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                event_category: category,
                event_label: label
            });
        }
    }

    phoneBtn.addEventListener('click', function () {
        trackClick('contact', 'floating_phone');
    });
    waBtn.addEventListener('click', function () {
        trackClick('contact', 'floating_whatsapp');
    });

    // Track existing footer social links
    var footerLinks = document.querySelectorAll('.footer-social a');
    footerLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var platform = 'social';
        if (href.indexOf('instagram') !== -1) platform = 'instagram';
        else if (href.indexOf('facebook') !== -1) platform = 'facebook';
        else if (href.indexOf('linkedin') !== -1) platform = 'linkedin';
        else if (href.indexOf('tiktok') !== -1) platform = 'tiktok';

        link.addEventListener('click', function () {
            trackClick('social', 'footer_' + platform);
        });
    });

    // Track any tel: and mailto: links on the page
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        if (link === phoneBtn) return;
        link.addEventListener('click', function () {
            trackClick('contact', 'inline_phone');
        });
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            trackClick('contact', 'inline_email');
        });
    });
})();
