// Calendar Component for Right Track Booking System

import { BOOKING_SETTINGS } from './booking-data.js';

class BookingCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.busySlots = {};
        this.onDateSelect = options.onDateSelect || (() => {});
        this.language = options.language || 'en';

        this.monthNames = {
            en: ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'],
            el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
                 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']
        };

        this.dayNames = {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            el: ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
        };
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav prev" aria-label="Previous month">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <h3 class="calendar-title">${this.monthNames[this.language][month]} ${year}</h3>
                <button class="calendar-nav next" aria-label="Next month">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
            <div class="calendar-weekdays">
                ${this.dayNames[this.language].map(day => `<div class="weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
                ${this.renderDays(year, month)}
            </div>
        `;

        this.attachEventListeners();
    }

    renderDays(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + BOOKING_SETTINGS.advanceBookingDays);

        let html = '';

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const dayOfWeek = date.getDay();

            const isPast = date < today;
            const isTooFar = date > maxDate;
            const isWeekend = !BOOKING_SETTINGS.workingDays.includes(dayOfWeek);
            const isSelected = this.selectedDate === dateStr;
            const isToday = date.getTime() === today.getTime();

            let classes = ['calendar-day'];
            if (isPast || isTooFar || isWeekend) {
                classes.push('unavailable');
            } else {
                classes.push('available');
            }
            if (isSelected) classes.push('selected');
            if (isToday) classes.push('today');

            const disabled = isPast || isTooFar || isWeekend;

            html += `
                <div class="${classes.join(' ')}"
                     data-date="${dateStr}"
                     ${disabled ? 'aria-disabled="true"' : 'tabindex="0" role="button"'}>
                    ${day}
                </div>
            `;
        }

        return html;
    }

    attachEventListeners() {
        // Navigation
        this.container.querySelector('.calendar-nav.prev').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        this.container.querySelector('.calendar-nav.next').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        // Day selection
        this.container.querySelectorAll('.calendar-day.available').forEach(day => {
            day.addEventListener('click', (e) => {
                const dateStr = e.target.dataset.date;
                this.selectDate(dateStr);
            });

            day.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const dateStr = e.target.dataset.date;
                    this.selectDate(dateStr);
                }
            });
        });
    }

    selectDate(dateStr) {
        this.selectedDate = dateStr;
        this.render();
        this.onDateSelect(dateStr);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    setLanguage(lang) {
        this.language = lang;
        this.render();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    clearSelection() {
        this.selectedDate = null;
        this.render();
    }
}

export { BookingCalendar };
