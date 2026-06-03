import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnyQv8zU4yYJ_7mcX4GkspDyDubhdLIVg",
  authDomain: "bellavista-eb032.firebaseapp.com",
  projectId: "bellavista-eb032",
  storageBucket: "bellavista-eb032.firebasestorage.app",
  messagingSenderId: "460700843913",
  appId: "1:460700843913:web:f16e36a4023e4ac0a4ab58",
  measurementId: "G-DM4RQ4ZL7F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export app for future use
export default app;