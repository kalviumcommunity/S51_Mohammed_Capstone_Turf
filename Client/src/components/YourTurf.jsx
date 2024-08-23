import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTurfContext } from "./TurfProvider";

const YourTurf = ({ turfs, setTurfs }) => {
  const { selectedTurf, setSelectedTurf } = useTurfContext();
  const [deleteTurfId, setDeleteTurfId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTurfAlert, setDeleteTurfAlert] = useState(false);
  const navigate = useNavigate();

  const fetchUserTurfs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/yourTurfs", {
        withCredentials: true,
      });
      setTurfs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching user turfs:", error);
      setTurfs([]);
    } finally {
      setLoading(false);
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
    setDeleteTurfAlert(false)
  };

  const handleEditClick = () => {
    navigate("/updateTurfData");
  };

  const handleDeleteClick = (turf) => {
    setDeleteTurfId(turf._id);
    setDeleteTurfAlert(true);
  };

  const cancelPopup = () => {
    setDeleteTurfAlert(false);
    setDeleteTurfId(null);
  };

  const handleDeleteTurf = async () => {
    try {
      await axios.delete('http://localhost:3000/api/deleteTurf', {
        data: { _id: deleteTurfId },
        withCredentials: true
      });
      setTurfs((prevTurfs) => prevTurfs.filter(turf => turf._id !== deleteTurfId));
      setDeleteTurfAlert(false);
      setDeleteTurfId(null);
      setSelectedTurf(null);
    } catch (error) {
      console.error("Error deleting turf:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white flex-col items-center">
      <div className="w-full max-w-6xl px-4">
        <button
          onClick={() => navigate("/userHome")}
          className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
        >
          &larr;
        </button>
      </div>
      <h1 className="text-4xl font-bold mt-2">Your Turfs</h1>
      {loading ? (
        <div className="mt-10 text-center">Loading...</div>
      ) : turfs.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-xl">You have not uploaded any turfs yet.</p>
          <button
            onClick={() => navigate("/ownerHome")}
            className="mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition-transform"
              onClick={() => handleThumbnailClick(turf)}
            >
              <img
                src={turf.turfThumbnail ? `${turf.turfThumbnail}` : "default-image-url"}
                alt={turf.turfName}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h2 className="text-2xl font-bold mt-2">{turf.turfName}</h2>
              <p className="text-xl mt-1">${turf.turfPrice}</p>
              <p>{turf._id}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTurf && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-3xl w-full h-auto overflow-y-auto relative shadow-lg">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-3xl text-white hover:text-gray-400"
            >
              &times;
            </button>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0 w-full lg:w-1/2">
                <img
                  src={selectedTurf.turfThumbnail}
                  alt={selectedTurf.turfName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-3xl font-bold mb-2">{selectedTurf.turfName}</h2>
                <p className="text-lg mb-2">{selectedTurf.turfDescription}</p>
                <p className="mb-2">
                  <strong>Contact:</strong> {selectedTurf.ownerContact}
                </p>
                <p className="mb-2">
                  <strong>Address:</strong> {selectedTurf.address}
                </p>
                <p className="mb-2">
                  <strong>District:</strong> {selectedTurf.turfDistrict}
                </p>
                <p className="mb-2">
                  <strong>Timings:</strong> {selectedTurf.turfTimings}
                </p>
                <p className="mb-4">
                  <strong>Price:</strong> ${selectedTurf.turfPrice}
                </p>
                <button
                  onClick={handleEditClick}
                  className="btn px-4 py-2 w-20 bg-blue-500 text-white font-semibold hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(selectedTurf)}
                  className="btn px-4 py-2 w-20 bg-red-500 hover:bg-red-600 ml-3 font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            {selectedTurf.turfImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {selectedTurf.turfImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Turf Image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {deleteTurfAlert && (
              <div role="alert" className="alert z-10 mt-4 justify-center items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info h-6 w-6 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Do you really want to "DELETE" this turf?</span>
                <p>Warning! Once it is deleted, it can't be retrieved.</p>
                <div>
                  <button className="btn btn-md " onClick={cancelPopup}>
                    NO
                  </button>
                  <button className="btn btn-md ml-3 btn-primary" onClick={handleDeleteTurf}>
                    YES
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YourTurf;
