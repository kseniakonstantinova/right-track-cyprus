// Admin Panel Application
// Data is stored in Firebase and synced with local arrays

// Initial data for sync (from booking-data.js)
const INITIAL_SERVICES = [
    {
        id: 'athlete-rehab',
        name: 'Athlete-Centred Rehabilitation',
        nameEl: 'Αποκατάσταση Αθλητών',
        description: 'MSK & Sports Rehab, Post-operative Recovery',
        pricing: {
            type: 'fixed',
            gesyPrice: 29,
            privatePrice: 35,
            display: '€29 GESY | From €35 Private',
            displayEl: '€29 ΓΕΣΥ | Από €35 Ιδιωτικά'
        }
    },
    {
        id: 'clinical-pilates',
        name: 'Clinical Pilates',
        nameEl: 'Κλινικό Pilates',
        description: 'Small groups (max 4), Dynamic athletic approach',
        pricing: {
            type: 'from',
            gesyPrice: null,
            privatePrice: 80,
            display: 'From €80/month (Private Only)',
            displayEl: 'Από €80/μήνα (Μόνο Ιδιωτικά)'
        }
    },
    {
        id: 'kids-physio',
        name: "Kids' Physiotherapy",
        nameEl: 'Παιδική Φυσιοθεραπεία',
        description: 'Scoliosis screening, Developmental support',
        pricing: {
            type: 'custom',
            gesyPrice: null,
            privatePrice: null,
            customText: 'Customized Packages',
            customTextEl: 'Εξατομικευμένα Πακέτα',
            display: 'Customized Packages',
            displayEl: 'Εξατομικευμένα Πακέτα'
        }
    },
    {
        id: 'performance-training',
        name: 'Performance Training',
        nameEl: 'Προπόνηση Απόδοσης',
        description: 'Sport-specific programming, Return-to-play protocols',
        pricing: {
            type: 'from',
            gesyPrice: null,
            privatePrice: 250,
            display: 'From €250/month',
            displayEl: 'Από €250/μήνα'
        }
    },
    {
        id: 'homecare-physio',
        name: 'Home-care Physiotherapy',
        nameEl: 'Φυσιοθεραπεία κατ\' Οίκον',
        description: 'Professional physiotherapy in your home',
        pricing: {
            type: 'fixed',
            gesyPrice: 29,
            privatePrice: 45,
            display: '€29 GESY (+€15 travel) | From €45 Private',
            displayEl: '€29 ΓΕΣΥ (+€15 μετακίνηση) | Από €45 Ιδιωτικά'
        }
    },
    {
        id: 'massage',
        name: 'Sports & Remedial Massage',
        nameEl: 'Αθλητικό & Θεραπευτικό Μασάζ',
        description: 'Sports massage, Deep tissue, Recovery sessions',
        pricing: {
            type: 'from',
            gesyPrice: null,
            privatePrice: 45,
            display: 'From €45 Private',
            displayEl: 'Από €45 Ιδιωτικά'
        }
    }
];

const INITIAL_THERAPISTS = [
    {
        id: 'antonis',
        name: 'Antonis Petri',
        nameEl: 'Αντώνης Πέτρη',
        title: 'Co-Founder & Lead Clinician',
        titleEl: 'Συνιδρυτής & Επικεφαλής Κλινικός',
        gesyCode: 'A2825',
        email: 'righttrackphysio@gmail.com',
        calendarEmail: 'righttrackphysio@gmail.com',
        photo: '/assets/images/team/tony-photo.jpg',
        services: ['athlete-rehab', 'kids-physio', 'performance-training', 'homecare-physio', 'massage'],
        isActive: true
    },
    {
        id: 'charalambos',
        name: 'Charalambos Gregoriou',
        nameEl: 'Χαράλαμπος Γρηγορίου',
        title: 'Co-Founder & Clinical Director',
        titleEl: 'Συνιδρυτής & Κλινικός Διευθυντής',
        gesyCode: 'A0000',
        email: 'righttrackphysio@gmail.com',
        calendarEmail: 'righttrackphysio@gmail.com',
        photo: '/assets/images/team/charalambos-photo.jpg',
        services: ['athlete-rehab', 'kids-physio', 'performance-training', 'massage'],
        isActive: true
    },
    {
        id: 'alice',
        name: 'Alice Kazanjian',
        nameEl: 'Alice Kazanjian',
        title: 'Clinical Pilates Instructor',
        titleEl: 'Εκπαιδεύτρια Κλινικού Pilates',
        gesyCode: 'A3509',
        email: 'righttrackphysio@gmail.com',
        calendarEmail: 'righttrackphysio@gmail.com',
        photo: '/assets/images/team/alice-photo.jpg',
        services: ['clinical-pilates'],
        isActive: true
    }
];

