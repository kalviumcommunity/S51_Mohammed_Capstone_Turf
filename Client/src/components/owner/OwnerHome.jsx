import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';
import Cookies from 'js-cookie';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'daisyui/dist/full.css';

const OwnerHome = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // To track the current step

  // Step 3: Image Upload
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [turfImagesURL, setTurfImages] = useState([]);
  const [isImagesDropZoneVisible, setIsImagesDropZoneVisible] = useState(true);

  // Step 2: Turf Information
  const [turfTimings, setTurfTimings] = useState([
    { day: 'Monday', start: '', end: '' },
    { day: 'Tuesday', start: '', end: '' },
    { day: 'Wednesday', start: '', end: '' },
    { day: 'Thursday', start: '', end: '' },
    { day: 'Friday', start: '', end: '' },
    { day: 'Saturday', start: '', end: '' },
    { day: 'Sunday', start: '', end: '' },
  ]);

  const handleChange = (index, field, value) => {
    const updatedTimings = [...turfTimings];
    updatedTimings[index][field] = value;
    setTurfTimings(updatedTimings);
  };

  const onThumbnailDrop = async (acceptedFiles) => {
    try {
      const thumbnail = acceptedFiles[0];
      if (thumbnail) {
        const storage = getStorage(app);
        const storageref = ref(storage, `thumbnails/${thumbnail.name}`);
        await uploadBytes(storageref, thumbnail);
        const downloadURL = await getDownloadURL(storageref);
        setThumbnailURL(downloadURL);
      }
    } catch (error) {
      console.log(error);
      toast.error("Can't upload file. This might occur when the file is not an image, file size is too large");
    }
  };

  const onImagesDrop = async (acceptedFiles) => {
    try {
      const storage = getStorage(app);
      const newImagesURLs = await Promise.all(
        acceptedFiles.map(async (file) => {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        })
      );
      setTurfImages((prevImages) => [...prevImages, ...newImagesURLs]);
      if (turfImagesURL.length + acceptedFiles.length === 5) {
        setIsImagesDropZoneVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Can't upload file. This might occur when the file is not an image, file size is too large");
    }
  };

  const removeThumbnail = () => {
    setThumbnailURL(null);
  };

  const removeTurfImages = (index) => {
    const newImages = [...turfImagesURL];
    newImages.splice(index, 1);
    setTurfImages(newImages);

    if (newImages.length < 5) {
      setIsImagesDropZoneVisible(true);
    }
  };

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({ onDrop: onThumbnailDrop });
  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({ onDrop: onImagesDrop });

  const onSubmit = async (data) => {
    data.userID = Cookies.get("userID");
    data.turfImages = turfImagesURL;
    data.turfThumbnail = thumbnailURL;

    const formData = {
      turfName: data.turfName,
      email:data.email,
      ownerContact: data.ownerContact,
      turfDescription: data.turfDescription,
      turfPrice: data.turfPrice,
      address: data.address,
      turfTimings: turfTimings,
      turfSportCategory: data.turfSportCategory,
      turfThumbnail: data.turfThumbnail,
      turfImages: data.turfImages,
      userID: data.userID,
    };
    
    try {
      await axios.post('http://localhost:3000/api/upload', formData);
      toast('Turf Uploaded Successfully');
      navigate('/userHome');
    } catch (error) {
      console.error('Error uploading turf information and images:', error);
      toast('We are unable to upload your turf. This may happen due to server error, try reloading the page');
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Personal Information</h2>
            <div className="mb-4">
              <label htmlFor="turfName" className="block text-gray-700 mb-2">Turf Name</label>
              <input
                type="text"
                id="turfName"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('turfName', {
                  required: "Name is necessary",
                  minLength: {
                    value: 4,
                    message: "At least 4 letters"
                  },
                  maxLength: {
                    value: 30,
                    message: "Do not exceed more than 30 characters"
                  }
                })}
              />
              {errors.turfName && <p className="text-red-500">{errors.turfName.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('email', {
                  required: "Email is necessary",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="ownerContact" className="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="number"
                id="ownerContact"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('ownerContact', {
                  required: "Contact is necessary",
                  minLength: {
                    value: 10,
                    message: "Must be 10 numbers"
                  },
                  maxLength: {
                    value: 10,
                    message: "Do not exceed more than 10 numbers"
                  }
                })}
              />
              {errors.ownerContact && <p className="text-red-500">{errors.ownerContact.message}</p>}
            </div>

          </>
        )}

        {/* Step 2: Turf Information */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Turf Information</h2>
            
            {/* Turf Description */}
            <div className="mb-4">
              <label htmlFor="turfDescription" className="block text-gray-700 mb-2">Turf Description</label>
              <textarea
                id="turfDescription"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('turfDescription', {
                  required: "Description is necessary",
                  minLength: {
                    value: 20,
                    message: "Enter at least 20 characters"
                  },
                  maxLength: {
                    value: 150,
                    message: "Do not exceed more than 150 characters"
                  }
                })}
              />
              {errors.turfDescription && <p className="text-red-500">{errors.turfDescription.message}</p>}
            </div>

            {/* Turf Price */}
            <div className="mb-4">
              <label htmlFor="turfPrice" className="block text-gray-700 mb-2">Turf Price</label>
              <input
                type="number"
                id="turfPrice"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('turfPrice', {
                  required: "Price is necessary",
                  min: {
                    value: 0,
                    message: "Price cannot be negative"
                  }
                })}
              />
              {errors.turfPrice && <p className="text-red-500">{errors.turfPrice.message}</p>}
            </div>

            {/* Turf Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 mb-2">Turf Address</label>
              <input
                type="text"
                id="address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('address', {
                  required: "Address is necessary",
                  maxLength: {
                    value: 50,
                    message: "Do not exceed more than 50 characters"
                  }
                })}
              />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>

            {/* Turf Timings */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Turf Timings</label>
              {turfTimings.map((timing, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="w-1/4">{timing.day}</span>
                  <input
                    type="time"
                    value={timing.start}
                    className="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleChange(index, 'start', e.target.value)}
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="time"
                    value={timing.end}
                    className="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleChange(index, 'end', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Sport Category */}
            <div className="mb-4">
              <label htmlFor="turfSportCategory" className="block text-gray-700 mb-2">Sport Category</label>
              <select
                id="turfSportCategory"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('turfSportCategory', { required: "Sport category is necessary" })}
              >
                <option value="">Select a category</option>
                <option value="cricket">Cricket</option>
                <option value="basketball">Basketball</option>
                <option value="badminton">Badminton</option>
                <option value="swimming">Swimming</option>
                <option value="football">Football</option>
              </select>
              {errors.turfSportCategory && <p className="text-red-500">{errors.turfSportCategory.message}</p>}
            </div>
          </>
        )}


        {/* Step 3: Image Upload */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Images Upload</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Turf Thumbnail</label>
              <div {...getThumbnailRootProps()} className="border-dashed border-2 border-gray-300 p-4 text-center">
                <input {...getThumbnailInputProps()} />
                {thumbnailURL ? (
                  <div className="relative">
                    <img src={thumbnailURL} alt="Thumbnail" className="mx-auto max-h-48 mb-2" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 focus:outline-none"
                      onClick={removeThumbnail}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p>Drag and drop or click to upload a thumbnail</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Turf Images</label>
              <div {...getImagesRootProps()} className="border-dashed border-2 border-gray-300 p-4 text-center">
                <input {...getImagesInputProps()} />
                {isImagesDropZoneVisible ? (
                  <p>Drag and drop or click to upload up to 5 images</p>
                ) : (
                  <p className="text-red-500">Maximum image limit reached</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {turfImagesURL.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Turf Image ${index + 1}`} className="max-h-48 w-full object-cover mb-2" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 focus:outline-none"
                      onClick={() => removeTurfImages(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button type="button" className="btn text-black btn-outline hover:" onClick={prevStep}>
              Previous
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OwnerHome;
