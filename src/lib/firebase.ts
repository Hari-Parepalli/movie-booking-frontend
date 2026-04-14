import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (same as backend)
const firebaseConfig = {
  apiKey: "AIzaSyCSkbq2GeVw-9bEgD0YJSrVdPfhI2r74gc",
  authDomain: "reel-booking.firebaseapp.com",
  projectId: "reel-booking",
  storageBucket: "reel-booking.firebasestorage.app",
  messagingSenderId: "471598037681",
  appId: "1:471598037681:web:38c93bc40f8a90677d4090",
  measurementId: "G-4DCMVDZXN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
