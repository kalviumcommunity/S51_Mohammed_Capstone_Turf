// UserProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from './appwriteConfig';
import { ID } from 'appwrite';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
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
      toast.success("Login successful");
      navigate('/'); 
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
      console.log("Logging out...");
      await account.deleteSession('current');
      console.log("Session deleted");
      setUser(null);
      navigate('/');
      toast.success("Logout successful");
    } catch (error) {
      if (error.code === 401) {
        console.log("Session not found or already logged out.");
        toast.error("Session not found or already logged out.");
        setUser(null);
        navigate('/login');
      } else {
        console.error("Logout failed", error.message);
        toast.error("Logout failed");
      }
    }
  };

  const signupUser = async (userInfo) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), userInfo.email, userInfo.password);
      setUser(true);
      toast.success("Signup successful");
      navigate('/logout');
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error("Signup failed");
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
    checkUserStatus
  };

  return (
    <UserContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
