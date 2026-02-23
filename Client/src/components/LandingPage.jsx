import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './owner/UserProvider';
import Cookies from 'js-cookie';
import { ChevronRight, Play, Award, Zap, ShieldCheck, Clock, Star } from 'lucide-react';

const Start = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans overflow-hidden">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5 relative z-30">
                <div className="text-3xl font-black uppercase tracking-tighter italic">
                    TURF<span className="text-[#4CAF50]">ER</span>
                </div>
                <div className="flex gap-4">
                    <NavLink to="/login" className="px-6 py-2 rounded-full font-bold uppercase text-sm border border-white/20 hover:bg-white/5 transition-all">Login</NavLink>
                    <NavLink to="/signup" className="px-6 py-2 rounded-full font-bold uppercase text-sm bg-[#4CAF50] text-black hover:bg-[#45a049] transition-all">Get Started</NavLink>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 px-6">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4CAF50]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 border border-[#4CAF50]/30 px-4 py-2 rounded-full text-[#4CAF50] text-xs font-black uppercase tracking-widest mb-8">
                        <Zap size={14} />
                        Fastest way to book your match
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight italic mb-8 relative z-10">
                        The Ultimate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-green-300">Arena Network</span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 max-w-2xl mb-12 font-medium relative z-10">
                        Stop checking availability manually. Book professional turf grounds in seconds. Soccer, Cricket, Badminton & More.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 mb-20 relative z-10">
                        <button onClick={() => navigate('/signup', { state: { role: 'user' } })} className="group px-12 py-5 rounded-2xl bg-[#4CAF50] text-black font-black uppercase text-xl italic flex items-center shadow-[0_15px_30px_rgba(76,175,80,0.3)] hover:scale-105 transition-all">
                            Book Now
                            <ChevronRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => navigate('/signup', { state: { role: 'owner' } })} className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase text-xl italic flex items-center hover:bg-white/10 transition-all">
                            Join as Owner
                            <Play size={20} className="ml-3 text-[#4CAF50]" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-20 w-full relative z-10">
                        {[
                            { label: "Active Turfs", val: "500+", icon: Award },
                            { label: "City Wide", val: "24/7", icon: Clock },
                            { label: "Users Joined", val: "50k+", icon: ShieldCheck },
                            { label: "Rating", val: "4.9/5", icon: Star }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-3xl font-black text-white italic">{stat.val}</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer-like text */}
            <div className="text-center pb-12 text-gray-600 font-bold uppercase text-[10px] tracking-[0.5em]">
                Inspired by the game • Optimized for champions
            </div>
        </div>
    );
};

export default Start;
