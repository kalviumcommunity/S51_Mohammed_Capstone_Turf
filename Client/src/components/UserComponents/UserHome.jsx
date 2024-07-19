import React, { useEffect } from 'react';
import { useAuth } from '../UserProvider';
import { NavLink } from 'react-router-dom';

const UserHome = () => {
  const { logoutUser, checkUserStatus } = useAuth();

  const handleLogout = async () => {
    try {
      await checkUserStatus();
      await logoutUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <nav className="w-72 bg-black p-6 shadow-md">
        <div className="mb-8 bg-black" >
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Home</button>
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">About</button>
          <button onClick={handleLogout} className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Logout</button>
          <NavLink to="/ownerHome">
            <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Upload your turf</button>
          </NavLink>
          <NavLink to="/yourturf">
            <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Your turfs</button>
          </NavLink>
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Feedback</button>
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Chat AI</button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <a href="/userHome" className="text-3xl font-bold">LOGO</a>
          <input
            placeholder="Search Turf by location"
            type="text"
            className="w-1/2 px-6 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
