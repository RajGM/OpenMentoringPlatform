'use client'

import { createContext, useEffect, useState } from "react";
import { auth } from "@lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({'uid': "xNfgaNivZHczqi8N6l8MmxS7xJE2", 'username': 'test','id':'xNfgaNivZHczqi8N6l8MmxS7xJE2'});

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     setCurrentUser({ 'uid': "xNfgaNivZHczqi8N6l8MmxS7xJE2", 'username': 'test' });
  //     console.log({ 'uid': "xNfgaNivZHczqi8N6l8MmxS7xJE2", 'username': 'test' });
  //   });

  //   return () => {
  //     unsub();
  //   };
  // }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
