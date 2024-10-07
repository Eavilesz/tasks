// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDZeRmSNR69pjDl0kH7oP1JP_5Eto3_EMU',
  authDomain: 'tasks-71c4c.firebaseapp.com',
  projectId: 'tasks-71c4c',
  storageBucket: 'tasks-71c4c.appspot.com',
  messagingSenderId: '597780712043',
  appId: '1:597780712043:web:183a349b62bb4db2537f2e',
  measurementId: 'G-ZSZZ186LQC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
