import { createContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';

import Router from 'next/router';
import firebase from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (currentUser) => {
    if (currentUser) {
      const formatedUser = await formatUser(currentUser);
      setSession(true);
      setUser(formatedUser);
      return formatedUser;
    }
    setSession(false);
    setUser(false);
    return false;
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
    return () => unsubscribe();
  }, []);

  const formatUser = async (user) => {
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      token: user.za,
      provider: user.providerData[0].providerId,
      photoUrl: user.photoURL,
    };
  }

  const setSession = async (session) => {
    if (session) {
      cookie.set('rs-sp', session, {
        expires: 1,
      });
    } else {
      cookie.remove('rs-sp');
    }
  }

  const signin = async () => {
    try {
      setLoading(true);
      const response = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
      handleUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  const signout = async () => {
    try {
      Router.push('/');
      await firebase.auth().signOut();
      handleUser(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signin,
      signout,
    }}>{children}</AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
