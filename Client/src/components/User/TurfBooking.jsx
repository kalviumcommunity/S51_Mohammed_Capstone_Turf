import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, Clock, MapPin, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../owner/UserProvider';
import Cookies from 'js-cookie';

const TurfBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [turf, setTurf] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    const generateSlots = () => {
        const slots = [];
        for (let i = 6; i < 23; i++) {
            const start = `${i.toString().padStart(2, '0')}:00`;
            const end = `${(i + 1).toString().padStart(2, '0')}:00`;
            slots.push({ start, end });
        }
        return slots;
    };

    const slots = generateSlots();

    useEffect(() => {
        const fetchTurfDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getTurfById/${id}`);
                setTurf(response.data);
            } catch (error) {
                toast.error("Failed to load turf details");
            }
        };
        fetchTurfDetails();
    }, [id]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/availability/${id}?date=${dateStr}`);
                setBookedSlots(response.data.map(b => b.timeSlot.start));
            } catch (error) {
                console.error("Error fetching availability", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAvailability();
    }, [id, selectedDate]);

    const handleBooking = async () => {
        if (!selectedSlot) {
            toast.warn("Please select a time slot");
            return;
        }

        try {
            const token = Cookies.get('jwt'); // Assuming jwt is stored in cookies or we get it from Appwrite
            // Actually our UserProvider/middleware uses Bearer token from Appwrite JWT
            // We might need to get a fresh JWT from Appwrite here
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/book`, {
                turfId: id,
                bookingDate: selectedDate.toISOString().split('T')[0],
                timeSlot: selectedSlot,
                totalPrice: turf.turfPrice
            }, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('jwt')}` // Simplified for now
                }
            });

            toast.success("Booking successful!");
            navigate('/userHome');
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    if (!turf) return <div className="min-h-screen bg-[#212121] text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#212121] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-[#4CAF50] uppercase tracking-wider">{turf.turfName}</h1>
                    <div className="flex items-center text-gray-400 mt-2">
                        <MapPin size={18} className="mr-1" />
                        <span>{turf.address}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Info & Gallery */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-[#4CAF50]">
                            <img src={turf.turfThumbnail} alt={turf.turfName} className="w-full h-96 object-cover" />
                        </div>
                        
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Info size={20} className="mr-2 text-[#4CAF50]" />
                                About this Turf
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{turf.turfDescription}</p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <span className="bg-[#4CAF50]/20 text-[#4CAF50] px-4 py-1 rounded-full border border-[#4CAF50]/30 font-medium">
                                    {turf.turfSportCategory}
                                </span>
                                <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full border border-blue-500/30 font-medium">
                                    ₹{turf.turfPrice} / Hour
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border-2 border-[#4CAF50] sticky top-8 shadow-[0_0_20px_rgba(76,175,80,0.2)]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center text-[#4CAF50]">
                                <CalendarIcon size={24} className="mr-2" />
                                BOOK YOUR SLOT
                            </h2>

                            <div className="mb-6 custom-calendar">
                                <Calendar 
                                    onChange={setSelectedDate} 
                                    value={selectedDate} 
                                    minDate={new Date()}
                                    className="bg-[#333] border-none text-white rounded-lg p-2"
                                />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <Clock size={18} className="mr-2 text-[#4CAF50]" />
                                    Available Slots
                                </h3>
                                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {slots.map((slot, idx) => {
                                        const isBooked = bookedSlots.includes(slot.start);
                                        const isSelected = selectedSlot?.start === slot.start;

                                        return (
                                            <button
                                                key={idx}
                                                disabled={isBooked}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-1 rounded text-xs font-bold transition-all duration-200 border-2 ${
                                                    isBooked ? 'bg-red-500/10 border-red-500/30 text-red-500/50 cursor-not-allowed' :
                                                    isSelected ? 'bg-[#4CAF50] border-[#4CAF50] text-black scale-105' :
                                                    'bg-[#333] border-gray-600 text-gray-300 hover:border-[#4CAF50] hover:text-[#4CAF50]'
                                                }`}
                                            >
                                                {slot.start}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">Total Price</span>
                                    <span className="text-2xl font-bold text-[#4CAF50]">₹{turf.turfPrice}</span>
                                </div>
                                <button
                                    onClick={handleBooking}
                                    className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center uppercase tracking-tighter"
                                >
                                    PROCEED TO BOOK
                                    <CheckCircle size={20} className="ml-2" />
                                </button>
                                <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">Secured Payment & Instant Confirmation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-calendar {
                    color: black !important;
                }
                .react-calendar {
                    width: 100% !important;
                    background: #333 !important;
                    border: none !important;
                    font-family: inherit !important;
                    border-radius: 12px !important;
                }
                .react-calendar__tile {
                    color: white !important;
                }
                .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus {
                    background-color: #4CAF50 !important;
                    color: black !important;
                }
                .react-calendar__tile--active {
                    background: #4CAF50 !important;
                    color: black !important;
                }
                .react-calendar__navigation button {
                    color: white !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2a2a2a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4CAF50;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default TurfBooking;
