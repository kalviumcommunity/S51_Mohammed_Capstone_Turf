import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AccountSetup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/userDetails', data);
      toast.success('User details saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving user details.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Let&apos;s set up your account</h2>
      <form
        className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            Name
          </label>
          <input
            type="text"
            id="userName"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.userName ? 'border-red-500' : ''}`}
            {...register('userName', { required: 'Name is required' })}
          />
          {errors.userName && <p className="text-red-500 text-xs italic">{errors.userName.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userPhNo">
            Phone Number
          </label>
          <input
            type="text"
            id="userPhNo"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.userPhNo ? 'border-red-500' : ''}`}
            {...register('userPhNo', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            })}
          />
          {errors.userPhNo && <p className="text-red-500 text-xs italic">{errors.userPhNo.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userDistrict">
            District
          </label>
          <input
            type="text"
            id="userDistrict"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.userDistrict ? 'border-red-500' : ''}`}
            {...register('userDistrict', { required: 'District is required' })}
          />
          {errors.userDistrict && <p className="text-red-500 text-xs italic">{errors.userDistrict.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userLocation">
            Location
          </label>
          <input
            type="text"
            id="userLocation"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.userLocation ? 'border-red-500' : ''}`}
            {...register('userLocation', { required: 'Location is required' })}
          />
          {errors.userLocation && <p className="text-red-500 text-xs italic">{errors.userLocation.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userFavourites">
            Favourites (Optional)
          </label>
          <input
            type="text"
            id="userFavourites"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('userFavourites')}
            placeholder="Comma-separated values"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSetup;
