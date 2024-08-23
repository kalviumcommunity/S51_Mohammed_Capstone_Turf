import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SelectedTurf = () => {
  const { id } = useParams();
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate()

  const getTurfById = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/getTurfById/${id}`);
      setSelectedTurf(response.data);
    } catch (error) {
      console.error("Can't find the turf you are looking for!", error);
      toast.error("Can't find the turf you are looking for!");
    }
  };

  useEffect(() => {
    const storedTurf = localStorage.getItem('selectedTurf');
    if (storedTurf) {
      setSelectedTurf(JSON.parse(storedTurf));
    } else {
      getTurfById();
    }
  }, [id]);


  if (!selectedTurf) {
    return <div>Loading...</div>; // or some other fallback UI
  }

  return (
    <div className="flex bg-black flex-col items-center text-center p-4">
      <h1 className="text-3xl font-bold mb-4">{selectedTurf.turfName}</h1>
      <div className='carousel w-1/3 mb-4'>
        {selectedTurf.turfImages.map((turf, ind) => (
          <div id={`item${ind + 1}`} className='carousel-item w-full' key={ind}>
            <img className='' src={turf} alt={`Turf Image ${ind}`} />
          </div>
        ))}
      </div>

      <div className="flex w-96 justify-center gap-2 py-2 mb-4">
        {selectedTurf.turfImages.map((_, ind) => (
          <a
            key={ind}
            href={`#item${ind + 1}`}
            className={`btn btn-xs ${currentSlide === ind ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setCurrentSlide(ind)}
          >
            {ind + 1}
          </a>
        ))}
      </div>
      
      <p className="text-lg mb-2"><strong>Contact:</strong> {selectedTurf.ownerContact}</p>
      <p className="text-lg mb-2"><strong>Address:</strong> {selectedTurf.address}</p>
      <p className="text-lg mb-2"><strong>District:</strong> {selectedTurf.turfDistrict}</p>
      <p className="text-lg mb-2"><strong>Timings:</strong> {selectedTurf.turfTimings}</p>
      <p className="text-lg mb-4"><strong>Price:</strong> ${selectedTurf.turfPrice}</p>
       
      <button className='btn bg-primary' onClick={() => navigate("/userHome")}>Back</button>
    </div>
  );
  
};

export default SelectedTurf;
