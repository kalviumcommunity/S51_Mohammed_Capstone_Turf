import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserProvider';

const Logout = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth(); 

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await logoutUser();
    console.log("Logout function executed");
  };

  return (
    <div>
      <button onClick={handleLogout} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
        Logout
      </button>
    </div>
  );
};

export default Logout;
