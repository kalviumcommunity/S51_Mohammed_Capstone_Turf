import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {


  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleLogout} className="relative inline-flex items-center px-4 py-2 rounded-full hover:bg-indigo-700 hover:text-white transition duration-300 ease-in-out">Logout</button>

     
    </div>
  );
};

export default Home;
