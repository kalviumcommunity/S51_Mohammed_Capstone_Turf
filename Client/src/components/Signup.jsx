import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext, createContext } from 'react';


const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user,setUser] = useState()
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/signup', data);
      localStorage.setItem("token", response.data.token)
      setUser(response.data.email)
      console.log(user)
      navigate('/userform');
      toast.success('Signup successful');
    } catch (error) {
      if (error.response && error.response.data.message.includes('already exists')) {
        setErrorMessage('Email is already registered');
      } else {
        setErrorMessage('Signup failed');
      }
      console.log("Signup error", error.message);
      toast.error({errorMessage});
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
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
        <NavLink to="/login" className="block text-center text-blue-500 mt-4">Already a user? Login</NavLink>
      </div>
    </div>
  );
}

export default Signup;
