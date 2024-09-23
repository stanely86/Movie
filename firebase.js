// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6pV2NYXm1Z2Q_XiBuyRdzZq1hcHVdBLw",
  authDomain: "moviedata-66a14.firebaseapp.com",
  projectId: "moviedata-66a14",
  storageBucket: "moviedata-66a14.appspot.com",
  messagingSenderId: "41536927339",
  appId: "1:41536927339:web:004caab24c8bd37a85e32e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };