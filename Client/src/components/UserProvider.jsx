import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from './appwriteConfig'; 
import { ID } from 'appwrite'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      if (user){
        await account.deleteSession('current');
        setUser(null);
        Cookies.remove('email');
        Cookies.remove('userID')
      }
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      const accountDetails = await account.get();
      Cookies.set('userID', accountDetails.$id)
      // console.log(accountDetails.$id)
      setUser(accountDetails);
      Cookies.set('email', userInfo.email);
      toast("Login successful");
      navigate('/userHome');
    } catch (error) {
      console.log("Login failed", error.message);
      toast.error("We are unable to log you in. Might be because of poor connection, or server related issue. Try again later.");
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    if (!user) {
      console.log("No user is currently logged in.");
      toast.error("you cant logout without logging in");
      return;
    }

    try {
      await account.deleteSession('current');
      setUser(null);
      Cookies.remove('email');
      Cookies.remove('userID')
      toast("Logout successful");
      navigate('/');
    } catch (error) {
      console.log("Logout error:", error.message);
      toast.error("We are unable to log you out. Might be because of poor connection, or server related issue. Try again later.");

      if (error.code === 401) {
        console.log("Session not found or already logged out.");
        toast.error("");
        setUser(null);
        Cookies.remove('email');
        navigate('/');
      } else {
        toast.error("Logout failed");
      }
    }
  };

  const signupUser = async (userInfo) => {
    setLoading(true);
    try {
      if (user){
        await account.deleteSession('current');
        setUser(null);
        Cookies.remove('email');
        Cookies.remove('userID')
      }
      await account.create(ID.unique(), userInfo.email, userInfo.password);
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      const accountDetails = await account.get();
      // console.log(accountDetails.$id,"accdetails")
      Cookies.set('userID', accountDetails.$id)
      setUser(accountDetails);
      Cookies.set('email', userInfo.email);
      toast("Signup successful");
      navigate('/userHome');
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error("We are unable to sign you in. Might be because of poor connection, or server related issue. Try again later.");
    }
    setLoading(false);
  };

  const forgotPassword = async()=>{
    try {
      const promise = await createRecovery()
    } catch (error) {
      console.log(error);
    }
  }

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log("No active session found:", error.message);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    setUser,
    loginUser,
    logoutUser,
    signupUser,
    checkUserStatus,
  };

  return (
    <UserContext.Provider value={contextData}>
      {loading ? <p><span className="loading loading-spinner loading-lg"></span></p> : children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
