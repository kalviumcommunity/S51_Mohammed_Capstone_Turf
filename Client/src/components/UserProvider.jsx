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
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      const accountDetails = await account.get();
      setUser(accountDetails);
      Cookies.set('email', userInfo.email);
      toast.success("Login successful");
      navigate('/userHome');
    } catch (error) {
      console.log("Login failed", error.message);
      toast.error("Login failed");
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    if (!user) {
      console.log("No user is currently logged in.");
      toast.error("No user is currently logged in.");
      return;
    }

    try {
      await account.deleteSession('current');
      setUser(null);
      Cookies.remove('email');
      toast.success("Logout successful");
      navigate('/');
    } catch (error) {
      console.log("Logout error:", error.message);
      if (error.code === 401) {
        console.log("Session not found or already logged out.");
        toast.error("Session not found or already logged out.");
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
      await account.create(ID.unique(), userInfo.email, userInfo.password);
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      const accountDetails = await account.get();
      setUser(accountDetails);
      Cookies.set('email', userInfo.email);
      toast.success("Signup successful");
      navigate('/userHome');
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    }
    setLoading(false);
  };

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
    loginUser,
    logoutUser,
    signupUser,
    checkUserStatus,
  };

  return (
    <UserContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
