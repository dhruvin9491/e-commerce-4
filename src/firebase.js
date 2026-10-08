import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAFaS_rrFrixnlkENHLaXq7-GixKzJraxE",
  authDomain: "shoplane-2b5b1.firebaseapp.com",
  projectId: "shoplane-2b5b1",
  storageBucket: "shoplane-2b5b1.firebasestorage.app",
  messagingSenderId: "371857946520",
  appId: "1:371857946520:web:2670f0861e86bf34389ded"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();