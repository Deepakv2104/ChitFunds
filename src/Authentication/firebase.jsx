// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth , setPersistence, browserSessionPersistence} from "firebase/auth";
import {getMessaging } from 'firebase/messaging';
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD9M_c2YHON8qaFZuFet7Tcx2jE6zQFKm8",
    authDomain: "chitfunds-aba77.firebaseapp.com",
    projectId: "chitfunds-aba77",
    storageBucket: "chitfunds-aba77.appspot.com",
    messagingSenderId: "448835297957",
    appId: "1:448835297957:web:557d5c1a97ac0ffe15a34c",
    measurementId: "G-0N4SYWYHW6"
  };
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const analytics = getAnalytics(firebase);
// const auth = getAuth(firebase);
// const googleProvider = new GoogleAuthProvider(auth);
const storage = getStorage(firebase);
const messaging = getMessaging(firebase);
// setPersistence(auth, browserSessionPersistence)
export  {firebase,db};