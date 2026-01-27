// Time Slots Component for Right Track Booking System

import { BOOKING_SETTINGS } from './booking-data.js';

class TimeSlots {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.selectedSlot = null;
        this.unavailableSlots = [];
        this.onSlotSelect = options.onSlotSelect || (() => {});
        this.language = options.language || 'en';

        this.labels = {
            en: {
                title: 'Select a Time',
                available: 'Available',
                unavailable: 'Unavailable'
            },
            el: {
                title: 'Επιλέξτε Ώρα',
                available: 'Διαθέσιμο',
                unavailable: 'Μη διαθέσιμο'
            }
        };
    }

    generateSlots() {
        const slots = [];
        const [startHour] = BOOKING_SETTINGS.workingHours.start.split(':').map(Number);
        const [endHour] = BOOKING_SETTINGS.workingHours.end.split(':').map(Number);
        const duration = BOOKING_SETTINGS.slotDuration;

        for (let hour = startHour; hour < endHour; hour++) {
            const timeStr = `${String(hour).padStart(2, '0')}:00`;
            slots.push(timeStr);
        }

        return slots;
    }

    render(date = null) {
        if (!date) {
            this.container.innerHTML = '';
            return;
        }

        const slots = this.generateSlots();
        const labels = this.labels[this.language];

        this.container.innerHTML = `
            <h4 class="time-slots-title">${labels.title}</h4>
            <div class="time-slots-grid">
                ${slots.map(slot => this.renderSlot(slot)).join('')}
            </div>
        `;

        this.attachEventListeners();
    }

    renderSlot(time) {
        const isUnavailable = this.unavailableSlots.includes(time);
        const isSelected = this.selectedSlot === time;

        let classes = ['time-slot'];
        if (isUnavailable) classes.push('unavailable');
        if (isSelected) classes.push('selected');

        const hour = parseInt(time.split(':')[0]);
        const displayTime = this.formatTime(hour);

        return `
            <button class="${classes.join(' ')}"
                    data-time="${time}"
                    ${isUnavailable ? 'disabled' : ''}>
                ${displayTime}
            </button>
        `;
    }

    formatTime(hour) {
        // 24-hour format for Cyprus
        return `${String(hour).padStart(2, '0')}:00`;
    }

    attachEventListeners() {
        this.container.querySelectorAll('.time-slot:not(.unavailable)').forEach(slot => {
            slot.addEventListener('click', (e) => {
                const time = e.target.dataset.time;
                this.selectSlot(time);
            });
        });
    }

    selectSlot(time) {
        this.selectedSlot = time;

        // Update UI
        this.container.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
            if (slot.dataset.time === time) {
                slot.classList.add('selected');
            }
        });

        this.onSlotSelect(time);
    }

    setUnavailableSlots(slots) {
        this.unavailableSlots = slots || [];
    }

    getSelectedSlot() {
        return this.selectedSlot;
    }

    clearSelection() {
        this.selectedSlot = null;
        this.container.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
    }

    setLanguage(lang) {
        this.language = lang;
    }
}

export { TimeSlots };