class AdminApp {
    constructor() {
        this.db = null;
        this.auth = null;
        this.user = null;
        this.bookings = [];
        this.therapists = [];
        this.services = [];
        this.unsubscribe = null;
    }

    async init() {
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyACv0o8NPh52XBoEuAyNuuE8IzjVb2zNvE",
            authDomain: "righttrack-booking-167c6.firebaseapp.com",
            projectId: "righttrack-booking-167c6",
            storageBucket: "righttrack-booking-167c6.appspot.com",
            messagingSenderId: "1098765432",
            appId: "1:1098765432:web:abc123"
        };

        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
        this.auth = firebase.auth();

        // Auth state listener
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.showDashboard();
            } else {
                this.user = null;
                this.showLogin();
            }
        });

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.auth.signOut();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Filters
        ['filter-status', 'filter-therapist', 'filter-date', 'filter-source'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.applyFilters());
        });

        document.getElementById('filter-search').addEventListener('input',
            this.debounce(() => this.applyFilters(), 300)
        );

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadBookings();
        });

        // Booking Modal close
        document.querySelector('#booking-modal .modal-close').addEventListener('click', () => {
            this.closeModal('booking-modal');
        });

        document.getElementById('booking-modal').addEventListener('click', (e) => {
            if (e.target.id === 'booking-modal') {
                this.closeModal('booking-modal');
            }
        });

        // Therapist Modal
        document.getElementById('add-therapist-btn').addEventListener('click', () => {
            this.openTherapistModal();
        });

        document.getElementById('therapist-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTherapist();
        });

        // Service Modal
        document.getElementById('add-service-btn').addEventListener('click', () => {
            this.openServiceModal();
        });

        // Add Booking Modal
        document.getElementById('add-booking-btn').addEventListener('click', () => {
            this.openAddBookingModal();
        });

        document.getElementById('add-booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createManualBooking();
        });

        // Service selection updates therapist options in booking form
        document.getElementById('booking-service').addEventListener('change', (e) => {
            this.updateBookingTherapistOptions(e.target.value);
        });

        document.getElementById('service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });

        // Pricing type change
        document.getElementById('service-pricing-type').addEventListener('change', (e) => {
            this.togglePricingFields(e.target.value);
        });

        // Generic modal close handlers
        document.querySelectorAll('.modal-close[data-modal], .btn-secondary[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                this.closeModal(modalId);
            });
        });

        // Close modals on backdrop click
        ['therapist-modal', 'service-modal', 'add-booking-modal'].forEach(modalId => {
            document.getElementById(modalId).addEventListener('click', (e) => {
                if (e.target.id === modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Sync data button
        document.getElementById('sync-data-btn').addEventListener('click', () => {
            this.syncInitialData();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');
        const errorEl = document.getElementById('login-error');

        btn.classList.add('loading');
        btn.disabled = true;
        errorEl.textContent = '';

        try {
            await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Login error:', error);
            errorEl.textContent = this.getAuthErrorMessage(error.code);
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    getAuthErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many attempts. Try again later.',
            'auth/invalid-credential': 'Invalid email or password'
        };
        return messages[code] || 'Login failed. Please try again.';
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    async showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        document.getElementById('user-email').textContent = this.user.email;

        // Load data from Firebase
        await this.loadServices();
        await this.loadTherapists();
        await this.loadBookings();

        // Show sync button if no data exists
        if (this.services.length === 0 && this.therapists.length === 0) {
            document.getElementById('sync-data-btn').classList.remove('hidden');
        }
    }

    async syncInitialData() {
        const btn = document.getElementById('sync-data-btn');
        if (!confirm('This will import the initial services and therapists data to Firebase. Continue?')) {
            return;
        }

        btn.disabled = true;
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Syncing...
        `;

        try {
            // Sync services
            for (const service of INITIAL_SERVICES) {
                await this.db.collection('services').doc(service.id).set({
                    ...service,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Sync therapists
            for (const therapist of INITIAL_THERAPISTS) {
                await this.db.collection('therapists').doc(therapist.id).set({
                    ...therapist,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            this.showToast('Data synced successfully!');
            btn.classList.add('hidden');

            // Reload data
            await this.loadServices();
            await this.loadTherapists();

        } catch (error) {
            console.error('Sync error:', error);
            this.showToast('Error syncing data: ' + error.message, 'error');
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Sync Initial Data
            `;
        }
    }

    populateTherapistFilter() {
        const select = document.getElementById('filter-therapist');
        select.innerHTML = '<option value="all">All Therapists</option>';

        this.therapists.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.name;
            select.appendChild(option);
        });
    }

    // ============ THERAPISTS CRUD ============

    async loadTherapists() {
        try {
            const snapshot = await this.db.collection('therapists').orderBy('name').get();
            this.therapists = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.populateTherapistFilter();
            this.renderTherapists();
        } catch (error) {
            console.error('Error loading therapists:', error);
            this.showToast('Error loading therapists', 'error');
        }
    }

    openTherapistModal(therapist = null) {
        const modal = document.getElementById('therapist-modal');
        const title = document.getElementById('therapist-modal-title');
        const form = document.getElementById('therapist-form');

        // Populate services checkboxes
        const checkboxContainer = document.getElementById('therapist-services-checkboxes');
        checkboxContainer.innerHTML = this.services.map(s => `
            <label class="checkbox-item">
                <input type="checkbox" name="services" value="${s.id}" ${therapist?.services?.includes(s.id) ? 'checked' : ''}>
                ${s.name}
            </label>
        `).join('');

        if (therapist) {
            title.textContent = 'Edit Therapist';
            document.getElementById('therapist-id').value = therapist.id;
            document.getElementById('therapist-name').value = therapist.name || '';
            document.getElementById('therapist-name-el').value = therapist.nameEl || '';
            document.getElementById('therapist-title').value = therapist.title || '';
            document.getElementById('therapist-title-el').value = therapist.titleEl || '';
            document.getElementById('therapist-email').value = therapist.email || '';
            document.getElementById('therapist-gesy').value = therapist.gesyCode || '';
            document.getElementById('therapist-photo').value = therapist.photo || '';
            document.getElementById('therapist-active').checked = therapist.isActive !== false;
        } else {
            title.textContent = 'Add Therapist';
            form.reset();
            document.getElementById('therapist-id').value = '';
            document.getElementById('therapist-active').checked = true;
        }

        modal.classList.add('active');
    }

    async saveTherapist() {
        const btn = document.getElementById('save-therapist-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const id = document.getElementById('therapist-id').value;
            const servicesChecked = [...document.querySelectorAll('#therapist-services-checkboxes input:checked')]
                .map(cb => cb.value);

            if (servicesChecked.length === 0) {
                this.showToast('Please select at least one service', 'error');
                return;
            }

            const data = {
                name: document.getElementById('therapist-name').value.trim(),
                nameEl: document.getElementById('therapist-name-el').value.trim(),
                title: document.getElementById('therapist-title').value.trim(),
                titleEl: document.getElementById('therapist-title-el').value.trim(),
                email: document.getElementById('therapist-email').value.trim(),
                calendarEmail: document.getElementById('therapist-email').value.trim(), // Same as email by default
                gesyCode: document.getElementById('therapist-gesy').value.trim(),
                photo: document.getElementById('therapist-photo').value.trim(),
                services: servicesChecked,
                isActive: document.getElementById('therapist-active').checked,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (id) {
                // Update existing
                await this.db.collection('therapists').doc(id).update(data);
                this.showToast('Therapist updated');
            } else {
                // Create new
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await this.db.collection('therapists').add(data);
                this.showToast('Therapist created');
            }

            this.closeModal('therapist-modal');
            await this.loadTherapists();

        } catch (error) {
            console.error('Error saving therapist:', error);
            this.showToast('Error saving therapist', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    async deleteTherapist(id) {
        if (!confirm('Are you sure you want to delete this therapist?')) return;

        try {
            await this.db.collection('therapists').doc(id).delete();
            this.showToast('Therapist deleted');
            await this.loadTherapists();
        } catch (error) {
            console.error('Error deleting therapist:', error);
            this.showToast('Error deleting therapist', 'error');
        }
    }

    // ============ SERVICES CRUD ============

    async loadServices() {
        try {
            const snapshot = await this.db.collection('services').orderBy('name').get();
            this.services = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.renderServices();
        } catch (error) {
            console.error('Error loading services:', error);
            this.showToast('Error loading services', 'error');
        }
    }

    openServiceModal(service = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        const form = document.getElementById('service-form');

        // Populate therapist checkboxes
        this.populateServiceTherapists(service?.providedBy || []);

        if (service) {
            title.textContent = 'Edit Service';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name || '';
            document.getElementById('service-name-el').value = service.nameEl || '';
            document.getElementById('service-description').value = service.description || '';
            document.getElementById('service-description-el').value = service.descriptionEl || '';
            document.getElementById('service-pricing-type').value = service.pricing?.type || 'fixed';
            document.getElementById('service-gesy-price').value = service.pricing?.gesyPrice || '';
            document.getElementById('service-private-price').value = service.pricing?.privatePrice || '';
            document.getElementById('service-custom-text').value = service.pricing?.customText || '';
            document.getElementById('service-custom-text-el').value = service.pricing?.customTextEl || '';
            this.togglePricingFields(service.pricing?.type || 'fixed');
        } else {
            title.textContent = 'Add Service';
            form.reset();
            document.getElementById('service-id').value = '';
            this.togglePricingFields('fixed');
            // Reset therapist checkboxes
            this.populateServiceTherapists([]);
        }

        modal.classList.add('active');
    }

    togglePricingFields(type) {
        const priceFields = document.getElementById('price-fields');
        const customFields = document.getElementById('custom-price-fields');

        if (type === 'custom') {
            priceFields.classList.add('hidden');
            customFields.classList.remove('hidden');
        } else {
            priceFields.classList.remove('hidden');
            customFields.classList.add('hidden');
        }
    }

    async saveService() {
        const btn = document.getElementById('save-service-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const id = document.getElementById('service-id').value;
            const pricingType = document.getElementById('service-pricing-type').value;

            const data = {
                name: document.getElementById('service-name').value.trim(),
                nameEl: document.getElementById('service-name-el').value.trim(),
                description: document.getElementById('service-description').value.trim(),
                descriptionEl: document.getElementById('service-description-el').value.trim(),
                pricing: {
                    type: pricingType,
                    gesyPrice: pricingType !== 'custom' ? (parseInt(document.getElementById('service-gesy-price').value) || null) : null,
                    privatePrice: pricingType !== 'custom' ? (parseInt(document.getElementById('service-private-price').value) || null) : null,
                    customText: pricingType === 'custom' ? document.getElementById('service-custom-text').value.trim() : null,
                    customTextEl: pricingType === 'custom' ? document.getElementById('service-custom-text-el').value.trim() : null
                },
                providedBy: this.getSelectedTherapists(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Generate display strings
            data.pricing.display = this.generatePriceDisplay(data.pricing, 'en');
            data.pricing.displayEl = this.generatePriceDisplay(data.pricing, 'el');

            if (id) {
                await this.db.collection('services').doc(id).update(data);
                this.showToast('Service updated');
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await this.db.collection('services').add(data);
                this.showToast('Service created');
            }

            this.closeModal('service-modal');
            await this.loadServices();
            // Refresh therapists to update service tags
            await this.loadTherapists();

        } catch (error) {
            console.error('Error saving service:', error);
            this.showToast('Error saving service', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    populateServiceTherapists(selectedIds = []) {
        const container = document.getElementById('service-therapists');
        if (!container) return;

        if (!this.therapists || this.therapists.length === 0) {
            container.innerHTML = '<p class="text-muted">No therapists available. Add therapists first.</p>';
            return;
        }

        container.innerHTML = this.therapists.map(t => `
            <label class="checkbox-item">
                <input type="checkbox" name="service-therapist" value="${t.id}"
                    ${selectedIds.includes(t.id) ? 'checked' : ''}>
                <span>${this.escapeHtml(t.name)}</span>
            </label>
        `).join('');
    }

    getSelectedTherapists() {
        const checkboxes = document.querySelectorAll('input[name="service-therapist"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    generatePriceDisplay(pricing, lang = 'en') {
        if (pricing.type === 'custom') {
            return lang === 'el' ? (pricing.customTextEl || pricing.customText) : pricing.customText;
        }

        const parts = [];
        const gesy = lang === 'el' ? 'ΓΕΣΥ' : 'GESY';
        const priv = lang === 'el' ? 'Ιδιωτικά' : 'Private';
        const privateOnly = lang === 'el' ? 'Μόνο Ιδιωτικά' : 'Private Only';
        const fromText = lang === 'el' ? 'από' : 'from';
        const FromText = lang === 'el' ? 'Από' : 'From';

        // If has GESY price
        if (pricing.gesyPrice) {
            parts.push(gesy);
        }

        // If has Private price
        if (pricing.privatePrice) {
            if (!pricing.gesyPrice) {
                // No GESY - show "Private Only | From €XX"
                parts.push(privateOnly);
                parts.push(`${FromText} €${pricing.privatePrice}`);
            } else {
                // Has GESY - show "GESY | Private - from €XX"
                parts.push(`${priv} - ${fromText} €${pricing.privatePrice}`);
            }
        }

        return parts.join(' | ') || (lang === 'el' ? 'Επικοινωνήστε μαζί μας' : 'Contact us');
    }

    async deleteService(id) {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await this.db.collection('services').doc(id).delete();
            this.showToast('Service deleted');
            await this.loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            this.showToast('Error deleting service', 'error');
        }
    }

    // ============ MANUAL BOOKING CREATION ============

    openAddBookingModal() {
        const modal = document.getElementById('add-booking-modal');
        const form = document.getElementById('add-booking-form');
        form.reset();

        // Populate services dropdown
        const serviceSelect = document.getElementById('booking-service');
        serviceSelect.innerHTML = '<option value="">Select service...</option>';
        this.services.forEach(s => {
            serviceSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });

        // Clear therapist dropdown (will be populated when service is selected)
        const therapistSelect = document.getElementById('booking-therapist');
        therapistSelect.innerHTML = '<option value="">Select service first...</option>';

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').value = today;

        modal.classList.add('active');
    }

    updateBookingTherapistOptions(serviceId) {
        const therapistSelect = document.getElementById('booking-therapist');
        therapistSelect.innerHTML = '<option value="">Select therapist...</option>';

        if (!serviceId) return;

        const therapistsForService = this.therapists.filter(t =>
            t.isActive !== false && (t.services || []).includes(serviceId)
        );

        therapistsForService.forEach(t => {
            therapistSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }

    async createManualBooking() {
        const btn = document.getElementById('save-booking-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const data = {
                clientName: document.getElementById('booking-client-name').value.trim(),
                phone: document.getElementById('booking-phone').value.trim(),
                email: document.getElementById('booking-email').value.trim() || null,
                service: document.getElementById('booking-service').value,
                therapistId: document.getElementById('booking-therapist').value,
                date: document.getElementById('booking-date').value,
                timeSlot: document.getElementById('booking-time').value,
                source: document.getElementById('booking-source').value,
                paymentType: document.getElementById('booking-payment').value || null,
                notes: document.getElementById('booking-notes').value.trim() || null,
                bookingType: 'appointment',
                status: 'confirmed', // Manual bookings are confirmed by default
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: this.user.email
            };

            await this.db.collection('bookings').add(data);
            this.showToast('Booking created successfully');
            this.closeModal('add-booking-modal');
            await this.loadBookings();

        } catch (error) {
            console.error('Error creating booking:', error);
            this.showToast('Error creating booking', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    // ============ HELPER METHODS ============

    getSourceLabel(source) {
        const labels = {
            'website': 'Website',
            'phone': 'Phone',
            'walkin': 'Walk-in',
            'referral': 'Referral',
            'social': 'Social',
            'other': 'Other'
        };
        return labels[source] || source || 'Website';
    }

    getServiceById(id) {
        return this.services.find(s => s.id === id);
    }

    getTherapistById(id) {
        return this.therapists.find(t => t.id === id);
    }

    switchSection(section) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Update sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`section-${section}`).classList.add('active');

        // Update title
        const titles = {
            bookings: 'Bookings',
            therapists: 'Therapists',
            services: 'Services'
        };
        document.getElementById('section-title').textContent = titles[section] || section;
    }

    async loadBookings() {
        const tbody = document.getElementById('bookings-tbody');
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="7">
                    <div class="loading-spinner"></div>
                    Loading bookings...
                </td>
            </tr>
        `;

        try {
            // Get bookings ordered by creation date
            const snapshot = await this.db.collection('bookings')
                .orderBy('createdAt', 'desc')
                .limit(100)
                .get();

            this.bookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.applyFilters();
            this.updateStats();

        } catch (error) {
            console.error('Error loading bookings:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <p>Error loading bookings. Please refresh.</p>
                    </td>
                </tr>
            `;
        }
    }

    applyFilters() {
        const status = document.getElementById('filter-status').value;
        const therapist = document.getElementById('filter-therapist').value;
        const source = document.getElementById('filter-source').value;
        const dateRange = document.getElementById('filter-date').value;
        const search = document.getElementById('filter-search').value.toLowerCase();

        let filtered = [...this.bookings];

        // Status filter
        if (status !== 'all') {
            filtered = filtered.filter(b => b.status === status);
        }

        // Therapist filter
        if (therapist !== 'all') {
            filtered = filtered.filter(b => b.therapistId === therapist);
        }

        // Source filter
        if (source !== 'all') {
            filtered = filtered.filter(b => (b.source || 'website') === source);
        }

        // Date filter
        if (dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(b => {
                if (b.bookingType === 'callback') {
                    // For callbacks, use creation date
                    const created = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                    if (dateRange === 'today') {
                        return created >= today;
                    } else if (dateRange === 'week') {
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return created >= weekAgo;
                    } else if (dateRange === 'month') {
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return created >= monthAgo;
                    }
                } else {
                    // For appointments, use booking date
                    const bookingDate = new Date(b.date);
                    if (dateRange === 'today') {
                        return bookingDate.toDateString() === today.toDateString();
                    } else if (dateRange === 'week') {
                        const weekFromNow = new Date(today);
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        return bookingDate >= today && bookingDate <= weekFromNow;
                    } else if (dateRange === 'month') {
                        const monthFromNow = new Date(today);
                        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
                        return bookingDate >= today && bookingDate <= monthFromNow;
                    }
                }
                return true;
            });
        }

        // Search filter
        if (search) {
            filtered = filtered.filter(b =>
                b.clientName?.toLowerCase().includes(search) ||
                b.phone?.includes(search) ||
                b.email?.toLowerCase().includes(search)
            );
        }

        this.renderBookings(filtered);
    }

    renderBookings(bookings) {
        const tbody = document.getElementById('bookings-tbody');

        if (bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <h3>No bookings found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = bookings.map(booking => this.renderBookingRow(booking)).join('');

        // Attach row event listeners
        tbody.querySelectorAll('.btn-action.view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.showBookingDetails(id);
            });
        });

        tbody.querySelectorAll('.btn-action.confirm').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.updateBookingStatus(id, 'confirmed');
            });
        });

        tbody.querySelectorAll('.btn-action.cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.updateBookingStatus(id, 'cancelled');
            });
        });
    }

    renderBookingRow(booking) {
        const service = this.getServiceById(booking.service);
        const therapist = this.getTherapistById(booking.therapistId);
        const isCallback = booking.bookingType === 'callback';

        // Format date/time
        let dateTimeDisplay = '';
        if (isCallback) {
            const created = booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt);
            dateTimeDisplay = `<span style="color: var(--text-gray)">Callback requested</span><br><small>${this.formatDate(created)}</small>`;
        } else {
            dateTimeDisplay = `${booking.date}<br><small>${booking.timeSlot}</small>`;
        }

        // Source badge with icon
        const source = booking.source || 'website';
        const sourceIcons = {
            'website': '🌐',
            'phone': '📞',
            'walkin': '🚶',
            'referral': '👥',
            'social': '📱',
            'other': '📋'
        };
        const sourceIcon = sourceIcons[source] || '📋';
        const sourceLabel = this.getSourceLabel(source);

        // Payment type shown below source
        const paymentLabel = booking.paymentType === 'gesy' ? 'GESY' :
                            booking.paymentType === 'private' ? 'Private' : '';

        // Actions based on status
        let actions = `<button class="btn-action view" data-id="${booking.id}">View</button>`;
        if (booking.status === 'pending') {
            actions += `
                <button class="btn-action confirm" data-id="${booking.id}">Confirm</button>
                <button class="btn-action cancel" data-id="${booking.id}">Cancel</button>
            `;
        }

        return `
            <tr>
                <td>
                    <div class="client-info">
                        <span class="client-name">${this.escapeHtml(booking.clientName || booking.name)}</span>
                        <span class="client-contact">${this.escapeHtml(booking.phone)}${booking.email ? ` | ${this.escapeHtml(booking.email)}` : ''}</span>
                    </div>
                </td>
                <td>${service?.name || booking.service}</td>
                <td>${therapist?.name || booking.therapistId || 'Any'}</td>
                <td>${dateTimeDisplay}</td>
                <td>
                    <span class="source-badge source-${source}">${sourceIcon} ${sourceLabel}</span>
                    ${paymentLabel ? `<br><small class="payment-info">${paymentLabel}</small>` : ''}
                </td>
                <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
                <td>
                    <div class="action-buttons">
                        ${actions}
                    </div>
                </td>
            </tr>
        `;
    }

    updateStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const pending = this.bookings.filter(b => b.status === 'pending').length;
        const confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
        const callbacks = this.bookings.filter(b => b.bookingType === 'callback' && b.status === 'pending').length;

        // Today's appointments
        const todayCount = this.bookings.filter(b => {
            if (b.bookingType === 'callback') return false;
            const bookingDate = new Date(b.date);
            return bookingDate.toDateString() === today.toDateString() && b.status !== 'cancelled';
        }).length;

        document.getElementById('stat-pending').textContent = pending;
        document.getElementById('stat-confirmed').textContent = confirmed;
        document.getElementById('stat-today').textContent = todayCount;
        document.getElementById('stat-callbacks').textContent = callbacks;
    }

    showBookingDetails(id) {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) return;

        const service = this.getServiceById(booking.service);
        const therapist = this.getTherapistById(booking.therapistId);
        const isCallback = booking.bookingType === 'callback';
        const created = booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt);

        const body = document.getElementById('booking-modal-body');
        body.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Client</span>
                <span class="detail-value">${this.escapeHtml(booking.clientName || booking.name)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value"><a href="tel:${booking.phone}">${this.escapeHtml(booking.phone)}</a></span>
            </div>
            ${booking.email ? `
            <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value"><a href="mailto:${booking.email}">${this.escapeHtml(booking.email)}</a></span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Service</span>
                <span class="detail-value">${service?.name || booking.service}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Therapist</span>
                <span class="detail-value">${therapist?.name || booking.therapistId || 'Any available'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Source</span>
                <span class="detail-value"><span class="source-badge source-${booking.source || 'website'}">${this.getSourceLabel(booking.source)}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">${isCallback ? 'Callback Request' : 'Appointment'}</span>
            </div>
            ${!isCallback ? `
            <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${booking.date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${booking.timeSlot}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Payment</span>
                <span class="detail-value">${booking.paymentType === 'gesy' ? 'GESY' : booking.paymentType === 'private' ? 'Private' : 'Not specified'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value"><span class="status-badge ${booking.status}">${booking.status}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Created</span>
                <span class="detail-value">${this.formatDate(created)}${booking.createdBy ? ` by ${booking.createdBy}` : ''}</span>
            </div>
            ${booking.message ? `
            <div class="detail-row">
                <span class="detail-label">Message</span>
                <span class="detail-value">${this.escapeHtml(booking.message)}</span>
            </div>
            ` : ''}
            <div class="notes-section">
                <h4>Admin Notes</h4>
                <textarea id="booking-notes" placeholder="Add notes...">${booking.notes || ''}</textarea>
            </div>
        `;

        // Footer actions
        const footer = document.getElementById('booking-modal-footer');
        let footerHtml = `<button class="btn-action view" onclick="adminApp.saveNotes('${id}')">Save Notes</button>`;

        if (booking.status === 'pending') {
            footerHtml += `
                <button class="btn-action confirm" onclick="adminApp.updateBookingStatus('${id}', 'confirmed'); adminApp.closeModal();">Confirm</button>
                <button class="btn-action cancel" onclick="adminApp.updateBookingStatus('${id}', 'cancelled'); adminApp.closeModal();">Cancel</button>
            `;
        } else if (booking.status === 'confirmed') {
            footerHtml += `<button class="btn-action cancel" onclick="adminApp.updateBookingStatus('${id}', 'cancelled'); adminApp.closeModal();">Cancel Booking</button>`;
        }

        footer.innerHTML = footerHtml;

        document.getElementById('booking-modal').classList.add('active');
    }

    closeModal(modalId = 'booking-modal') {
        document.getElementById(modalId).classList.remove('active');
    }

    async updateBookingStatus(id, status) {
        try {
            await this.db.collection('bookings').doc(id).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update local data
            const booking = this.bookings.find(b => b.id === id);
            if (booking) {
                booking.status = status;
            }

            this.applyFilters();
            this.updateStats();

            // Show confirmation
            this.showToast(`Booking ${status}`);

        } catch (error) {
            console.error('Error updating booking:', error);
            this.showToast('Error updating booking', 'error');
        }
    }

    async saveNotes(id) {
        const notes = document.getElementById('booking-notes').value;

        try {
            await this.db.collection('bookings').doc(id).update({
                notes: notes,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update local data
            const booking = this.bookings.find(b => b.id === id);
            if (booking) {
                booking.notes = notes;
            }

            this.showToast('Notes saved');

        } catch (error) {
            console.error('Error saving notes:', error);
            this.showToast('Error saving notes', 'error');
        }
    }

    showToast(message, type = 'success') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 14px 24px;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
            color: white;
            border-radius: 8px;
            font-weight: 500;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Utility functions
    formatDate(date) {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Render Therapists Section
    renderTherapists() {
        const grid = document.getElementById('therapists-grid');
        if (!grid) return;

        if (this.therapists.length === 0) {
            grid.innerHTML = `
                <div class="empty-state-card">
                    <p>No therapists yet. Click "Add Therapist" to create one.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.therapists.map(t => {
            const initials = t.name ? t.name.split(' ').map(n => n[0]).join('') : '?';
            const hasGreekName = t.nameEl && t.nameEl.trim();
            const hasGreekTitle = t.titleEl && t.titleEl.trim();

            return `
                <div class="therapist-card">
                    <div class="therapist-avatar">
                        ${t.photo ?
                            `<img src="${t.photo}" alt="${t.name}" onerror="this.parentElement.innerHTML='<div class=\\'therapist-avatar-placeholder\\'>${initials}</div>'">` :
                            `<div class="therapist-avatar-placeholder">${initials}</div>`
                        }
                    </div>
                    <div class="therapist-details">
                        <div class="therapist-name">
                            ${this.escapeHtml(t.name)}
                            ${hasGreekName ? `<span class="lang-badge">EL: ${this.escapeHtml(t.nameEl)}</span>` : '<span class="missing-translation" title="Missing Greek translation">⚠️ EL</span>'}
                        </div>
                        <div class="therapist-title">
                            ${this.escapeHtml(t.title || '')}
                            ${t.title && !hasGreekTitle ? '<span class="missing-translation" title="Missing Greek translation">⚠️</span>' : ''}
                        </div>
                        <div class="therapist-meta">
                            <div class="therapist-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                ${this.escapeHtml(t.email || '')}
                            </div>
                            ${t.gesyCode ? `
                            <div class="therapist-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                GESY: ${this.escapeHtml(t.gesyCode)}
                            </div>
                            ` : ''}
                        </div>
                        <div class="therapist-services">
                            ${(t.services || []).map(sId => {
                                const service = this.getServiceById(sId);
                                return `<span class="service-tag">${this.escapeHtml(service?.name || sId)}</span>`;
                            }).join('')}
                        </div>
                        <div class="therapist-status">
                            ${t.isActive !== false ?
                                '<span class="status-active"><span>●</span> Active</span>' :
                                '<span class="status-inactive"><span>●</span> Inactive</span>'
                            }
                        </div>
                        <div class="card-actions">
                            <button class="btn-edit" data-therapist-id="${t.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </button>
                            <button class="btn-delete" data-therapist-id="${t.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners
        grid.querySelectorAll('.btn-edit[data-therapist-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const therapist = this.therapists.find(t => t.id === btn.dataset.therapistId);
                if (therapist) this.openTherapistModal(therapist);
            });
        });

        grid.querySelectorAll('.btn-delete[data-therapist-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteTherapist(btn.dataset.therapistId);
            });
        });
    }

    // Render Services Section
    renderServices() {
        const grid = document.getElementById('services-grid');
        if (!grid) return;

        if (this.services.length === 0) {
            grid.innerHTML = `
                <div class="empty-state-card">
                    <p>No services yet. Click "Add Service" to create one.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.services.map(s => {
            // Get therapists who provide this service (from providedBy array)
            const providerIds = s.providedBy || [];
            const therapistNames = this.therapists
                .filter(t => providerIds.includes(t.id))
                .map(t => t.name);

            // Format pricing - GESY shows Yes/No, Private shows price
            let gesyPrice = 'No';
            let privatePrice = '—';

            if (s.pricing) {
                if (s.pricing.type === 'fixed' || s.pricing.type === 'from') {
                    if (s.pricing.gesyPrice) {
                        gesyPrice = 'Yes';
                    }
                    if (s.pricing.privatePrice) {
                        // Private always shows "from"
                        privatePrice = `from €${s.pricing.privatePrice}`;
                    }
                } else if (s.pricing.type === 'custom') {
                    gesyPrice = s.pricing.customText || 'No';
                    privatePrice = s.pricing.customText || '—';
                }
            }

            const hasGreekName = s.nameEl && s.nameEl.trim();
            const hasGreekDesc = s.descriptionEl && s.descriptionEl.trim();

            return `
                <div class="service-card-admin">
                    <div class="service-card-header">
                        <div class="service-icon-admin">
                            <span>⭐</span>
                        </div>
                        <div class="service-card-title">
                            <h3>
                                ${this.escapeHtml(s.name)}
                                ${!hasGreekName ? '<span class="missing-translation" title="Missing Greek translation">⚠️ EL</span>' : ''}
                            </h3>
                            ${hasGreekName ? `<p class="lang-subtitle">EL: ${this.escapeHtml(s.nameEl)}</p>` : ''}
                            <p>${this.escapeHtml(s.description || '')} ${s.description && !hasGreekDesc ? '<span class="missing-translation">⚠️</span>' : ''}</p>
                        </div>
                    </div>
                    <div class="service-pricing">
                        <div class="price-row">
                            <span class="price-label">GESY</span>
                            <span class="price-value gesy">${gesyPrice}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Private</span>
                            <span class="price-value">${privatePrice}</span>
                        </div>
                    </div>
                    <div class="service-therapists">
                        <strong>Provided by:</strong> ${therapistNames.length > 0 ? therapistNames.join(', ') : 'No active therapists'}
                    </div>
                    <div class="card-actions">
                        <button class="btn-edit" data-service-id="${s.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                        <button class="btn-delete" data-service-id="${s.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners
        grid.querySelectorAll('.btn-edit[data-service-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const service = this.services.find(s => s.id === btn.dataset.serviceId);
                if (service) this.openServiceModal(service);
            });
        });

        grid.querySelectorAll('.btn-delete[data-service-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteService(btn.dataset.serviceId);
            });
        });
    }
}

// Initialize
const adminApp = new AdminApp();
adminApp.init();

// Make adminApp globally accessible for inline handlers
window.adminApp = adminApp;

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
