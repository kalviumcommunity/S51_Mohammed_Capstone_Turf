import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const YourTurf = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const navigate = useNavigate();

  const fetchUserTurfs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/yourTurfs', {
        withCredentials: true,
      });
      console.log('User Turfs:', response.data);
      setTurfs(response.data);
    } catch (error) {
      console.error('Error fetching user turfs:', error);
    }
  };

  useEffect(() => {
    fetchUserTurfs();
  }, []);

  const handleThumbnailClick = (turf) => {
    setSelectedTurf(turf);
  };

  const handleClosePopup = () => {
    setSelectedTurf(null);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className='flex min-h-screen bg-gray-900 text-white flex-col items-center'>
      <div className='w-full max-w-6xl px-4'>
        <button
          onClick={() => navigate('/userHome')}
          className='mt-4 mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700'
        >
          &larr;
        </button>
      </div>
      <h1 className='text-4xl font-bold mt-2'>Your Turfs</h1>
      {turfs.length === 0 ? (
        <div className='mt-10 text-center'>
          <p className='text-xl'>You have not uploaded any turfs yet.</p>
          <button
            onClick={() => navigate('/ownerHome')}
            className='mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700'
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5'>
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className='bg-gray-800 p-4 rounded shadow-lg cursor-pointer'
              onClick={() => handleThumbnailClick(turf)}
            >
              <img
                src={`data:${turf.turfThumbnail.contentType};base64,${arrayBufferToBase64(turf.turfThumbnail.data.data)}`}
                alt={turf.turfName}
                className='w-full h-48 object-cover rounded-t'
              />
              <h2 className='text-2xl font-bold mt-2'>{turf.turfName}</h2>
              <p className='text-xl'>${turf.turfPrice}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTurf && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-gray-800 p-8 rounded-lg max-w-4xl w-full relative'>
            <button
              onClick={handleClosePopup}
              className='absolute top-2 right-2 text-2xl text-white'
            >
              &times;
            </button>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {selectedTurf.turfImages.map((image, index) => (
                <img
                  key={index}
                  src={`data:${image.contentType};base64,${arrayBufferToBase64(image.data.data)}`}
                  alt={`${selectedTurf.turfName} - ${index + 1}`}
                  className='w-full h-64 object-cover rounded'
                />
              ))}
            </div>
            <div className='mt-4'>
              <h2 className='text-3xl font-bold'>{selectedTurf.turfName}</h2>
              <p className='mt-2'>{selectedTurf.turfDescription}</p>
              <p className='mt-2'><strong>Contact:</strong> {selectedTurf.ownerContact}</p>
              <p className='mt-2'><strong>Address:</strong> {selectedTurf.address}</p>
              <p className='mt-2'><strong>District:</strong> {selectedTurf.turfDistrict}</p>
              <p className='mt-2'><strong>Timings:</strong> {selectedTurf.turfTimings}</p>
              <p className='mt-2'><strong>Price:</strong> ${selectedTurf.turfPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourTurf;
