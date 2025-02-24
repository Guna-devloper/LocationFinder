import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDiXmVk-hmZ5gNFPFECYLNrm3rawZfuDZk",
    authDomain: "locato-com.firebaseapp.com",
    projectId: "locato-com",
    storageBucket: "locato-com.firebasestorage.app",
    messagingSenderId: "96711017666",
    appId: "1:96711017666:web:54e158456f4cc976f5675b",
    measurementId: "G-PLB2QKQX3S"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
