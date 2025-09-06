// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-6e5f2.firebaseapp.com",
  projectId: "reactchatapp-6e5f2",
  storageBucket: "reactchatapp-6e5f2.firebasestorage.app",
  messagingSenderId: "888322804700",
  appId: "1:888322804700:web:9f98900736730d81a5dd19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app)
export const db = getFirestore(app)