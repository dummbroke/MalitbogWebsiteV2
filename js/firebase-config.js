// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYlHzhI7L5geFImp-cKfhrkfnJlte_z48",
  authDomain: "malitbog-website.firebaseapp.com",
  projectId: "malitbog-website",
  storageBucket: "malitbog-website.appspot.com",
  messagingSenderId: "1092010000000",
  appId: "1:1092010000000:web:0000000000000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Make Firebase services available globally
window.db = db;
window.storage = storage;

// Export the Firebase services
export { db, storage }; 