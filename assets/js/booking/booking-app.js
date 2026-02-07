// Main Booking Application for Right Track

import { initializeFirebase } from './firebase-config.js';
// Fallback data if Firebase fails
import { SERVICES as FALLBACK_SERVICES, THERAPISTS as FALLBACK_THERAPISTS } from './booking-data.js';
import { BookingCalendar } from './calendar.js';
import { TimeSlots } from './time-slots.js';
import { i18n } from '../i18n.js';

class BookingApp {
    constructor() {
        this.state = {
            mode: null, // 'appointment' or 'callback'
            service: null,
            therapist: null,
            date: null,
            time: null,
            formData: {}
        };

        this.calendar = null;
        this.timeSlots = null;
        this.db = null;

        // Data loaded from Firebase (or fallback)
        this.services = [];
        this.therapists = [];
    }

    // Get current language
    get language() {
        return i18n.language;
    }

    async init() {
        // Initialize i18n
        await i18n.init();

        try {
            const firebase = await initializeFirebase();
            this.db = firebase.db;

            // Load data from Firebase
            await this.loadDataFromFirebase();
        } catch (error) {
            console.error('Firebase init error:', error);
            // Use fallback data
            this.services = FALLBACK_SERVICES;
            this.therapists = FALLBACK_THERAPISTS;
        }

        // Check for pre-selected service and therapist from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const preselectedService = urlParams.get('service');
        const preselectedTherapist = urlParams.get('therapist');

        if (preselectedService && this.getServiceById(preselectedService)) {
            this.state.service = preselectedService;
            this.state.mode = 'appointment';

            // Also preselect therapist if provided and valid for this service
            if (preselectedTherapist && this.getTherapistById(preselectedTherapist)) {
                const therapistsForService = this.getTherapistsForService(preselectedService);
                if (therapistsForService.some(t => t.id === preselectedTherapist)) {
                    this.state.therapist = preselectedTherapist;
                }
            }

            this.renderBookingForm();
        } else {
            this.renderModeSelection();
        }

        this.setupLanguageListener();
    }

    async loadDataFromFirebase() {
        try {
            const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

            // Load services (sorted by display order)
            const servicesSnapshot = await getDocs(query(collection(this.db, 'services'), orderBy('order')));
            this.services = servicesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load therapists (only active ones)
            const therapistsSnapshot = await getDocs(query(collection(this.db, 'therapists'), orderBy('name')));
            this.therapists = therapistsSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(t => t.isActive !== false);

            console.log(`Loaded ${this.services.length} services and ${this.therapists.length} therapists from Firebase`);

            // Fallback if empty
            if (this.services.length === 0) {
                this.services = FALLBACK_SERVICES;
                console.log('Using fallback services');
            }
            if (this.therapists.length === 0) {
                this.therapists = FALLBACK_THERAPISTS;
                console.log('Using fallback therapists');
            }
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            this.services = FALLBACK_SERVICES;
            this.therapists = FALLBACK_THERAPISTS;
        }
    }

    // Helper methods to get data
    getServiceById(id) {
        return this.services.find(s => s.id === id);
    }

    getTherapistById(id) {
        return this.therapists.find(t => t.id === id);
    }

    getTherapistsForService(serviceId) {
        return this.therapists.filter(t => t.isActive !== false && (t.services || []).includes(serviceId));
    }

    // Translation helper - uses i18n module
    t(key) {
        return i18n.t(`booking.${key}`);
    }

    // Get localized field from data object (e.g., service.name or service.nameEl)
    getLocalizedField(obj, fieldName) {
        return i18n.getField(obj, fieldName);
    }

    setupLanguageListener() {
        // Listen for language changes from main site
        window.addEventListener('languageChanged', (e) => {
            this.refresh();
        });

        // Also listen for i18n module changes
        i18n.onLanguageChange(() => {
            this.refresh();
        });
    }

    refresh() {
        if (this.state.mode === null) {
            this.renderModeSelection();
        } else {
            this.renderBookingForm();
        }
    }

