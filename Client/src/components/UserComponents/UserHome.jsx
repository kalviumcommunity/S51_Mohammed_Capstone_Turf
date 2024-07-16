import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const UserHome = () => {
  const location = useLocation();
  const { name, userLocation } = location.state || {};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-72 bg-white p-6 shadow-md">
        <div className="mb-8">
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Home</button>
          <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">About</button>
          <NavLink to="/ownerHome">
            <button className="w-full py-4 px-4 text-left text-lg hover:bg-gray-200">Upload your turf</button>
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
            {/* Your content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
