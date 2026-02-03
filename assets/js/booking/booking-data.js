// Booking System Data - Services & Therapists Configuration

const SERVICES = [
    {
        id: 'physiotherapy',
        name: 'General Physiotherapy',
        nameEl: 'Γενική Φυσιοθεραπεία',
        description: 'Back, Neck & Joint Pain, Neurological Rehab, Chronic Pain',
        pricing: {
            type: 'fixed',
            gesyPrice: 29,
            privatePrice: 35,
            display: 'GESY | Private - from €35',
            displayEl: 'ΓΕΣΥ | Ιδιωτικά - από €35'
        }
    },
    {
        id: 'athlete-rehab',
        name: 'Athlete-Centred Rehabilitation',
        nameEl: 'Αποκατάσταση Αθλητών',
        description: 'Return to Sport, Sports Injury Rehab, Performance Recovery',
        pricing: {
            type: 'fixed',
            gesyPrice: 29,
            privatePrice: 45,
            display: 'GESY | Private - from €45',
            displayEl: 'ΓΕΣΥ | Ιδιωτικά - από €45'
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
            display: 'Private Only | From €80/month',
            displayEl: 'Μόνο Ιδιωτικά | Από €80/μήνα'
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
            display: 'Private Only | From €250/month',
            displayEl: 'Μόνο Ιδιωτικά | Από €250/μήνα'
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
            display: 'GESY (+€15 travel) | Private - from €45',
            displayEl: 'ΓΕΣΥ (+€15 μετακίνηση) | Ιδιωτικά - από €45'
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
            display: 'Private Only | From €45',
            displayEl: 'Μόνο Ιδιωτικά | Από €45'
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
        services: ['physiotherapy', 'athlete-rehab', 'kids-physio', 'performance-training', 'homecare-physio', 'massage'],
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
        services: ['physiotherapy', 'athlete-rehab', 'kids-physio', 'performance-training', 'massage'],
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
