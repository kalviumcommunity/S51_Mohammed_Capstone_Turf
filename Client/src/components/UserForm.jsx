import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [step, setStep] = useState(1);
  const [client, setCliet] = useState()

  const onSubmit = async (data) => {
    try {
      console.log("submitted data", data);

      if (data.userType === 'user'){
        const response  = await axios.post('http://localhost:3000/userdetails', data);
        setCliet(response.data.name)
      }
      else if(data.userType === 'owner'){
        const response  = await axios.post('http://localhost:3000/ownerdetails', data)
        setCliet(response.data.name)
      }

      if (step < 3) {
        setStep(step + 1);
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 shadow-lg rounded-md">
        <p className="">{step}/3</p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {step === 1 && (
            <div className="w-full">
              <label htmlFor="name" className="block text-gray-300 text-lg font-semibold">Enter your name:</label>
              <input
                type="text"
                name="name"
                id="name"
                {...register('name', { required: 'Name is mandatory' })}
                className="mt-2 p-3 w-full border border-gray-600 rounded-md bg-gray-700 text-gray-300"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="w-full">
              <label htmlFor="location" className="block text-gray-300 text-lg font-semibold">Choose your location:</label>
              <select
                name="userType"
                id="userType"
                {...register('location', { required: 'location is mandatory' })}
                className="mt-2 p-3 w-full border border-gray-600 rounded-md bg-gray-700 text-gray-300"
              >
                <option value="" disabled>Select one</option>
                <option value="owner">Chennai</option>
                <option value="user">Madurai</option>
                <option value="user">Chengalpattu</option>
                <option value="user">User</option>
                <option value="user">User</option>
                <option value="user">User</option>
              </select>
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Next</button>
            </div>
          )}

          {step === 3 && (
            <div className="w-full">
              <label htmlFor="userType" className="block text-gray-300 text-lg font-semibold">Are you here to upload your TURF?</label>

              <select id="userType">
                <option disabled>Select one</option>
                <option value="owner">Yes</option>
                <option value="user">No</option>
              </select>

              {errors.userType && <p className="text-red-500">{errors.userType.message}</p>}
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Submit</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserForm;
