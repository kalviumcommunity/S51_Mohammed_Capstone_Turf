import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../appwriteAuthentication/appwriteConfig'; 
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

  const clearSession = async () => {
    try {
      await account.deleteSession('current');
    } catch (err) {
      console.log("No session to clear or already cleared:", err.message);
    }
    setUser(null);
  };

  const loginUser = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      
      // We need the role from the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ (await account.createJWT()).jwt }`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const role = data.user.role;
        const jwt = await account.createJWT();
        Cookies.set('role', role);
        Cookies.set('userID', userData.$id);
        Cookies.set('jwt', jwt.jwt);
        
        if (role === 'owner') {
          navigate('/ownerHome');
        } else {
          navigate('/userHome');
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed", error.message);
      return { success: false, message: error.message };
    }
  };


  const signupUser = async ({ email, password, role }) => {
    setLoading(true);
    try {
      await clearSession(); 
      const appwriteUser = await account.create(ID.unique(), email, password); 
      await account.createEmailPasswordSession(email, password); 
      
      const jwt = await account.createJWT();
      
      // Register in our MongoDB backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt.jwt}`     
        },
        body: JSON.stringify({ 
          role,
          email: appwriteUser.email,
          userId: appwriteUser.$id 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Backend registration failed");
      }

      setUser(appwriteUser);
      Cookies.set('role', role);
      Cookies.set('userID', appwriteUser.$id);
      Cookies.set('jwt', jwt.jwt);

      toast.success("Welcome to the squad!");

      if (role === 'owner') {
        navigate('/ownerHome');
      } else {
        navigate('/userHome');
      }
      return { success: true };
    } catch (error) {
      console.error("Signup failed", error.message);
      toast.error(error.message || "Signup failed. Please try again.");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };


  const logoutUser = async () => {
    try {
      await clearSession();
      toast("Logout successful");
      navigate('/');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
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
      {loading ? <div className="text-center py-6">Loading...</div> : children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
