// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFzKoK8zDMdKD68emBFImOSTJfwFNg3tU",
  authDomain: "kara-backend.firebaseapp.com",
  projectId: "kara-backend",
  storageBucket: "kara-backend.appspot.com",
  messagingSenderId: "74834526449",
  appId: "1:74834526449:web:910434cca29a274bb76950",
  measurementId: "G-04NN4Z1PSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
