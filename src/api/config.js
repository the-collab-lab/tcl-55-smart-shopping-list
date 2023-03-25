import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyFwu4UAJmhesY_opDo2aOt3Y3P2wNJDc",
  authDomain: "tcl-55-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-55-smart-shopping-list",
  storageBucket: "tcl-55-smart-shopping-list.appspot.com",
  messagingSenderId: "895385167328",
  appId: "1:895385167328:web:776c86cd85fde3b1b23785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
