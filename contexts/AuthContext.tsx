import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { IAuthContext, ICurrent } from '../interfaces/IAuth'

export const AuthContext = React.createContext<IAuthContext | null>(null)

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<ICurrent>({
    uid: "",
    email: "",
  });
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function signUp(email: string, password: string) {
    return await auth.createUserWithEmailAndPassword(email, password);
  }

  async function logIn(email: string, password: string) {
    return await auth.signInWithEmailAndPassword(email, password);
  }

  async function signOut() {
    return await auth.signOut();
  }
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false)
      if (user === null || user.uid === null || user.email === null) {
        setCurrentUser({
          ...currentUser,
          uid: "waiting...",
          email: "waiting...",
        });
      } else {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
        });}
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    username,
    setUsername,
    email,
    setEmail,
    signUp,
    logIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>);
}

type Props = {
  children: JSX.Element,
}
