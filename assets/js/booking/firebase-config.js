// Firebase Configuration for Right Track Booking System
const firebaseConfig = {
    apiKey: "AIzaSyACv0o8NPh52XBoEuAyNuuE8IzjVb2zNvE",
    authDomain: "righttrack-booking-167c6.firebaseapp.com",
    projectId: "righttrack-booking-167c6",
    storageBucket: "righttrack-booking-167c6.firebasestorage.app",
    messagingSenderId: "550244482545",
    appId: "1:550244482545:web:4e73995eb699a8acd4d850",
    measurementId: "G-XQT03Q3821"
};

// Initialize Firebase
let app, db, auth;

async function initializeFirebase() {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth };
}

export { initializeFirebase, firebaseConfig };
