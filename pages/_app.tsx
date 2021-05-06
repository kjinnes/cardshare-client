import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import '../styles/globals.css';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  return (
    <AuthProvider>
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    </AuthProvider>
  )
}

export default MyApp;
