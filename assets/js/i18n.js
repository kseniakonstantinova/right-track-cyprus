// Internationalization (i18n) Module for Right Track
// Handles language switching and translations

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.listeners = [];
        this.loaded = false;
    }

    async init() {
        await this.loadTranslations(this.currentLanguage);
        this.setupLanguageListener();
        this.loaded = true;
        return this;
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/assets/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            // Fallback to English if loading fails
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    setupLanguageListener() {
        window.addEventListener('languageChanged', async (e) => {
            const newLang = e.detail.language;
            if (newLang !== this.currentLanguage) {
                await this.setLanguage(newLang);
            }
        });
    }

    async setLanguage(lang) {
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Notify all listeners
        this.listeners.forEach(callback => callback(lang));

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('i18nLanguageChanged', {
            detail: { language: lang }
        }));
    }

    // Get translation by dot-notation key (e.g., "booking.title")
    t(key, fallback = null) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Try English as fallback
                value = this.translations['en'];
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    } else {
                        return fallback || key;
                    }
                }
                break;
            }
        }

        return value || fallback || key;
    }

    // Get localized field from data object
    // Usage: i18n.getField(service, 'name') returns service.nameEl or service.name
    getField(obj, fieldName) {
        if (!obj) return '';

        if (this.currentLanguage === 'el') {
            // Try Greek field first (e.g., nameEl)
            const elField = `${fieldName}El`;
            if (obj[elField]) return obj[elField];

            // Try nested object (e.g., name.el)
            if (obj[fieldName] && typeof obj[fieldName] === 'object' && obj[fieldName].el) {
                return obj[fieldName].el;
            }
        }

        // Try English field
        const enField = `${fieldName}En`;
        if (obj[enField]) return obj[enField];

        // Try nested object (e.g., name.en)
        if (obj[fieldName] && typeof obj[fieldName] === 'object' && obj[fieldName].en) {
            return obj[fieldName].en;
        }

        // Fallback to base field
        return obj[fieldName] || '';
    }

    // Subscribe to language changes
    onLanguageChange(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    get language() {
        return this.currentLanguage;
    }

    get isGreek() {
        return this.currentLanguage === 'el';
    }

    get isEnglish() {
        return this.currentLanguage === 'en';
    }
}

// Singleton instance
const i18n = new I18n();

export { i18n, I18n };
