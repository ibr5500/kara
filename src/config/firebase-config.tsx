// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDFzKoK8zDMdKD68emBFImOSTJfwFNg3tU',
  authDomain: 'kara-backend.firebaseapp.com',
  projectId: 'kara-backend',
  storageBucket: 'kara-backend.appspot.com',
  messagingSenderId: '74834526449',
  appId: '1:74834526449:web:910434cca29a274bb76950',
  measurementId: 'G-04NN4Z1PSP',
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyAbOIfxBodkUz8c_wxv1hgCTXMEAhGL2OA',
//   authDomain: 'kara-backend2.firebaseapp.com',
//   projectId: 'kara-backend2',
//   storageBucket: 'kara-backend2.appspot.com',
//   messagingSenderId: '544969739669',
//   appId: '1:544969739669:web:1f37b25ba7d6e556f1ba9c',
//   measurementId: 'G-RJQD1YFJRK',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
