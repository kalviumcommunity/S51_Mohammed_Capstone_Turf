import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import axios from 'axios';

const OwnerHome = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isImagesDropZoneVisible, setIsImagesDropZoneVisible] = useState(true);

  const onThumbnailDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setThumbnail(acceptedFiles[0]);
      setThumbnailPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const onImagesDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => file);
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));

    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      if (updatedImages.length >= 5) {
        setIsImagesDropZoneVisible(false);
      }
      return updatedImages;
    });
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImagePreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newImagePreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newImagePreviews);

    if (newImages.length < 5) {
      setIsImagesDropZoneVisible(true);b 
    }
  };

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({ onDrop: onThumbnailDrop });
  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({ onDrop: onImagesDrop });

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, imagePreviews]);

  const onSubmit = async (data) => {
    data.userID = Cookies.get("userID");
    console.log("userID from Cookies:", data.userID); // Debugging log
    const formData = new FormData();
    formData.append('turfName', data.turfName);
    formData.append('turfDescription', data.turfDescription);
    formData.append('ownerContact', data.ownerContact);
    formData.append('address', data.address);
    formData.append('turfDistrict', data.turfDistrict);
    formData.append('turfTimings', data.turfTimings);
    if (thumbnail) {
        formData.append('turfThumbnail', thumbnail);
    }
    images.forEach((image, index) => {
        formData.append('turfImages', image);
    });
    formData.append('turfSportCategory', data.turfSportCategory);
    formData.append('turfPrice', data.turfPrice);
    formData.append('userID', data.userID); 
    console.log("FormData entries:", Array.from(formData.entries()));

    try {
        await axios.post('http://localhost:3000/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Turf Uploaded Successfully');
        navigate('/userHome');
    } catch (error) {
        console.error('Error uploading turf information and images:', error);
        toast.error('Error uploading your turf');
    }
};


  return (
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Turf</h2>

        <div className="mb-4">
          <label htmlFor="turfThumbnail" className="block text-gray-700 mb-2">Add your Turf Thumbnail image:</label>
          <div className="border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 text-center">
            {thumbnailPreview ? (
              <div>
                <img src={thumbnailPreview} alt="Thumbnail" className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                <button type="button" onClick={removeThumbnail} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg">
                  Remove Thumbnail
                </button>
              </div>
            ) : (
              <div {...getThumbnailRootProps({ className: 'dropzone' })}>
                <input {...getThumbnailInputProps()} />
                <p className="text-gray-600">Click here or drag 'n' drop a thumbnail image</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="turfImages" className="block text-gray-700 mb-2">Add images of your turf:</label>
          {isImagesDropZoneVisible && (
            <div {...getImagesRootProps({ className: 'dropzone bg-gray-200 border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer' })}>
              <input {...getImagesInputProps()} />
              <p>Click here or drag 'n' drop images</p>
            </div>
          )}
          <aside className="mt-4">
            <ul className="flex flex-wrap justify-center gap-4">
              {imagePreviews.map((preview, index) => (
                <li key={index}>
                  <div className="relative">
                    <img src={preview} alt={`Turf ${index + 1}`} className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-red-600 text-white rounded-lg">
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfName', {
              required: "Name is necessary",
              maxLength: {
                value: 20,
                message: "Do not exceed more than 10 characters"
              }
            })}
          />
          {errors.turfName && <p className="text-red-500">{errors.turfName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfDescription" className="block text-gray-700 mb-2">Type in your turf intro</label>
          <input
            type="text"
            id="turfDescription"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfDescription', {
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
            type="text"
            id="ownerContact"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('ownerContact', {
              required: "Contact is necessary",
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('address', {
              required: "Address is necessary",
              maxLength: {
                value: 30,
                message: "Do not exceed more than 30 characters"
              }
            })}
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfDistrict" className="block text-gray-700 mb-2">Select the district of your turf:</label>
          <select
            id="turfDistrict"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfDistrict', { required: 'District is mandatory' })}
          >
            <option value="" disabled>Select one</option>
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
            <option value="Chengalpattu">Chengalpattu</option>
          </select>
          {errors.turfDistrict && <p className="text-red-500">{errors.turfDistrict.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfTimings" className="block text-gray-700 mb-2">Add timings for your turf:</label>
          <input
            type="number"
            id="fromTiming"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfTimings', {
              required: 'Set timings'
            })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="turfPrice" className="block text-gray-700 mb-2">Type in your turf price per hour:</label>
          <input
            type="text"
            id="turfPrice"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <button type="submit" className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OwnerHome;
