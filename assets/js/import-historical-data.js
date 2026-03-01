// One-time script to import all historical data into Firebase
// Run this once from browser console by loading this file

async function importAllHistoricalData() {
    console.log('Starting historical data import...');

    try {
        // Fetch the combined data file
        const response = await fetch('/assets/data/january-2026-complete.json');
        if (!response.ok) {
            throw new Error('Failed to load data file');
        }

        const data = await response.json();
        let importedCount = 0;
        let errors = 0;

        console.log(`Found ${data.bookings.length} days of bookings to import...`);

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

                    await firebase.firestore().collection('bookings').add(bookingData);
                    importedCount++;

                    if (importedCount % 10 === 0) {
                        console.log(`Imported ${importedCount} bookings...`);
                    }
                } catch (error) {
                    console.error('Error importing session:', session, error);
                    errors++;
                }
            }
        }

        console.log(`✓ Import complete!`);
        console.log(`  - Successfully imported: ${importedCount} bookings`);
        if (errors > 0) {
            console.log(`  - Errors: ${errors}`);
        }
        console.log('\nPlease refresh the admin page to see the imported data.');

    } catch (error) {
        console.error('Fatal error during import:', error);
    }
}

// Auto-run if loaded in admin context
if (typeof firebase !== 'undefined' && firebase.firestore) {
    console.log('Firebase detected. Ready to import.');
    console.log('Run: importAllHistoricalData()');
} else {
    console.log('Please load this script from the admin page where Firebase is initialized.');
}
