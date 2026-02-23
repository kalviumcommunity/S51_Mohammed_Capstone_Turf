import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import { useAuth } from '../owner/UserProvider';
import { LogIn, Mail, Lock, ChevronRight, Zap } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, loginUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/userHome');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const { email, password } = data;
            const { success, message } = await loginUser(email, password);
            if (!success) {
                setErrorMessage(message);
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 text-white font-sans overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="w-full max-w-md bg-[#1a1a1a] rounded-[2.5rem] border border-gray-800 p-10 shadow-2xl relative">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="p-4 bg-[#4CAF50]/10 rounded-2xl border border-[#4CAF50]/30 text-[#4CAF50] mb-4">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                        Welcome <span className="text-[#4CAF50]">Back</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
                        Get back into the game
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2 ml-4">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4CAF50]/60" size={18} />
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all outline-none"
                                placeholder="champion@email.com"
                                {...register('email', {
                                    required: 'Email is mandatory',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email pattern'
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 ml-4 tracking-wider">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-2 px-4">
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Password</label>
                            <NavLink to="/forgot-password" size={18} className="text-[10px] uppercase font-black text-[#4CAF50] hover:underline tracking-widest">Forgot?</NavLink>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4CAF50]/60" size={18} />
                            <input
                                type="password"
                                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all outline-none"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is mandatory',
                                    minLength: {
                                        value: 8,
                                        message: 'Minimum 8 characters'
                                    }
                                })}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 ml-4 tracking-wider">{errors.password.message}</p>}
                    </div>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tight text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-black font-black py-5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(76,175,80,0.2)] uppercase tracking-tighter text-lg italic flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : (
                            <>
                                Access Account
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-gray-800">
                    <GoogleAuth />
                    <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        New player? <NavLink to="/signup" className="text-[#4CAF50] font-black hover:underline uppercase tracking-tighter italic">Join Squad</NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