    renderModeSelection() {
        const container = document.getElementById('booking-app');
        container.innerHTML = `
            <div class="booking-container">
                <div class="booking-header">
                    <h2>${this.t('title')}</h2>
                    <p>${this.t('subtitle')}</p>
                </div>

                <div class="services-grid">
                    ${this.services.map(s => `
                        <button class="service-card" data-service="${s.id}">
                            <div class="service-icon">
                                ${this.getServiceIcon(s.id)}
                            </div>
                            <div class="service-info">
                                <strong>${this.getLocalizedField(s, 'name')}</strong>
                                <div class="service-price">${this.renderPriceDisplay(s.pricing)}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>

            </div>
        `;

        // Service card clicks
        container.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceId = e.currentTarget.dataset.service;
                this.state.service = serviceId;
                this.state.mode = 'appointment';
                this.renderBookingForm();
            });
        });

    }

    getServiceIcon(serviceId) {
        const icons = {
            'athlete-rehab': '💪',
            'clinical-pilates': '🧘',
            'kids-physio': '👶',
            'performance-training': '🏋️',
            'homecare-physio': '❤️',
            'massage': '✨'
        };
        return `<span style="font-size: 28px; filter: grayscale(1) brightness(10);">${icons[serviceId] || '⭐'}</span>`;
    }

    // Render price in two-line format: GESY on top, Private below (or Private Only / From €XX)
    renderPriceDisplay(pricing) {
        if (!pricing) return '';

        const isGreek = this.language === 'el';

        // Custom pricing type
        if (pricing.type === 'custom') {
            return `<span class="price-line">${isGreek ? (pricing.customTextEl || pricing.customText) : pricing.customText}</span>`;
        }

        const lines = [];

        if (pricing.gesyPrice) {
            // Has GESY
            lines.push(isGreek ? 'ΓΕΣΥ' : 'GESY');
            if (pricing.privatePrice) {
                lines.push(isGreek ? `Ιδιωτικά - από €${pricing.privatePrice}` : `Private - from €${pricing.privatePrice}`);
            }
        } else if (pricing.privatePrice) {
            // Private only
            lines.push(isGreek ? 'Μόνο Ιδιωτικά' : 'Private Only');
            lines.push(isGreek ? `Από €${pricing.privatePrice}` : `From €${pricing.privatePrice}`);
        }

        return lines.map(line => `<span class="price-line">${line}</span>`).join('');
    }

    renderBookingForm() {
        const container = document.getElementById('booking-app');
        const isAppointment = this.state.mode === 'appointment';

        container.innerHTML = `
            <div class="booking-container">
                <button class="back-btn" id="back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    ${this.t('back')}
                </button>

                <div class="booking-header">
                    <h2>${this.t('title')}</h2>
                    <p>${this.t('subtitleTherapist')}</p>
                </div>

                <div class="booking-form-grid ${isAppointment ? 'with-calendar' : ''}">
                    <div class="booking-selections">
                        <!-- Selected Service Display -->
                        <div class="selected-service-card">
                            <div class="service-icon">
                                ${this.getServiceIcon(this.state.service)}
                            </div>
                            <div class="service-info">
                                <strong>${this.getLocalizedField(this.getServiceById(this.state.service), 'name')}</strong>
                                <div class="service-price">${this.renderPriceDisplay(this.getServiceById(this.state.service)?.pricing)}</div>
                            </div>
                        </div>

                        <!-- Therapist Selection -->
                        <div class="form-section" id="therapist-section">
                            <label class="form-label">${this.t('selectTherapist')} <span class="required">*</span></label>
                            <div id="therapist-options" class="therapist-options">
                                ${this.renderTherapistOptions()}
                            </div>
                        </div>

                        ${isAppointment ? `
                        <!-- Calendar -->
                        <div class="form-section" id="calendar-section" style="display: ${this.state.therapist ? 'block' : 'none'}">
                            <label class="form-label">${this.t('selectDate')} <span class="required">*</span></label>
                            <div id="booking-calendar" class="booking-calendar"></div>
                        </div>

                        <!-- Time Slots -->
                        <div class="form-section" id="time-section" style="display: ${this.state.date ? 'block' : 'none'}">
                            <div id="time-slots"></div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Contact Form -->
                    <div class="booking-form-section" id="contact-form-section" style="display: ${this.canShowForm() ? 'block' : 'none'}">
                        <h3 class="form-section-title">${this.t('yourDetails')}</h3>
                        <form id="booking-form" class="booking-form">
                            <div class="form-group">
                                <label class="form-label">${this.t('name')} <span class="required">*</span></label>
                                <input type="text" id="client-name" class="form-input" placeholder="${this.t('namePlaceholder')}" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('phone')} <span class="required">*</span></label>
                                <input type="tel" id="client-phone" class="form-input" placeholder="${this.t('phonePlaceholder')}" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('email')}</label>
                                <input type="email" id="client-email" class="form-input" placeholder="${this.t('emailPlaceholder')}">
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('paymentType')}</label>
                                <div class="radio-group">
                                    <label class="radio-option">
                                        <input type="radio" name="payment-type" value="gesy">
                                        <span>${this.t('gesy')}</span>
                                    </label>
                                    <label class="radio-option">
                                        <input type="radio" name="payment-type" value="private">
                                        <span>${this.t('private')}</span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('message')}</label>
                                <textarea id="client-message" class="form-textarea" placeholder="${this.t('messagePlaceholder')}" rows="3"></textarea>
                            </div>

                            <div class="form-group consent-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="consent-privacy" required>
                                    <span>${this.t('consentPrivacy')} <a href="/pages/privacy${this.language === 'el' ? '-el' : ''}.html" target="_blank">${this.t('privacyPolicy')}</a></span>
                                </label>
                            </div>

                            <div class="form-group consent-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="consent-terms" required>
                                    <span>${this.t('consentTerms')} <a href="/pages/terms${this.language === 'el' ? '-el' : ''}.html" target="_blank">${this.t('termsConditions')}</a></span>
                                </label>
                            </div>

                            <button type="submit" class="submit-btn" id="submit-btn">
                                ${this.t('submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.attachFormEventListeners();

        if (isAppointment && this.state.therapist) {
            this.initCalendar();
        }
    }

    renderTherapistOptions() {
        if (!this.state.service) return '';

        const therapists = this.getTherapistsForService(this.state.service);

        return therapists.map(t => `
            <label class="therapist-option ${this.state.therapist === t.id ? 'selected' : ''}">
                <input type="radio" name="therapist" value="${t.id}" ${this.state.therapist === t.id ? 'checked' : ''}>
                <div class="therapist-info">
                    <img src="${t.photo || ''}" alt="${t.name}" class="therapist-photo" onerror="this.style.display='none'">
                    <div class="therapist-details">
                        <strong>${this.getLocalizedField(t, 'name')}</strong>
                        <span>${this.getLocalizedField(t, 'title')}</span>
                    </div>
                </div>
            </label>
        `).join('');
    }

    canShowForm() {
        if (this.state.mode === 'callback') {
            return this.state.service && this.state.therapist;
        }
        return this.state.service && this.state.therapist && this.state.date && this.state.time;
    }

    attachFormEventListeners() {
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.state = { mode: null, service: null, therapist: null, date: null, time: null, formData: {} };
            this.renderModeSelection();
        });

        this.attachTherapistListeners();

        // Form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
    }

    attachTherapistListeners() {
        document.querySelectorAll('input[name="therapist"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.state.therapist = e.target.value;
                this.state.date = null;
                this.state.time = null;

                // Update visual selection
                document.querySelectorAll('.therapist-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.closest('.therapist-option').classList.add('selected');

                if (this.state.mode === 'appointment') {
                    document.getElementById('calendar-section').style.display = 'block';
                    document.getElementById('time-section').style.display = 'none';
                    this.initCalendar();
                }

                document.getElementById('contact-form-section').style.display = this.canShowForm() ? 'block' : 'none';
            });
        });
    }

    initCalendar() {
        this.calendar = new BookingCalendar('booking-calendar', {
            language: this.language,
            onDateSelect: (date) => {
                this.state.date = date;
                document.getElementById('time-section').style.display = 'block';
                this.initTimeSlots(date);
            }
        });
        this.calendar.render();
    }

    initTimeSlots(date) {
        this.timeSlots = new TimeSlots('time-slots', {
            language: this.language,
            onSlotSelect: (time) => {
                this.state.time = time;
                document.getElementById('contact-form-section').style.display = 'block';
                // Scroll to form
                document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
        this.timeSlots.render(date);
    }

    async submitBooking() {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = this.t('submitting');

        const bookingData = {
            clientName: document.getElementById('client-name').value,
            phone: document.getElementById('client-phone').value,
            email: document.getElementById('client-email').value || null,
            message: document.getElementById('client-message').value || null,
            service: this.state.service,
            therapistId: this.state.therapist,
            paymentType: document.querySelector('input[name="payment-type"]:checked')?.value || null,
            bookingType: this.state.mode,
            date: this.state.date || null,
            timeSlot: this.state.time || null,
            source: 'website', // Mark as website booking
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            // Save to Firestore
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
            const docRef = await addDoc(collection(this.db, 'bookings'), bookingData);

            console.log('Booking saved with ID:', docRef.id);

            // Send notifications
            await Promise.all([
                this.sendTelegramNotification(bookingData),
                this.sendEmailNotification(bookingData)
            ]);

            this.renderSuccess(docRef.id);

        } catch (error) {
            console.error('Booking error:', error);
            alert(this.t('errorGeneric'));
            submitBtn.disabled = false;
            submitBtn.textContent = this.t('submit');
        }
    }

    renderSuccess(bookingId) {
        const container = document.getElementById('booking-app');
        const isCallback = this.state.mode === 'callback';

        container.innerHTML = `
            <div class="booking-container booking-success">
                <div class="success-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                </div>
                <h2>${this.t('successTitle')}</h2>
                <p>${isCallback ? this.t('successCallback') : this.t('successMessage')}</p>

                <div class="booking-summary">
                    <p><strong>Service:</strong> ${this.getServiceById(this.state.service)?.name}</p>
                    ${this.state.date ? `<p><strong>Date:</strong> ${this.state.date}</p>` : ''}
                    ${this.state.time ? `<p><strong>Time:</strong> ${this.state.time}</p>` : ''}
                </div>

                <button class="btn-primary" id="new-booking-btn">
                    ${this.t('newBooking')}
                </button>
            </div>
        `;

        document.getElementById('new-booking-btn').addEventListener('click', () => {
            this.state = { mode: null, service: null, therapist: null, date: null, time: null, formData: {} };
            this.renderModeSelection();
        });
    }

    async sendEmailNotification(booking) {
        const EMAILJS_SERVICE_ID = 'service_apg3zoa';
        const EMAILJS_TEMPLATE_ID = 'template_35sacxf';
        const EMAILJS_PUBLIC_KEY = '1cMf-T1krhUJoreWv';

        const service = this.getServiceById(booking.service);
        const therapist = this.getTherapistById(booking.therapistId);

        const isCallback = booking.bookingType === 'callback';

        const templateParams = {
            booking_type: isCallback ? 'Callback Request' : 'Appointment',
            client_name: booking.clientName,
            client_phone: booking.phone,
            client_email: booking.email || 'Not provided',
            service_name: service?.name || booking.service,
            therapist_name: therapist?.name || booking.therapistId,
            payment_type: booking.paymentType ? booking.paymentType.toUpperCase() : 'Not specified',
            booking_date: booking.date || 'N/A (Callback)',
            booking_time: booking.timeSlot || 'N/A (Callback)',
            message: booking.message || 'No message'
        };

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: EMAILJS_SERVICE_ID,
                    template_id: EMAILJS_TEMPLATE_ID,
                    user_id: EMAILJS_PUBLIC_KEY,
                    template_params: templateParams
                })
            });
            console.log('Email notification sent');
        } catch (error) {
            console.error('Email notification error:', error);
            // Don't fail the booking if email fails
        }
    }

    async sendTelegramNotification(booking) {
        const WORKER_URL = 'https://righttrack-telegram.righttrackphysio.workers.dev';

        const service = this.getServiceById(booking.service);
        const therapist = this.getTherapistById(booking.therapistId);

        const isCallback = booking.bookingType === 'callback';
        const bookingTypeEmoji = isCallback ? '📞' : '📅';
        const bookingTypeText = isCallback ? 'CALLBACK REQUEST' : 'APPOINTMENT';

        const message = `
🆕 NEW BOOKING (Website)

${bookingTypeEmoji} Type: ${bookingTypeText}

👤 Name: ${booking.clientName}
📱 Phone: ${booking.phone}
${booking.email ? `📧 Email: ${booking.email}` : ''}

🏥 Service: ${service?.name || booking.service}
👨‍⚕️ Therapist: ${therapist?.name || booking.therapistId}
${booking.paymentType ? `💳 Payment: ${booking.paymentType.toUpperCase()}` : ''}

${!isCallback ? `📅 Date: ${booking.date}
🕐 Time: ${booking.timeSlot}` : ''}

${booking.message ? `💬 Message: ${booking.message}` : ''}
        `.trim();

        try {
            await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            console.log('Telegram notification sent');
        } catch (error) {
            console.error('Telegram notification error:', error);
            // Don't fail the booking if notification fails
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BookingApp();
    app.init();
});

export { BookingApp };
