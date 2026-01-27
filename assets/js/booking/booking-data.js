// Booking System Data - Services & Therapists Configuration

const SERVICES = [
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

const THERAPISTS = [
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

const BOOKING_SETTINGS = {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: {
        start: '08:00',
        end: '20:00'
    },
    slotDuration: 60, // minutes
    advanceBookingDays: 30,
    timezone: 'Europe/Nicosia'
};

// Helper functions
function getServiceById(id) {
    return SERVICES.find(s => s.id === id);
}

function getTherapistById(id) {
    return THERAPISTS.find(t => t.id === id);
}

function getTherapistsForService(serviceId) {
    return THERAPISTS.filter(t => t.isActive && t.services.includes(serviceId));
}

function getServicesForTherapist(therapistId) {
    const therapist = getTherapistById(therapistId);
    if (!therapist) return [];
    return SERVICES.filter(s => therapist.services.includes(s.id));
}

export {
    SERVICES,
    THERAPISTS,
    BOOKING_SETTINGS,
    getServiceById,
    getTherapistById,
    getTherapistsForService,
    getServicesForTherapist
};
