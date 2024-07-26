import React, { useEffect, useState } from 'react';
import { useAuth } from './UserProvider';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserHome = () => {
    const { logoutUser, checkUserStatus } = useAuth();
    const [allTurfs, setAllTurfs] = useState([]);
    const [openSelectedTurf, setOpenSelectedTurf] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? openSelectedTurf.turfImages.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === openSelectedTurf.turfImages.length - 1 ? 0 : prevIndex + 1));
    };

    const handleLogout = async () => {
        try {
            await checkUserStatus();
            await logoutUser();
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllTurfs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/getAllTurfs', { withCredentials: true });
            setAllTurfs(Array.isArray(response.data) ? response.data : []);
            console.log('All Turfs:', response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchAllTurfs();
    }, []);

    const handleSelectedTurf = (turf) => {
        setOpenSelectedTurf(turf)
    };

    const handleClosePopup = () => {
        setOpenSelectedTurf(null);
      };

    return (
        <div className="flex min-h-screen bg-black text-white">
            <nav className="w-72 bg-black p-6 shadow-md">
                <div className="mb-8 bg-black">
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
                    <div className="bg-gray-500 p-8 rounded shadow-md w-full max-w-4xl">
                        {allTurfs.length === 0 ? (
                            <div className="mt-10 text-center">
                                <p className="text-xl">No turfs found...</p>
                            </div>
                        ) : (
                            <div>
                                {allTurfs.map((turf, ind) => (
                                    <div key={ind}>
                                        <h1 className="">{turf.turfName}</h1>
                                        <h2>{turf.turfPrice}$</h2>
                                        <img
                                            onClick={() => handleSelectedTurf(turf)}
                                            src={turf.turfThumbnail ? `${turf.turfThumbnail}` : 'default-image-url'}
                                            alt={turf.turfName}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {openSelectedTurf && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 overflow-auto">
    <div className="bg-gray-800 rounded-lg w-full max-w-5xl h-full flex flex-col items-center justify-center p-4">
      <button
        onClick={handleClosePopup}
        className="absolute top-4 right-4 text-3xl text-white hover:text-gray-400"
      >
        &times;
      </button>
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full flex justify-center">
          <img
            src={openSelectedTurf.turfThumbnail}
            alt={openSelectedTurf.turfName}
            className="w-auto h-auto max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
        <div className="w-full flex items-center justify-center mt-4 relative">
          <button className="text-white text-3xl hover:text-gray-400 mr-4" onClick={handlePrevImage}>
            &lt;
          </button>
          <div className="relative w-full flex justify-center items-center">
            {openSelectedTurf.turfImages.map((image, index) => (
              <div key={index} className={`absolute flex flex-col items-center justify-center transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                <img
                  src={image}
                  alt={`Turf Image ${index + 1}`}
                  className="w-auto h-auto max-w-full max-h-96 object-contain rounded-lg"
                />
                <h2 className="absolute bottom-4 left-4 text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded">{index + 1}/{openSelectedTurf.turfImages.length}</h2>
              </div>
            ))}
          </div>
          <button className="text-white text-3xl hover:text-gray-400 ml-4" onClick={handleNextImage}>
            &gt;
          </button>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-4xl font-bold mb-2 text-white">{openSelectedTurf.turfName}</h2>
        </div>
        <div className="w-full max-w-3xl mx-auto text-center">
          <p className="text-lg mb-2 text-white"><strong>Contact:</strong> {openSelectedTurf.ownerContact}</p>
          <p className="text-lg mb-2 text-white"><strong>Address:</strong> {openSelectedTurf.address}</p>
          <p className="text-lg mb-2 text-white"><strong>District:</strong> {openSelectedTurf.turfDistrict}</p>
          <p className="text-lg mb-2 text-white"><strong>Timings:</strong> {openSelectedTurf.turfTimings}</p>
          <p className="text-lg mb-4 text-white"><strong>Price:</strong> ${openSelectedTurf.turfPrice}</p>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
    );
};

export default UserHome;
