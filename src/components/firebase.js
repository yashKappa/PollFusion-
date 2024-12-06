// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCvljnhpUf_-HAwSNtJ8ij7wdTwgMPPEdU",
  authDomain: "portfolio-10d95.firebaseapp.com",
  projectId: "portfolio-10d95",
  storageBucket: "portfolio-10d95.appspot.com",
  messagingSenderId: "185516353773",
  appId: "1:185516353773:web:aad2d51bbe4dc9a17084e4",
  measurementId: "G-J5J3J4GPYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
