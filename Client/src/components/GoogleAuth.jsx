import React from 'react';
import { Client, Account, OAuthProvider } from "appwrite";

const GoogleAuth = () => {
  const AppwriteId = import.meta.env.VITE_APPWRITE_ID;
  const AppwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

  const client = new Client()
    .setEndpoint(AppwriteEndpoint)
    .setProject(AppwriteId);

  const account = new Account(client);

  const handleGoogleLogin = async () => {
    try{
      account.createOAuth2Session(
        OAuthProvider.Google, 
        'http://localhost:5173/userform', 
        'http://localhost:5173/',
      );
    }
    catch(error){
      console.log(error.message)
    }


  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Google G</button>
    </div>
  );
};

export default GoogleAuth;
