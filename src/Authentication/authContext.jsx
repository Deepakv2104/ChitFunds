import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { firebase } from './firebase';

const AuthContext = createContext();
const auth = getAuth(firebase);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log("Current user:", user); 
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, signOut: handleSignOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
