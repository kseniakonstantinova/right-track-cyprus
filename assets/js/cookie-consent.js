(function() {
    'use strict';

    var GA_ID = 'G-XQT03Q3821';
    var STORAGE_KEY = 'cookie_consent';

    var lang = document.documentElement.lang === 'el' ? 'el' : 'en';

    var text = {
        en: {
            message: 'We use cookies for analytics to improve our website. No personal data is sold or shared with third parties.',
            policy: 'Cookie Policy',
            accept: 'Accept',
            reject: 'Reject'
        },
        el: {
            message: 'Χρησιμοποιούμε cookies για αναλυτικά στοιχεία για τη βελτίωση του ιστότοπού μας. Δεν πωλούνται ή μοιράζονται προσωπικά δεδομένα.',
            policy: 'Πολιτική Cookies',
            accept: 'Αποδοχή',
            reject: 'Απόρριψη'
        }
    };

    var t = text[lang];

    // Determine path to cookies page based on current URL
    var path = window.location.pathname;
    var policyHref;
    if (path.indexOf('/pages/blog/') !== -1) {
        policyHref = '../cookies' + (lang === 'el' ? '-el' : '') + '.html';
    } else if (path.indexOf('/pages/services/') !== -1) {
        policyHref = '../cookies' + (lang === 'el' ? '-el' : '') + '.html';
    } else if (path.indexOf('/pages/manage-rtphysio') !== -1) {
        policyHref = '../cookies' + (lang === 'el' ? '-el' : '') + '.html';
    } else if (path.indexOf('/pages/') !== -1) {
        policyHref = 'cookies' + (lang === 'el' ? '-el' : '') + '.html';
    } else {
        policyHref = 'pages/cookies' + (lang === 'el' ? '-el' : '') + '.html';
    }

    function getConsent() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch(e) {}
        return null;
    }

    function setConsent(accepted) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                accepted: accepted,
                timestamp: new Date().toISOString()
            }));
        } catch(e) {}
    }

    function loadGA() {
        if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) return;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function disableGA() {
        window['ga-disable-' + GA_ID] = true;
    }

    function showBanner() {
        var banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML =
            '<div class="cookie-consent-inner">' +
                '<div class="cookie-consent-text">' +
                    t.message + ' <a href="' + policyHref + '">' + t.policy + '</a>' +
                '</div>' +
                '<div class="cookie-consent-buttons">' +
                    '<button class="cookie-btn cookie-btn-reject" id="cookie-reject">' + t.reject + '</button>' +
                    '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">' + t.accept + '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                banner.classList.add('visible');
            });
        });

        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent(true);
            loadGA();
            banner.classList.remove('visible');
            setTimeout(function() { banner.remove(); }, 400);
        });

        document.getElementById('cookie-reject').addEventListener('click', function() {
            setConsent(false);
            disableGA();
            banner.classList.remove('visible');
            setTimeout(function() { banner.remove(); }, 400);
        });
    }

    // Remove any existing GA scripts that loaded before consent
    function removeExistingGA() {
        var scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag"]');
        for (var i = 0; i < scripts.length; i++) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }

    // Main logic
    var consent = getConsent();

    if (consent === null) {
        // No consent yet — remove pre-loaded GA and show banner
        disableGA();
        removeExistingGA();
        showBanner();
    } else if (consent.accepted) {
        // Previously accepted — GA loads normally (already in page or load it)
        loadGA();
    } else {
        // Previously rejected — block GA
        disableGA();
        removeExistingGA();
    }
})();
