import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import Cookies from 'js-cookie';
import { useAuth } from './UserProvider';


const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const {user, loginUser} = useAuth()

    const loginForm = useRef(null)

    useEffect(() => {
        if(user){
            navigate('/')
        }
    },[])

    const onSubmit = async (data) => {
        const email = data.email;
        const password = data.password 
        const userInfo = {email, password}
        loginUser(userInfo)

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form ref={loginForm} onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                type="text"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                placeholder="Enter email"
                {...register('email', {
                    required: 'Email is mandatory',
                    pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email pattern'
                    }
                })}
                />
                {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                placeholder="Enter password"
                {...register('password', {
                    required: 'Password is mandatory',
                    minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                    }
                })}
                />
                {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
                Submit
            </button>
            </form>
            <div className="mt-4 text-center">
            <GoogleAuth />
            </div>
            <div className="mt-4 text-center">
            <NavLink to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot password?
            </NavLink>
            </div>
            <div className="mt-2 text-center">
            <NavLink to="/signup" className="text-blue-500 hover:underline">
                Don't have an account?
            </NavLink>
            </div>
        </div>
        </div>
    );
};

export default Login;
