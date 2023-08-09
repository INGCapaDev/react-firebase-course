import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC8H2xwpw98xNvPSUHqS8EhRGtSWnDe7fY',
  authDomain: 'fir-course-a206b.firebaseapp.com',
  projectId: 'fir-course-a206b',
  storageBucket: 'fir-course-a206b.appspot.com',
  messagingSenderId: '846072944947',
  appId: '1:846072944947:web:2f38a986aa41b42a17c646',
  measurementId: 'G-TE3BRWSHJJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
