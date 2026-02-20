// ============================================================
//  firebase-config.js
//  Central Firebase configuration for the Chess Tournament App
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── SECURITY NOTICE ──────────────────────────────────────────
// 1. These keys are EXPOSED to the browser. This is normal for Firebase.
// 2. To SECURE your app, you MUST:
//    - Restrict this API Key in Google Cloud Console to only your domain.
//    - Set up Firestore Security Rules (see firestore.rules).
//    - Add your production domain to Firebase Auth -> Authorized Domains.
// ─────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey: "AIzaSyDM3pjej6rVcDoMqRdqc4vOPrRbRdG1RlU",
    authDomain: "chessblunder-62a1a.firebaseapp.com",
    projectId: "chessblunder-62a1a",
    storageBucket: "chessblunder-62a1a.firebasestorage.app",
    messagingSenderId: "534316384916",
    appId: "1:534316384916:web:5b7b3451563061f0f12a81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);   // Firestore database
export const auth = getAuth(app);      // Firebase Authentication
