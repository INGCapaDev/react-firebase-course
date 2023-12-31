import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useEffect } from 'react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user.email);
      else setCurrentUser('No user');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <input
        type='email'
        placeholder='Email...'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password...'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={logOut}>Log Out</button>
      <h1>{currentUser}</h1>
    </>
  );
};
export default Auth;
