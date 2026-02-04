// Admin Panel Application
// Data is stored in Firebase only - managed via admin panel

class AdminApp {
    constructor() {
        this.db = null;
        this.auth = null;
        this.user = null;
        this.bookings = [];
        this.therapists = [];
        this.services = [];
        this.clients = [];
        this.currentClientPhone = null;
        this.unsubscribe = null;
        // Calendar state
        this.calendarDate = new Date();
        this.calendarTherapistFilter = 'all';
        // Analytics state
        this.analyticsPeriod = 7;
        this.charts = {};
        // Notifications
        this.notifications = [];
        this.lastSeenTime = null;
        this.notificationUnsubscribe = null;
    }

    async init() {
        // Initialize Firebase first
        try {
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
            console.log('Firebase initialized');

            // Check if user is already logged in
            this.auth.onAuthStateChanged(async (user) => {
                if (user && user.email) {
                    // User is signed in with Email/Password
                    console.log('User logged in:', user.email);
                    this.user = user;
                    this.hideLoginScreen();
                    this.showDashboard();
                    await this.loadDataFromFirebase();
                } else {
                    // No user is signed in, show login screen
                    this.showLoginScreen();
                }
            });

            // Attach event listeners
            this.attachEventListeners();
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.showLoginError('Failed to connect to server. Please try again later.');
        }
    }

    attachEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button (if exists in sidebar)
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.auth.signOut();
            });
        }

        // Mobile sidebar toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });

            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });

            // Close sidebar on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    this.closeSidebar();
                }
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
                // Close sidebar on mobile after navigation
                this.closeSidebar();
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

        // Calendar controls
        document.getElementById('cal-prev-month')?.addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('cal-next-month')?.addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.getElementById('cal-today-btn')?.addEventListener('click', () => {
            this.calendarDate = new Date();
            this.renderCalendar();
        });

        document.getElementById('cal-filter-therapist')?.addEventListener('change', (e) => {
            this.calendarTherapistFilter = e.target.value;
            this.renderCalendar();
        });

        // Day modal close
        document.getElementById('day-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'day-modal') {
                this.closeModal('day-modal');
            }
        });

        document.querySelector('#day-modal .modal-close')?.addEventListener('click', () => {
            this.closeModal('day-modal');
        });

        // Analytics period tabs
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.analyticsPeriod = e.target.dataset.period === 'all' ? 'all' : parseInt(e.target.dataset.period);
                this.renderAnalytics();
            });
        });

        // Statistics filters
        ['stats-period', 'stats-view-type', 'stats-therapist'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.renderStatistics());
            }
        });

        const statsRefreshBtn = document.getElementById('stats-refresh-btn');
        if (statsRefreshBtn) {
            statsRefreshBtn.addEventListener('click', () => {
                this.loadBookings();
                this.renderStatistics();
            });
        }

        // Import historical data button
        const importHistoricalBtn = document.getElementById('import-historical-btn');
        if (importHistoricalBtn) {
            importHistoricalBtn.addEventListener('click', () => {
                this.importHistoricalData();
            });
        }

        // Notification bell
        const notificationBtn = document.getElementById('notification-btn');
        const notificationDropdown = document.getElementById('notification-dropdown');
        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
                    notificationDropdown.classList.add('hidden');
                }
            });

            document.getElementById('mark-all-read')?.addEventListener('click', () => {
                this.markAllNotificationsRead();
            });
        }
    }

    // Temporarily disabled - auth removed
    // async handleLogin() {
    //     const email = document.getElementById('email').value;
    //     const password = document.getElementById('password').value;
    //     const btn = document.getElementById('login-btn');
    //     const errorEl = document.getElementById('login-error');

    //     btn.classList.add('loading');
    //     btn.disabled = true;
    //     errorEl.textContent = '';

    //     try {
    //         await this.auth.signInWithEmailAndPassword(email, password);
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         errorEl.textContent = this.getAuthErrorMessage(error.code);
    //     } finally {
    //         btn.classList.remove('loading');
    //         btn.disabled = false;
    //     }
    // }

    // getAuthErrorMessage(code) {
    //     const messages = {
    //         'auth/user-not-found': 'No account found with this email',
    //         'auth/wrong-password': 'Incorrect password',
    //         'auth/invalid-email': 'Invalid email address',
    //         'auth/too-many-requests': 'Too many attempts. Try again later.',
    //         'auth/invalid-credential': 'Invalid email or password'
    //     };
    //     return messages[code] || 'Login failed. Please try again.';
    // }

    // Mobile sidebar methods
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuBtn = document.getElementById('mobile-menu-btn');

        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuBtn = document.getElementById('mobile-menu-btn');

        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        menuBtn.classList.remove('active');
    }

    // Temporarily disabled - auth removed
    // showLogin() {
    //     document.getElementById('login-screen').classList.remove('hidden');
    //     document.getElementById('admin-dashboard').classList.add('hidden');
    //     if (this.unsubscribe) {
    //         this.unsubscribe();
    //         this.unsubscribe = null;
    //     }
    //     if (this.notificationUnsubscribe) {
    //         this.notificationUnsubscribe();
    //         this.notificationUnsubscribe = null;
    //     }
    // }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnSpinner = loginBtn.querySelector('.btn-spinner');
        const errorDiv = document.getElementById('login-error');

        // Clear previous errors
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';

        try {
            // Sign in with email and password
            await this.auth.signInWithEmailAndPassword(email, password);
            // onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Login error:', error);

            // Show error message
            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }

            this.showLoginError(errorMessage);

            // Reset button state
            loginBtn.disabled = false;
            btnText.style.display = 'block';
            btnSpinner.style.display = 'none';
        }
    }

    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }

    hideLoginScreen() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    async showDashboard() {
        // Show dashboard, hide login
        this.hideLoginScreen();

        // Load last seen time from localStorage
        this.lastSeenTime = localStorage.getItem('adminLastSeenTime')
            ? new Date(localStorage.getItem('adminLastSeenTime'))
            : new Date();

        // Initialize empty arrays, will be populated from Firebase
        this.services = [];
        this.therapists = [];
        this.bookings = [];

        // Load data from Firebase
        await this.loadDataFromFirebase();

        // Render UI after data is loaded
        this.populateTherapistFilter();
        this.renderTherapists();
        this.renderServices();
        this.applyFilters();
        this.updateStats();
    }

    async loadDataFromFirebase() {
        try {
            // Try loading from Firebase without blocking UI
            await this.loadServices();
            await this.loadTherapists();
            // Don't show loading indicator for background load
            await this.loadBookings(false);
            this.startNotificationListener();
        } catch (error) {
            console.log('Firebase not available, using local data only');
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
            const snapshot = await this.db.collection('services').orderBy('order').get();
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
            document.getElementById('service-order').value = service.order || 99;
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
                order: parseInt(document.getElementById('service-order').value) || 99,
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
            const paymentType = document.getElementById('booking-payment').value || null;
            const location = document.getElementById('booking-location').value;
            const manualPrice = document.getElementById('booking-price').value;

            // Auto-calculate price if not manually entered
            let price = null;
            if (manualPrice) {
                price = parseFloat(manualPrice);
            } else {
                const serviceId = document.getElementById('booking-service').value;
                const service = this.getServiceById(serviceId);
                if (service && service.pricing) {
                    if (paymentType === 'gesy-new' || paymentType === 'gesy-old') {
                        price = service.pricing.gesyPrice || 29;
                    } else if (paymentType === 'private') {
                        price = service.pricing.privatePrice || 35;
                    }
                }
            }

            const data = {
                clientName: document.getElementById('booking-client-name').value.trim(),
                phone: document.getElementById('booking-phone').value.trim(),
                email: document.getElementById('booking-email').value.trim() || null,
                service: document.getElementById('booking-service').value,
                therapistId: document.getElementById('booking-therapist').value,
                date: document.getElementById('booking-date').value,
                timeSlot: document.getElementById('booking-time').value,
                source: document.getElementById('booking-source').value,
                paymentType: paymentType,
                location: location,
                price: price,
                notes: document.getElementById('booking-notes').value.trim() || null,
                bookingType: 'appointment',
                status: 'confirmed', // Manual bookings are confirmed by default
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: this.user?.email || 'admin'
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

    openEditBookingModal(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) {
            this.showToast('Booking not found', 'error');
            return;
        }

        // Populate form with existing data
        document.getElementById('booking-client-name').value = booking.clientName || '';
        document.getElementById('booking-phone').value = booking.phone || '';
        document.getElementById('booking-email').value = booking.email || '';
        document.getElementById('booking-service').value = booking.service || '';
        this.updateBookingTherapistOptions(booking.service);
        document.getElementById('booking-therapist').value = booking.therapistId || '';
        document.getElementById('booking-date').value = booking.date || '';
        document.getElementById('booking-time').value = booking.timeSlot || '';
        document.getElementById('booking-source').value = booking.source || 'phone';
        document.getElementById('booking-payment').value = booking.paymentType || '';
        document.getElementById('booking-location').value = booking.location || 'home';
        document.getElementById('booking-price').value = booking.price || '';
        document.getElementById('booking-notes').value = booking.notes || '';

        // Change form handler to update instead of create
        const form = document.getElementById('add-booking-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateBooking(bookingId);
        };

        // Change modal title
        document.querySelector('#add-booking-modal .modal-header h2').textContent = 'Edit Booking';
        document.getElementById('save-booking-btn').querySelector('span').textContent = 'Update Booking';

        // Open modal
        document.getElementById('add-booking-modal').classList.remove('hidden');
    }

    async updateBooking(bookingId) {
        const btn = document.getElementById('save-booking-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const paymentType = document.getElementById('booking-payment').value || null;
            const location = document.getElementById('booking-location').value;
            const manualPrice = document.getElementById('booking-price').value;

            // Auto-calculate price if not manually entered
            let price = null;
            if (manualPrice) {
                price = parseFloat(manualPrice);
            } else {
                const serviceId = document.getElementById('booking-service').value;
                const service = this.getServiceById(serviceId);
                if (service && service.pricing) {
                    if (paymentType === 'gesy-new' || paymentType === 'gesy-old') {
                        price = service.pricing.gesyPrice || 29;
                    } else if (paymentType === 'private') {
                        price = service.pricing.privatePrice || 35;
                    }
                }
            }

            const data = {
                clientName: document.getElementById('booking-client-name').value.trim(),
                phone: document.getElementById('booking-phone').value.trim(),
                email: document.getElementById('booking-email').value.trim() || null,
                service: document.getElementById('booking-service').value,
                therapistId: document.getElementById('booking-therapist').value,
                date: document.getElementById('booking-date').value,
                timeSlot: document.getElementById('booking-time').value,
                source: document.getElementById('booking-source').value,
                paymentType: paymentType,
                location: location,
                price: price,
                notes: document.getElementById('booking-notes').value.trim() || null,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: this.user?.email || 'admin'
            };

            await this.db.collection('bookings').doc(bookingId).update(data);
            this.showToast('Booking updated successfully');
            this.closeModal('add-booking-modal');
            await this.loadBookings();

            // Reset form handler
            const form = document.getElementById('add-booking-form');
            form.onsubmit = (e) => {
                e.preventDefault();
                this.createManualBooking();
            };

        } catch (error) {
            console.error('Error updating booking:', error);
            this.showToast('Error updating booking', 'error');
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

    getPaymentTypeLabel(paymentType) {
        const labels = {
            'gesy-new': 'GESY New',
            'gesy-old': 'GESY Returning',
            'private': 'Private',
            'gesy': 'GESY' // Legacy support
        };
        return labels[paymentType] || 'Not specified';
    }

    getLocationLabel(location) {
        const labels = {
            'gym': 'Gym Sector',
            'physio': 'Physio Room',
            'home': 'Home-care'
        };
        return labels[location] || location || 'Not specified';
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
            services: 'Services',
            calendar: 'Calendar',
            analytics: 'Analytics',
            statistics: 'Statistics'
        };
        document.getElementById('section-title').textContent = titles[section] || section;

        // Render calendar, analytics or statistics when switching to those sections
        if (section === 'calendar') {
            this.populateCalendarTherapistFilter();
            this.renderCalendar();
        } else if (section === 'analytics') {
            this.renderAnalytics();
        } else if (section === 'statistics') {
            this.populateStatisticsTherapistFilter();
            this.renderStatistics();
        }
    }

    async loadBookings(showLoadingIndicator = true) {
        const tbody = document.getElementById('bookings-tbody');

        // Only show loading spinner for explicit user-triggered refreshes
        if (showLoadingIndicator) {
            tbody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="7">
                        <div class="loading-spinner"></div>
                        Loading bookings...
                    </td>
                </tr>
            `;
        }

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
            // Show empty state instead of error - Firebase not configured yet
            this.bookings = [];
            this.applyFilters();
            this.updateStats();
        }
    }

    async importHistoricalData() {
        const btn = document.getElementById('import-historical-btn');
        const originalText = btn.textContent;

        console.log('Import started');

        // Check if Firebase is initialized
        if (!this.db) {
            alert('Firebase is not connected. Please refresh the page and log in again.');
            return;
        }

        // Confirmation dialog
        if (!confirm('This will import historical booking data for January 2026.\n\nAre you sure you want to proceed?')) {
            return;
        }

        try {
            btn.textContent = 'Importing...';
            btn.disabled = true;

            console.log('Fetching data file...');

            // Fetch the combined data file (includes weeks 2-5, Jan 6 - Feb 1)
            const response = await fetch('/assets/data/january-2026-complete-extended.json');
            if (!response.ok) {
                throw new Error('Failed to load data file');
            }

            const data = await response.json();
            let importedCount = 0;
            let errors = 0;

            console.log(`Starting import of ${data.bookings.length} days of bookings...`);

            // Import each booking
            for (const dayData of data.bookings) {
                for (const session of dayData.sessions) {
                    try {
                        const bookingData = {
                            clientName: session.clientName,
                            phone: session.phone,
                            email: null,
                            service: session.service,
                            therapistId: dayData.therapistId,
                            date: dayData.date,
                            timeSlot: session.timeSlot,
                            source: session.source,
                            paymentType: session.paymentType,
                            location: session.location,
                            price: session.price,
                            notes: session.notes || `Imported historical data - January 2026`,
                            bookingType: 'appointment',
                            status: session.status,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            createdBy: 'historical-import'
                        };

                        await this.db.collection('bookings').add(bookingData);
                        importedCount++;

                        if (importedCount % 10 === 0) {
                            btn.textContent = `Importing... ${importedCount}`;
                            console.log(`Imported ${importedCount} bookings...`);
                        }
                    } catch (error) {
                        console.error('Error importing session:', session, error);
                        errors++;
                    }
                }
            }

            console.log(`Import complete! Successfully imported: ${importedCount} bookings`);
            if (errors > 0) {
                console.log(`Errors: ${errors}`);
            }

            // Hide the button after successful import
            btn.style.display = 'none';

            // Reload bookings to show the new data
            await this.loadBookings();
            this.renderStatistics();

            alert(`Import complete!\n${importedCount} bookings imported successfully.${errors > 0 ? `\n${errors} errors occurred.` : ''}`);

        } catch (error) {
            console.error('Fatal error during import:', error);
            alert('Import failed: ' + error.message);
            btn.textContent = originalText;
            btn.disabled = false;
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

        tbody.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.openEditBookingModal(id);
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

        // Source badge
        const source = booking.source || 'website';
        const sourceLabel = this.getSourceLabel(source);

        // Payment type shown below source
        const paymentLabel = booking.paymentType === 'gesy' ? 'GESY' :
                            booking.paymentType === 'private' ? 'Private' : '';

        // Actions - now all bookings are editable
        let actions = `
            <button class="btn-action view" data-id="${booking.id}">View</button>
            <button class="btn-action edit" data-id="${booking.id}">Edit</button>
        `;
        if (booking.status === 'pending') {
            actions += `
                <button class="btn-action confirm" data-id="${booking.id}">Confirm</button>
                <button class="btn-action cancel" data-id="${booking.id}">Cancel</button>
            `;
        }

        return `
            <tr>
                <td data-label="">
                    <div class="client-info">
                        <span class="client-name">${this.escapeHtml(booking.clientName || booking.name)}</span>
                        <span class="client-contact">${this.escapeHtml(booking.phone)}${booking.email ? ` | ${this.escapeHtml(booking.email)}` : ''}</span>
                    </div>
                </td>
                <td data-label="Service">${service?.name || booking.service}</td>
                <td data-label="Therapist">${therapist?.name || booking.therapistId || 'Any'}</td>
                <td data-label="Date/Time">${dateTimeDisplay}</td>
                <td data-label="Source">
                    <span class="source-badge source-${source}">${sourceLabel}</span>
                    ${paymentLabel ? `<br><small class="payment-info">${paymentLabel}</small>` : ''}
                </td>
                <td data-label="Status"><span class="status-badge ${booking.status}">${booking.status}</span></td>
                <td data-label="">
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

        // Add Delete button (always available)
        footerHtml += `<button class="btn-action delete" onclick="adminApp.deleteBooking('${id}')" style="margin-left: auto; background-color: var(--danger);">Delete</button>`;

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
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                confirmedAt: status === 'confirmed' ? firebase.firestore.FieldValue.serverTimestamp() : null
            });

            // Update local data
            const booking = this.bookings.find(b => b.id === id);
            if (booking) {
                booking.status = status;

                // Send confirmation email to client if confirmed and has email
                if (status === 'confirmed' && booking.email) {
                    this.sendClientConfirmationEmail(booking);
                }
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

    async deleteBooking(id) {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) return;

        // Confirmation dialog with booking details
        const confirmMessage = `Are you sure you want to DELETE this booking?\n\nClient: ${booking.clientName || booking.name}\nDate: ${booking.date || 'N/A'}\nTime: ${booking.time || 'N/A'}\n\nThis action cannot be undone!`;

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            // Delete from Firebase
            await this.db.collection('bookings').doc(id).delete();

            // Remove from local array
            this.bookings = this.bookings.filter(b => b.id !== id);

            // Update UI
            this.applyFilters();
            this.updateStats();

            // Close modal and show success
            this.closeModal('booking-modal');
            this.showToast('Booking deleted successfully');

        } catch (error) {
            console.error('Error deleting booking:', error);
            this.showToast('Error deleting booking', 'error');
        }
    }

    async sendClientConfirmationEmail(booking) {
        const EMAILJS_SERVICE_ID = 'service_apg3zoa';
        const EMAILJS_TEMPLATE_ID = 'template_confirm'; // You'll need to create this template in EmailJS
        const EMAILJS_PUBLIC_KEY = '1cMf-T1krhUJoreWv';

        const service = this.getServiceById(booking.service);
        const therapist = this.getTherapistById(booking.therapistId);

        const templateParams = {
            to_email: booking.email,
            to_name: booking.clientName || booking.name,
            service_name: service?.name || booking.service,
            therapist_name: therapist?.name || 'Our team',
            booking_date: booking.date,
            booking_time: booking.timeSlot,
            clinic_name: 'Right Track Physiotherapy',
            clinic_address: 'Larnaca, Cyprus',
            clinic_phone: '+357 99 123456'
        };

        try {
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: EMAILJS_SERVICE_ID,
                    template_id: EMAILJS_TEMPLATE_ID,
                    user_id: EMAILJS_PUBLIC_KEY,
                    template_params: templateParams
                })
            });
            console.log('Confirmation email sent to client');
            this.showToast('Confirmation email sent');
        } catch (error) {
            console.error('Email error:', error);
            // Don't show error to user - booking is still confirmed
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

    // ============ CALENDAR METHODS ============

    populateCalendarTherapistFilter() {
        const select = document.getElementById('cal-filter-therapist');
        if (!select) return;
        select.innerHTML = '<option value="all">All Therapists</option>';
        this.therapists.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.name;
            select.appendChild(option);
        });
    }

    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const titleEl = document.getElementById('cal-month-title');
        if (!grid || !titleEl) return;

        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        // Update title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        titleEl.textContent = `${monthNames[month]} ${year}`;

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Monday = 0, Sunday = 6 (adjust from JS default)
        let startWeekday = firstDay.getDay() - 1;
        if (startWeekday < 0) startWeekday = 6;

        // Group bookings by date
        const bookingsByDate = this.getBookingsByDate();

        // Build calendar HTML
        let html = '';
        const today = new Date();
        const todayStr = this.formatDateStr(today);

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startWeekday - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            html += `<div class="calendar-day other-month"><span class="day-number">${day}</span></div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayOfWeek = new Date(year, month, day).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Get bookings for this day
            let dayBookings = bookingsByDate[dateStr] || [];
            if (this.calendarTherapistFilter !== 'all') {
                dayBookings = dayBookings.filter(b => b.therapistId === this.calendarTherapistFilter);
            }

            const classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (isWeekend) classes.push('weekend');

            let bookingsHtml = '';
            const maxShow = 3;
            dayBookings.slice(0, maxShow).forEach(b => {
                const therapist = this.getTherapistById(b.therapistId);
                const label = b.timeSlot ? `${b.timeSlot} ${therapist?.name?.split(' ')[0] || ''}` : 'Callback';
                bookingsHtml += `<div class="day-booking-item ${b.status}">${label}</div>`;
            });
            if (dayBookings.length > maxShow) {
                bookingsHtml += `<div class="day-more">+${dayBookings.length - maxShow} more</div>`;
            }

            html += `
                <div class="${classes.join(' ')}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    <div class="day-bookings">${bookingsHtml}</div>
                </div>
            `;
        }

        // Next month days (fill remaining cells)
        const totalCells = startWeekday + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            html += `<div class="calendar-day other-month"><span class="day-number">${i}</span></div>`;
        }

        grid.innerHTML = html;

        // Attach click listeners to calendar days
        grid.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = dayEl.dataset.date;
                this.showDayDetail(date);
            });
        });
    }

    getBookingsByDate() {
        const byDate = {};
        this.bookings.forEach(b => {
            if (b.date && b.bookingType !== 'callback') {
                if (!byDate[b.date]) byDate[b.date] = [];
                byDate[b.date].push(b);
            }
        });
        // Sort each day's bookings by time
        Object.keys(byDate).forEach(date => {
            byDate[date].sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || ''));
        });
        return byDate;
    }

    formatDateStr(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    showDayDetail(dateStr) {
        let dayBookings = this.bookings.filter(b => b.date === dateStr && b.bookingType !== 'callback');
        if (this.calendarTherapistFilter !== 'all') {
            dayBookings = dayBookings.filter(b => b.therapistId === this.calendarTherapistFilter);
        }
        dayBookings.sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || ''));

        const date = new Date(dateStr + 'T00:00:00');
        const titleEl = document.getElementById('day-modal-title');
        titleEl.textContent = `Bookings for ${date.toLocaleDateString('en-GB', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}`;

        const body = document.getElementById('day-modal-body');
        if (dayBookings.length === 0) {
            body.innerHTML = `
                <div class="empty-state">
                    <p>No bookings for this day.</p>
                </div>
            `;
        } else {
            body.innerHTML = `
                <div class="day-booking-list">
                    ${dayBookings.map(b => {
                        const service = this.getServiceById(b.service);
                        const therapist = this.getTherapistById(b.therapistId);
                        return `
                            <div class="day-booking-card ${b.status}">
                                <div class="day-booking-info">
                                    <span class="booking-time">${b.timeSlot || 'N/A'}</span>
                                    <span class="booking-client">${this.escapeHtml(b.clientName || b.name)}</span>
                                    <span class="booking-service">${service?.name || b.service} • ${therapist?.name || 'Any'}</span>
                                </div>
                                <div class="day-booking-actions">
                                    <button class="btn-action view" onclick="adminApp.showBookingDetails('${b.id}'); adminApp.closeModal('day-modal');">View</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        document.getElementById('day-modal').classList.add('active');
    }

    // ============ ANALYTICS METHODS ============

    renderAnalytics() {
        const filteredBookings = this.getFilteredBookingsForAnalytics();

        // Update KPIs
        this.updateAnalyticsKPIs(filteredBookings);

        // Render charts
        this.renderSourcesChart(filteredBookings);
        this.renderPaymentChart(filteredBookings);
        this.renderServicesChart(filteredBookings);
        this.renderTherapistsChart(filteredBookings);
        this.renderTrendChart(filteredBookings);
    }

    getFilteredBookingsForAnalytics() {
        if (this.analyticsPeriod === 'all') {
            return this.bookings;
        }

        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - this.analyticsPeriod);

        return this.bookings.filter(b => {
            const created = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return created >= cutoff && created <= now;
        });
    }

    updateAnalyticsKPIs(bookings) {
        const total = bookings.length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        const cancelled = bookings.filter(b => b.status === 'cancelled').length;
        const conversionRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0;
        const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;

        document.getElementById('kpi-total').textContent = this.bookings.length;
        document.getElementById('kpi-conversion').textContent = `${conversionRate}%`;
        document.getElementById('kpi-period').textContent = total;
        document.getElementById('kpi-cancelled').textContent = `${cancellationRate}%`;
    }

    renderSourcesChart(bookings) {
        const ctx = document.getElementById('chart-sources');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.sources) this.charts.sources.destroy();

        const sourceData = {};
        bookings.forEach(b => {
            const source = b.source || 'website';
            sourceData[source] = (sourceData[source] || 0) + 1;
        });

        const sourceLabels = {
            website: 'Website',
            phone: 'Phone',
            walkin: 'Walk-in',
            referral: 'Referral',
            social: 'Social',
            other: 'Other'
        };

        const sourceColors = {
            website: '#17a2b8',
            phone: '#28a745',
            walkin: '#ff6b35',
            referral: '#6f42c1',
            social: '#e83e8c',
            other: '#6c757d'
        };

        const labels = Object.keys(sourceData).map(k => sourceLabels[k] || k);
        const data = Object.values(sourceData);
        const colors = Object.keys(sourceData).map(k => sourceColors[k] || '#6c757d');

        this.charts.sources = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 15 }
                    }
                }
            }
        });
    }

    renderPaymentChart(bookings) {
        const ctx = document.getElementById('chart-payment');
        if (!ctx) return;

        if (this.charts.payment) this.charts.payment.destroy();

        const paymentData = { gesy: 0, private: 0, unspecified: 0 };
        bookings.forEach(b => {
            if (b.paymentType === 'gesy') paymentData.gesy++;
            else if (b.paymentType === 'private') paymentData.private++;
            else paymentData.unspecified++;
        });

        this.charts.payment = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['GESY', 'Private', 'Not Specified'],
                datasets: [{
                    data: [paymentData.gesy, paymentData.private, paymentData.unspecified],
                    backgroundColor: ['#17a2b8', '#28a745', '#e9ecef'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 15 }
                    }
                }
            }
        });
    }

    renderServicesChart(bookings) {
        const ctx = document.getElementById('chart-services');
        if (!ctx) return;

        if (this.charts.services) this.charts.services.destroy();

        const serviceData = {};
        bookings.forEach(b => {
            const serviceId = b.service || 'unknown';
            serviceData[serviceId] = (serviceData[serviceId] || 0) + 1;
        });

        const labels = Object.keys(serviceData).map(id => {
            const service = this.getServiceById(id);
            return service?.name || id;
        });

        this.charts.services = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Bookings',
                    data: Object.values(serviceData),
                    backgroundColor: '#ff6b35',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    renderTherapistsChart(bookings) {
        const ctx = document.getElementById('chart-therapists');
        if (!ctx) return;

        if (this.charts.therapists) this.charts.therapists.destroy();

        const therapistData = {};
        bookings.forEach(b => {
            const tid = b.therapistId || 'unassigned';
            therapistData[tid] = (therapistData[tid] || 0) + 1;
        });

        const labels = Object.keys(therapistData).map(id => {
            if (id === 'unassigned') return 'Unassigned';
            const therapist = this.getTherapistById(id);
            return therapist?.name?.split(' ')[0] || id;
        });

        this.charts.therapists = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Bookings',
                    data: Object.values(therapistData),
                    backgroundColor: '#0a1628',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    renderTrendChart(bookings) {
        const ctx = document.getElementById('chart-trend');
        if (!ctx) return;

        if (this.charts.trend) this.charts.trend.destroy();

        // Group by week
        const weekData = {};
        bookings.forEach(b => {
            const created = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            const weekStart = this.getWeekStart(created);
            const weekKey = this.formatDateStr(weekStart);
            weekData[weekKey] = (weekData[weekKey] || 0) + 1;
        });

        // Sort weeks and get last N weeks
        const sortedWeeks = Object.keys(weekData).sort();
        const displayWeeks = sortedWeeks.slice(-12);

        const labels = displayWeeks.map(w => {
            const d = new Date(w);
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        });

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Bookings',
                    data: displayWeeks.map(w => weekData[w] || 0),
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b35'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    // ============ NOTIFICATIONS METHODS ============

    startNotificationListener() {
        // Listen for new bookings in real-time
        try {
            this.notificationUnsubscribe = this.db.collection('bookings')
                .where('status', '==', 'pending')
                .orderBy('createdAt', 'desc')
                .limit(20)
                .onSnapshot((snapshot) => {
                    const newBookings = [];
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data();
                            const created = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);

                            // Only add if created after lastSeenTime
                            if (created > this.lastSeenTime) {
                                newBookings.push({
                                    id: change.doc.id,
                                    ...data,
                                    isNew: true
                                });
                            }
                        }
                    });

                    if (newBookings.length > 0) {
                        this.notifications = [...newBookings, ...this.notifications].slice(0, 20);
                        this.renderNotifications();
                        // Reload bookings list to show new entries (no loading indicator)
                        this.loadBookings(false);
                    }

                    // Initial load - show pending bookings as notifications
                    if (this.notifications.length === 0) {
                        this.notifications = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            isNew: doc.data().createdAt?.toDate ?
                                doc.data().createdAt.toDate() > this.lastSeenTime : false
                        }));
                        this.renderNotifications();
                    }
                }, (error) => {
                    console.error('Notification listener error:', error);
                });
        } catch (error) {
            console.error('Error setting up notification listener:', error);
        }
    }

    renderNotifications() {
        const badge = document.getElementById('notification-badge');
        const list = document.getElementById('notification-list');
        if (!badge || !list) return;

        const unreadCount = this.notifications.filter(n => n.isNew).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }

        if (this.notifications.length === 0) {
            list.innerHTML = '<p class="notification-empty">No pending bookings</p>';
            return;
        }

        list.innerHTML = this.notifications.map(n => {
            const created = n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt);
            const timeAgo = this.getTimeAgo(created);
            const service = this.getServiceById(n.service);

            return `
                <div class="notification-item ${n.isNew ? 'unread' : ''}" data-booking-id="${n.id}">
                    <div class="notification-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${this.escapeHtml(n.clientName || n.name)}</div>
                        <div class="notification-text">${service?.name || n.service}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const bookingId = item.dataset.bookingId;
                this.showBookingDetails(bookingId);
                document.getElementById('notification-dropdown').classList.add('hidden');
            });
        });
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    markAllNotificationsRead() {
        this.lastSeenTime = new Date();
        localStorage.setItem('adminLastSeenTime', this.lastSeenTime.toISOString());
        this.notifications = this.notifications.map(n => ({ ...n, isNew: false }));
        this.renderNotifications();
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

    // ============ STATISTICS METHODS ============

    populateStatisticsTherapistFilter() {
        const select = document.getElementById('stats-therapist');
        if (!select) return;

        select.innerHTML = '<option value="all">All Therapists</option>';
        this.therapists.forEach(t => {
            if (t.isActive !== false) {
                select.innerHTML += `<option value="${t.id}">${t.name}</option>`;
            }
        });
    }

    renderStatistics() {
        const period = document.getElementById('stats-period')?.value || '2026-01';
        const viewType = document.getElementById('stats-view-type')?.value || 'monthly';
        const therapistId = document.getElementById('stats-therapist')?.value || 'all';

        const container = document.getElementById('statistics-container');
        if (!container) return;

        // Get bookings for the selected period
        const [year, month] = period.split('-').map(Number);
        const periodBookings = this.bookings.filter(b => {
            if (!b.date) return false;
            const bookingDate = new Date(b.date);
            return bookingDate.getFullYear() === year && bookingDate.getMonth() + 1 === month;
        });

        // Filter by therapist if selected
        const filteredBookings = therapistId === 'all'
            ? periodBookings
            : periodBookings.filter(b => b.therapistId === therapistId);

        if (viewType === 'monthly') {
            this.renderMonthlyStatistics(container, filteredBookings, therapistId, period);
        } else if (viewType === 'weekly') {
            this.renderWeeklyStatistics(container, filteredBookings, therapistId, period);
        } else {
            this.renderDailyStatistics(container, filteredBookings, therapistId, period);
        }
    }

    renderMonthlyStatistics(container, bookings, therapistId, period) {
        const therapists = therapistId === 'all'
            ? this.therapists.filter(t => t.isActive !== false)
            : [this.getTherapistById(therapistId)].filter(Boolean);

        let html = '';

        therapists.forEach(therapist => {
            const therapistBookings = bookings.filter(b => b.therapistId === therapist.id);

            // Calculate statistics
            const stats = this.calculateTherapistStats(therapistBookings);

            html += `
                <div class="stat-report-card">
                    <div class="report-header">
                        <h3>${therapist.name}</h3>
                        <span class="report-period">${this.formatPeriodLabel(period)}</span>
                    </div>
                    <div class="report-grid">
                        <div class="report-metric">
                            <div class="metric-label">Total Sessions</div>
                            <div class="metric-value">${stats.totalSessions}</div>
                        </div>
                        <div class="report-metric">
                            <div class="metric-label">Total Earnings</div>
                            <div class="metric-value">€${stats.totalEarnings}</div>
                        </div>
                        <div class="report-metric">
                            <div class="metric-label">GESY New</div>
                            <div class="metric-value">${stats.gesyNew} (€${stats.gesyNewEarnings})</div>
                        </div>
                        <div class="report-metric">
                            <div class="metric-label">GESY Returning</div>
                            <div class="metric-value">${stats.gesyOld} (€${stats.gesyOldEarnings})</div>
                        </div>
                        <div class="report-metric">
                            <div class="metric-label">Private</div>
                            <div class="metric-value">${stats.private} (€${stats.privateEarnings})</div>
                        </div>
                    </div>
                    <div class="report-breakdown">
                        <h4>Location Breakdown</h4>
                        <div class="location-stats">
                            <div class="location-item">
                                <span>Gym Sector</span>
                                <span>${stats.gym} sessions (€${stats.gymEarnings})</span>
                            </div>
                            <div class="location-item">
                                <span>Physio Room</span>
                                <span>${stats.physio} sessions (€${stats.physioEarnings})</span>
                            </div>
                            <div class="location-item">
                                <span>Home-care</span>
                                <span>${stats.home} sessions (€${stats.homeEarnings})</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p style="text-align: center; color: #666; padding: 40px;">No data for selected period</p>';
    }

    renderWeeklyStatistics(container, bookings, therapistId, period) {
        // Group bookings by week
        const weekGroups = {};
        bookings.forEach(b => {
            const date = new Date(b.date);
            const weekStart = this.getWeekStart(date);
            const weekKey = this.formatDateStr(weekStart);
            if (!weekGroups[weekKey]) weekGroups[weekKey] = [];
            weekGroups[weekKey].push(b);
        });

        const therapists = therapistId === 'all'
            ? this.therapists.filter(t => t.isActive !== false)
            : [this.getTherapistById(therapistId)].filter(Boolean);

        let html = '<div class="weekly-reports">';

        Object.keys(weekGroups).sort().forEach(weekKey => {
            const weekBookings = weekGroups[weekKey];
            const weekEnd = new Date(weekKey);
            weekEnd.setDate(weekEnd.getDate() + 6);

            html += `<div class="week-report"><h3>Week: ${this.formatDateStr(new Date(weekKey))} - ${this.formatDateStr(weekEnd)}</h3>`;

            therapists.forEach(therapist => {
                const therapistWeekBookings = weekBookings.filter(b => b.therapistId === therapist.id);
                if (therapistWeekBookings.length === 0) return;

                const stats = this.calculateTherapistStats(therapistWeekBookings);

                html += `
                    <div class="therapist-week-summary">
                        <h4>${therapist.name}</h4>
                        <div class="week-stats-inline">
                            <span><strong>${stats.totalSessions}</strong> sessions</span>
                            <span><strong>€${stats.totalEarnings}</strong> total</span>
                            <span>GESY New: ${stats.gesyNew} (€${stats.gesyNewEarnings})</span>
                            <span>GESY Old: ${stats.gesyOld} (€${stats.gesyOldEarnings})</span>
                            <span>Private: ${stats.private} (€${stats.privateEarnings})</span>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        });

        html += '</div>';
        container.innerHTML = html || '<p style="text-align: center; color: #666; padding: 40px;">No data for selected period</p>';
    }

    renderDailyStatistics(container, bookings, therapistId, period) {
        // Group bookings by day
        const dayGroups = {};
        bookings.forEach(b => {
            const dayKey = b.date;
            if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
            dayGroups[dayKey].push(b);
        });

        let html = '<div class="daily-reports">';

        Object.keys(dayGroups).sort().forEach(dayKey => {
            const dayBookings = dayGroups[dayKey];
            const date = new Date(dayKey);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            html += `
                <div class="day-report">
                    <h3>${dayName}, ${this.formatDateStr(date)}</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Client</th>
                                <th>Therapist</th>
                                <th>Payment</th>
                                <th>Location</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            dayBookings.forEach(b => {
                const therapist = this.getTherapistById(b.therapistId);
                html += `
                    <tr>
                        <td>${b.timeSlot || 'N/A'}</td>
                        <td>${b.clientName}</td>
                        <td>${therapist?.name || 'N/A'}</td>
                        <td>${this.getPaymentTypeLabel(b.paymentType)}</td>
                        <td>${this.getLocationLabel(b.location)}</td>
                        <td>€${b.price || 0}</td>
                    </tr>
                `;
            });

            const dayStats = this.calculateTherapistStats(dayBookings);
            html += `
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: bold; background: #f5f5f5;">
                                <td colspan="5">Day Total</td>
                                <td>€${dayStats.totalEarnings} (${dayStats.totalSessions} sessions)</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html || '<p style="text-align: center; color: #666; padding: 40px;">No data for selected period</p>';
    }

    calculateTherapistStats(bookings) {
        const stats = {
            totalSessions: bookings.length,
            totalEarnings: 0,
            gesyNew: 0,
            gesyNewEarnings: 0,
            gesyOld: 0,
            gesyOldEarnings: 0,
            private: 0,
            privateEarnings: 0,
            gym: 0,
            gymEarnings: 0,
            physio: 0,
            physioEarnings: 0,
            home: 0,
            homeEarnings: 0
        };

        bookings.forEach(b => {
            const price = b.price || 0;
            stats.totalEarnings += price;

            // Payment type stats
            if (b.paymentType === 'gesy-new') {
                stats.gesyNew++;
                stats.gesyNewEarnings += price;
            } else if (b.paymentType === 'gesy-old' || b.paymentType === 'gesy') {
                stats.gesyOld++;
                stats.gesyOldEarnings += price;
            } else if (b.paymentType === 'private') {
                stats.private++;
                stats.privateEarnings += price;
            }

            // Location stats
            if (b.location === 'gym') {
                stats.gym++;
                stats.gymEarnings += price;
            } else if (b.location === 'physio') {
                stats.physio++;
                stats.physioEarnings += price;
            } else if (b.location === 'home') {
                stats.home++;
                stats.homeEarnings += price;
            }
        });

        return stats;
    }

    formatPeriodLabel(period) {
        const [year, month] = period.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // ============ IMPORT HISTORICAL DATA ============

    async importHistoricalData(filename, weekNumber) {
        const btnIds = {
            2: 'import-historical-btn',
            3: 'import-week3-btn',
            4: 'import-week4-btn'
        };
        const btn = document.getElementById(btnIds[weekNumber]);
        if (!btn) return;

        // Confirm before importing
        const weekLabels = {
            2: '6-11 Jan 2026, 24 bookings',
            3: '12-16 Jan 2026, 38 bookings',
            4: '19-25 Jan 2026, 50 bookings'
        };

        if (!confirm(`Import January Week ${weekNumber} (${weekLabels[weekNumber]})?\n\nThis will add data to the database.`)) {
            return;
        }

        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Importing...';

        try {
            // Fetch the JSON file
            const response = await fetch(`/assets/data/${filename}`);
            if (!response.ok) {
                throw new Error('Failed to load historical data file');
            }

            const data = await response.json();
            let importedCount = 0;
            let errors = 0;

            // Import each booking
            for (const dayData of data.bookings) {
                for (const session of dayData.sessions) {
                    try {
                        const bookingData = {
                            clientName: session.clientName,
                            phone: session.phone,
                            email: null,
                            service: session.service,
                            therapistId: dayData.therapistId,
                            date: dayData.date,
                            timeSlot: session.timeSlot,
                            source: session.source,
                            paymentType: session.paymentType,
                            location: session.location,
                            price: session.price,
                            notes: session.notes || `Imported from historical data - Week ${weekNumber}, Jan 2026`,
                            bookingType: 'appointment',
                            status: session.status,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            createdBy: 'admin-import'
                        };

                        await this.db.collection('bookings').add(bookingData);
                        importedCount++;
                    } catch (error) {
                        console.error('Error importing session:', session, error);
                        errors++;
                    }
                }
            }

            // Reload bookings and show success message
            await this.loadBookings();
            this.renderStatistics();

            const message = errors > 0
                ? `Week ${weekNumber}: Imported ${importedCount} bookings with ${errors} errors`
                : `Week ${weekNumber}: Successfully imported ${importedCount} bookings!`;

            this.showToast(message, errors > 0 ? 'warning' : 'success');

            // Disable button after successful import
            btn.disabled = true;
            btn.innerHTML = 'Imported';

        } catch (error) {
            console.error('Error importing historical data:', error);
            this.showToast('Error importing data: ' + error.message, 'error');
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
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
