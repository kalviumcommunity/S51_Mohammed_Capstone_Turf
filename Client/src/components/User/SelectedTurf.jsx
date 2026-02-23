import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Clock, ShieldCheck, Star } from 'lucide-react';

const SelectedTurf = () => {
  const { id } = useParams();
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const getTurfById = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getTurfById/${id}`);
      setSelectedTurf(response.data);
    } catch (error) {
      console.error("Can't find the turf you are looking for!", error);
      toast.error("Can't find the turf you are looking for!");
    }
  };

  useEffect(() => {
    const storedTurf = localStorage.getItem('selectedTurf');
    if (storedTurf && JSON.parse(storedTurf)._id === id) {
      setSelectedTurf(JSON.parse(storedTurf));
    } else {
      getTurfById();
    }
  }, [id]);

  if (!selectedTurf) {
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#4CAF50]"></span>
        </div>
    );
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % selectedTurf.turfImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + selectedTurf.turfImages.length) % selectedTurf.turfImages.length);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      {/* Top Banner / Image Navigation Area */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-black">
        <img 
            src={selectedTurf.turfImages[currentImageIndex]} 
            alt={selectedTurf.turfName} 
            className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40"></div>
        
        {/* Navigation Overlays */}
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-[#4CAF50] hover:text-black transition-all">
            <ChevronLeft size={24} />
        </button>

        <div className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full bg-[#4CAF50] text-black font-black uppercase text-xs tracking-widest shadow-lg">
            {selectedTurf.turfSportCategory}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#4CAF50] mb-2 font-bold tracking-widest uppercase text-sm">
                        <Star size={16} fill="#4CAF50" />
                        <span>Premium Arena</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{selectedTurf.turfName}</h1>
                    <div className="flex items-center text-gray-400 mt-4 font-medium italic">
                        <MapPin size={20} className="mr-2 text-[#4CAF50]" />
                        <span>{selectedTurf.address}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={prevImage} className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-[#4CAF50] hover:text-black transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-[#4CAF50] hover:text-black transition-all">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12">
            <section>
                <h3 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center">
                    <span className="w-12 h-1 bg-[#4CAF50] mr-4"></span>
                    The Experience
                </h3>
                <p className="text-xl text-gray-400 leading-relaxed italic">
                    "{selectedTurf.turfDescription}"
                </p>
            </section>

            <section className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold uppercase mb-8">Facility Ameneties</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { icon: ShieldCheck, label: "Verified Turf" },
                        { icon: Clock, label: "24/7 Access" },
                        { icon: Phone, label: "On-site Support" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-black/40 rounded-2xl border border-gray-800 hover:border-[#4CAF50]/40 transition-colors">
                            <item.icon size={32} className="text-[#4CAF50] mb-3" />
                            <span className="text-sm font-bold uppercase tracking-tighter text-gray-400">{item.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center">
                    <span className="w-12 h-1 bg-[#4CAF50] mr-4"></span>
                    Operating Hours
                </h3>
                <div className="space-y-3">
                    {selectedTurf.turfTimings.map((timing, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                        <span className="font-bold text-gray-300 uppercase tracking-widest">{timing.day}</span>
                        <span className="font-black text-[#4CAF50]">{timing.start} - {timing.end}</span>
                    </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Sidebar Booking Summary */}
        <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border-2 border-[#4CAF50] sticky top-28 shadow-[0_0_50px_rgba(76,175,80,0.1)]">
                <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-[0.5em] mb-2">Hourly Rate</span>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-black text-[#4CAF50]">₹{selectedTurf.turfPrice}</span>
                        <span className="text-gray-500 font-bold ml-1 uppercase">/ hr</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-gray-800 italic">
                        <Mail size={18} className="text-[#4CAF50]" />
                        <span className="text-sm truncate">{selectedTurf.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-gray-800 italic">
                        <Phone size={18} className="text-[#4CAF50]" />
                        <span className="text-sm font-bold tracking-widest">{selectedTurf.ownerContact}</span>
                    </div>
                </div>

                <button 
                    onClick={() => navigate(`/bookSelectedTurf/${selectedTurf._id}`)}
                    className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-black font-black py-5 rounded-[1.5rem] transition-all duration-300 transform hover:scale-[1.05] shadow-[0_10px_20px_rgba(76,175,80,0.3)] uppercase tracking-tighter text-lg italic"
                >
                    Book This Turf
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-widest">Instant Confirmation • Best Price Guaranteed</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTurf;
