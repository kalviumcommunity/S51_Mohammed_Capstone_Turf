import React from 'react';
import { useAuth } from '../owner/UserProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetchTurfs from './UseFetchturfs';
import TurfCard from './TurfCard';
import Navbar from './Navbar';
import CricketImage from '../assets/capstone-cricket-image.jpg';
import BadmittonImage from '../assets/capstone-badmitton-image.webp';
import soccerImage from '../assets/soccer.jpg';
import BasketBallImage from '../assets/capstone-basketballimage-new.jpeg';
import SwimmingImage from '../assets/capstone-swimming-image.jpg';

const UserHome = () => {
  const { logoutUser, checkUserStatus } = useAuth();
  const { turfs, loading } = useFetchTurfs();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await checkUserStatus();
      await logoutUser();
    } catch (error) {
      console.error(error);
      toast.error("Unable to log you out. Try refreshing the page.");
    }
  };

  const handleSelectedTurf = (turf) => {
    localStorage.setItem('selectedTurf', JSON.stringify(turf));
    navigate(`/selectedTurf/${turf._id}`);
  };

  return (
    <div className='bg-[#121212] min-h-screen text-white font-sans'>
      <Navbar onLogout={handleLogout} />

      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <span className="loading loading-ring loading-lg text-[#4CAF50]"></span>
        </div>
      ) : (
        <div className="pb-12">
          {/* Hero Carousel/Grid */}
          <div className="relative h-64 md:h-96 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#121212] z-10"></div>
             <img src={soccerImage} className="w-full h-full object-cover opacity-60" alt="Hero" />
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic">
                    Level Up Your <span className="text-[#4CAF50]">Game</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl">
                    Discover and book the finest sports turfs in your city. Real-time availability, instant confirmation.
                </p>
             </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-12">
            <h3 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center">
                <span className="w-12 h-1 bg-[#4CAF50] mr-4"></span>
                Top Sport Categories
            </h3>
            <div className="flex overflow-x-auto gap-6 pb-6 custom-scrollbar no-scrollbar scroll-smooth">
                {[
                    { img: CricketImage, name: "Cricket" },
                    { img: BadmittonImage, name: "Badminton" },
                    { img: soccerImage, name: "Soccer" },
                    { img: BasketBallImage, name: "Basketball" },
                    { img: SwimmingImage, name: "Swimming" }
                ].map((sport, i) => (
                    <div key={i} className="flex-shrink-0 w-64 group cursor-pointer">
                        <div className="relative h-64 overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-[#4CAF50] transition-all duration-300 shadow-xl">
                            <img src={sport.img} alt={sport.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <span className="text-xl font-bold italic uppercase">{sport.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-widest my-12 flex items-center">
                <span className="w-12 h-1 bg-[#4CAF50] mr-4"></span>
                Nearby Arenas
            </h3>
            
            {turfs.length === 0 ? (
              <div className="text-center py-20 bg-[#1a1a1a] rounded-3xl border border-gray-800">
                <p className="text-2xl text-gray-500 font-bold italic uppercase">No turfs found nearby</p>
                <button className="mt-4 text-[#4CAF50] font-bold hover:underline">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {turfs.map((turf, index) => (
                  <TurfCard key={index} turf={turf} onClick={handleSelectedTurf} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
