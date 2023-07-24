// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCHvhqeR8rBHfKWdJyTXOZYFcNGhSGkVcI',
  authDomain: 'kara2-1c59f.firebaseapp.com',
  databaseURL: 'https://kara2-1c59f-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'kara2-1c59f',
  storageBucket: 'kara2-1c59f.appspot.com',
  messagingSenderId: '763771171645',
  appId: '1:763771171645:web:ab98f55596298eef568b54',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
