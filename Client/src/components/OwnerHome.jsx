import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import app from './firebase'
import Cookies from 'js-cookie'
import Calendar from 'react-calendar' 
import axios from 'axios';

const OwnerHome = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [turfImagesURL, setTurfImages] = useState([])
  const [turfTimings, setTurfTimings] = useState([ 
    { day: 'Monday', start: '', end: '' },
    { day: 'Tuesday', start: '', end: '' },
    { day: 'Wednesday', start: '', end: '' },
    { day: 'Thursday', start: '', end: '' },
    { day: 'Friday', start: '', end: '' },
    { day: 'Saturday', start: '', end: '' },
    { day: 'Sunday', start: '', end: '' },
  ])
  const [isImagesDropZoneVisible, setIsImagesDropZoneVisible] = useState(true);

  const onThumbnailDrop = async (acceptedFiles) => {
    try {
      // console.log(acceptedFiles[0])
      const thumbnail = acceptedFiles[0]
      if (thumbnail){
        const storage = getStorage(app)
        const storageref = ref(storage, `thumbnails/${thumbnail.name}`);
        await uploadBytes(storageref, thumbnail)
        const downloadURL = await getDownloadURL(storageref)
        // console.log(downloadURL)
        setThumbnailURL(downloadURL)
      }
    } catch (error) {
      console.log(error)
      toast.error("Can't upload file. This might occur when the file is not an image, file size is too large")
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
      if (turfImagesURL.length + acceptedFiles.length == 5) {
        setIsImagesDropZoneVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Can't upload file. This might occur when the file is not an image, file size is too large")
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
    // console.log("userID from Cookies:", data.userID);
    data.turfImages = turfImagesURL;
    data.turfThumbnail = thumbnailURL;
  
    const formData = {
      turfName: data.turfName,
      turfDescription: data.turfDescription,
      ownerContact: data.ownerContact,
      address: data.address,
      turfDistrict: data.turfDistrict,
      turfThumbnail: data.turfThumbnail,
      turfImages: data.turfImages,
      turfSportCategory: data.turfSportCategory,
      turfPrice: data.turfPrice,
      userID: data.userID,
    };
  
    console.log("FormData:", formData);
  
    try {
      await axios.post('http://localhost:3000/api/upload', formData);
      toast('Turf Uploaded Successfully');
      navigate('/userHome');
    } catch (error) {
      console.error('Error uploading turf information and images:', error);
      toast('We are unable to upload your turf. This may happen due to server error, try reloading the page');
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Turf</h2>

        <div className="mb-6">
          <label htmlFor="turfThumbnail" className="block text-gray-700 mb-2">Add your Turf Thumbnail image:</label>
          <div className="relative border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 text-center">
            {thumbnailURL ? (
              <div>
                <img src={thumbnailURL} alt="Thumbnail" className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                <button type="button" onClick={removeThumbnail} className="absolute top-2 right-2 px-4 py-2 bg-red-600 text-white rounded-lg">
                  Remove Thumbnail
                </button>
              </div>
            ) : (
              <div {...getThumbnailRootProps({ className: 'dropzone p-6 border-dashed border-2 border-gray-300 bg-gray-50 text-center cursor-pointer' })}>
                <input {...getThumbnailInputProps()} />   {/* implemented file upload functionality using dopzone, */}
                <p className="text-gray-600">Click or drag 'n' drop a thumbnail image here</p> {/* also implemented drag and drop feature */}
              </div>
            )}
          </div>
        </div>

        
        <div className="mb-4">
            <label htmlFor="turfImages" className="block text-gray-700 mb-2">Add images of your turf:</label>
            {isImagesDropZoneVisible && (
              <div {...getImagesRootProps({ className: 'dropzone bg-gray-200 border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer' })}>
                <input {...getImagesInputProps()} />   {/* implemented file upload functionality using dopzone, */}
                <p>Click here or drag 'n' drop images of your turf</p>  {/* also implemented drag and drop feature */}
              </div>
            )}
            <aside className="mt-4">
              <ul className="flex flex-wrap justify-center gap-4">
                {turfImagesURL.map((imageURL, index) => (
                  <li key={index}>
                    <div className="relative">
                      <img src={imageURL} alt={`Turf ${index + 1}`} className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                      <button type="button" onClick={() => removeTurfImages(index)} className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-red-600 text-white rounded-lg">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
        </div>

        <div className="mb-4">
          <label htmlFor="turfName" className="block text-gray-700 mb-2">Type in your turf name:</label>
          <input
            type="text"
            id="turfName"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfName', {
              required: "Name is necessary",
              minLength:{
                value:4,
                message:"Atleast 4 letters"
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
          <label htmlFor="email" className="block text-gray-700 mb-2">Type in your e-mail</label>
          <input
            type="text"
            id="email"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('email', {
              required: "email is necessary",
              
            })}
          />
          {errors.turfName && <p className="text-red-500">{errors.turfName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfDescription" className="block text-gray-700 mb-2">Type in your turf intro</label>
          <input
            type="text"
            id="turfDescription"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfDescription', {
              required : "Turf description is necessary",
              minLength: {
                value: 4,
                message: "Must be atleast 4 characters"
              },
              maxLength: {
                value: 100,
                message: "Do not exceed more than 100 characters"
              }
            })}
          />
          {errors.turfDescription && <p className="text-red-500">{errors.turfDescription.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="ownerContact" className="block text-gray-700 mb-2">Add your contact No:</label>
          <input
            type="number"
            id="ownerContact"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('ownerContact', {
              required: "Contact is necessary",
              minLength:{
                value:10,
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

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 mb-2">Type in your turf address:</label>
          <input
            type="text"
            id="address"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('address', {
              required: "Address is necessary",
              maxLength: {
                value: 100,
                message: "Do not exceed more than 100 characters"
              }
            })}
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfDistrict" className="block text-gray-700 mb-2">Select the district of your turf:</label>
          <select
            id="turfDistrict"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfDistrict', { required: 'District is mandatory' })}
          >
            <option value="" disabled>Select one</option>
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
            <option value="Chengalpattu">Chengalpattu</option>
          </select>
          {errors.turfDistrict && <p className="text-red-500">{errors.turfDistrict.message}</p>}
        </div>

        <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Set Turf Timings</h3>
        {turfTimings.map((timing, index) => (
          <div key={index} className="flex items-center mb-4">
            <label className="w-1/4 text-gray-700">{timing.day}</label>
            <input
              type="time"
              value={timing.start}
              onChange={(e) => handleChange(index, 'start', e.target.value)}
              className="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="mx-2 text-gray-600">to</span>
            <input
              type="time"
              value={timing.end}
              onChange={(e) => handleChange(index, 'end', e.target.value)}
              className="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

        <h1>hello</h1>

        <div className="mb-4">
          <label htmlFor="turfPrice" className="block text-gray-700 mb-2">Type in your turf price per hour:</label>
          <input
            type="text"
            id="turfPrice"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfPrice', {
              required: "Price is required",
              maxLength: {
                value: 4,
                message: "Do not exceed more than 4 characters"
              }
            })}
          />
          {errors.turfPrice && <p className="text-red-500">{errors.turfPrice.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfSportCategory" className="block text-gray-700 mb-2">Select the Category of your turf:</label>
          <select
            id="turfSportCategory"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfSportCategory', { required: 'category is mandatory' })}
          >
            <option value="" disabled>Select one</option>
            <option value="Football">Football</option>
            <option value="Badminton">Badminton</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
          </select>
          {errors.turfSportCategory && <p className="text-red-500">{errors.turfSportCategory.message}</p>}
        </div>
        
        <div>
            <Calendar/>
        </div>

        <button type="submit" className="w-1/2 py-3 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OwnerHome;

