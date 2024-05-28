import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth , setPersistence, browserSessionPersistence, GoogleAuthProvider } from "firebase/auth";
import {getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA8R5Z8aqUfSqDVgXCLp-ew-l2FxEOhOM",
  authDomain: "chitfunds-b98e0.firebaseapp.com",
  projectId: "chitfunds-b98e0",
  storageBucket: "chitfunds-b98e0.appspot.com",
  messagingSenderId: "947012840849",
  appId: "1:947012840849:web:7e4849a907ae3f334cbe30",
  measurementId: "G-0WWH4K4WCM"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const analytics = getAnalytics(firebase);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider(auth);
const storage = getStorage(firebase);
const messaging = getMessaging(firebase);
setPersistence(auth, browserSessionPersistence);

export { firebase, db, auth, googleProvider, storage, messaging };