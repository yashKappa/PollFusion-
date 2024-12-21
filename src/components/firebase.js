// Import the necessary functions from Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; // Import auth methods

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvljnhpUf_-HAwSNtJ8ij7wdTwgMPPEdU",
  authDomain: "portfolio-10d95.firebaseapp.com",
  projectId: "portfolio-10d95",
  storageBucket: "portfolio-10d95.appspot.com",
  messagingSenderId: "185516353773",
  appId: "1:185516353773:web:aad2d51bbe4dc9a17084e4",
  measurementId: "G-J5J3J4GPYS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app); // Firestore
export const auth = getAuth(app); // Firebase Authentication
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
export { signInWithPopup, signOut }; // Export signInWithPopup and signOut
const analytics = getAnalytics(app); // Analytics (optional)
