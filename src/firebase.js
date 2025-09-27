import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMO'
};

// Initialize Firebase only if we have real config
let app, auth, db, analytics;

try {
    if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-key') {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        auth.useDeviceLanguage();
        db = getFirestore(app);
        analytics = getAnalytics(app);
    } else {
        console.log('Firebase not configured - running in demo mode');
    }
} catch (error) {
    console.log('Firebase initialization failed - running in demo mode:', error);
}

// Export with fallbacks
export { auth, db, analytics };

// Export additional auth methods
export { signInWithPopup, GoogleAuthProvider, signOut };

// Analytics helper with fallbacks
export const Analytics = {
    logPageView: (pagePath) => {
        if (analytics) {
            logEvent(analytics, 'page_view', {
                page_path: pagePath
            });
        } else {
            console.log('Analytics: page_view', pagePath);
        }
    },
    logUserEvent: (eventName, params = {}) => {
        if (analytics) {
            logEvent(analytics, eventName, params);
        } else {
            console.log('Analytics:', eventName, params);
        }
    },
    events: {
        userLogin: (method) => {
            if (analytics) {
                logEvent(analytics, 'login', { method });
            } else {
                console.log('Analytics: login', { method });
            }
        },
        eventRegistration: (eventName) => {
            if (analytics) {
                logEvent(analytics, 'event_registration', { event_name: eventName });
            } else {
                console.log('Analytics: event_registration', { event_name: eventName });
            }
        }
    }
};

// Function to create/update user profile
export const createUserProfile = async (user) => {
    if (!user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    const email = user.email;
    const emailDomain = email.split('@')[1];

    const userData = {
        email: email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        role: 'user',
        institution: 'IITM'
    };

    try {
        await setDoc(userRef, userData, { merge: true });
        console.log('User profile created/updated successfully');
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export { app };