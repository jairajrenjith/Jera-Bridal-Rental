// Firebase project setup for Jera Bridal Rental.
// Replaces the old Google Sheets + Apps Script backend. Firestore
// mirrors the old sheet structure 1:1:
//   "collections" doc collection  ↔  old "Collections" sheet tab
//   "bookings" doc collection     ↔  old "Bookings" sheet tab
// (Analytics is left out on purpose — nothing in the app needs it,
// and it just adds weight to the bundle.)
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
