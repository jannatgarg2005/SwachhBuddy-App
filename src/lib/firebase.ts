import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (import.meta.env.DEV) {
    const missing = Object.entries(firebaseConfig)
        .filter(([, v]) => !v)
        .map(([k]) => k);
    if (missing.length > 0) {
        throw new Error(
            `[firebase.ts] Missing environment variables: ${missing.join(", ")}.\n` +
            `Copy .env.example to .env.local and fill in the values.`
        );
    }
}

const app = initializeApp(firebaseConfig);

let analytics;
try {
    analytics = getAnalytics(app);
} catch {
    // Analytics unavailable (ad-blockers, emulators) — non-fatal.
}

const auth = getAuth(app);
const db = getFirestore(app);


export { app, analytics, auth, db };