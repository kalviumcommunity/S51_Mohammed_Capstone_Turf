import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

const OwnerHome = () => {
  const location = useLocation();
  const { name, userLocation } = location.state || {};
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const onThumbnailDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setThumbnail(acceptedFiles[0]);
      setThumbnailPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const onImagesDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
    const previews = acceptedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({ onDrop: onThumbnailDrop });
  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({ onDrop: onImagesDrop });

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, imagePreviews]);

  return (
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Turf</h2>

        <div className="mb-4">
          <label htmlFor="turfThumbNail" className="block text-gray-700 mb-2">Add your Turf Thumbnail image:</label>
          <div className="border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 text-center">
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Thumbnail" className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
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
          <div {...getImagesRootProps({ className: 'dropzone bg-gray-200 border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer' })}>
            <input {...getImagesInputProps()} />
            <p>Click here or drag 'n' drop images</p>
          </div>
          <aside className="mt-4">
            <ul className="flex flex-wrap justify-center gap-4">
              {imagePreviews.map((preview, index) => (
                <li key={index}>
                  <img src={preview} alt={`Turf ${index + 1}`} className="max-w-full h-auto mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
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
            placeholder="Optional"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfName', {
              required: "Name is necessary",
              maxLength: {
                value: 10,
                message: "Do not exceed more than 10 characters"
              }
            })}
          />
          {errors.turfName && <p className="text-red-500">{errors.turfName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="turfDescription" className="block text-gray-700 mb-2">Type in your turf intro:</label>
          <input
            type="text"
            id="turfDescription"
            placeholder="Optional"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('turfDescription', {
              maxLength: {
                value: 20,
                message: "Do not exceed more than 20 characters"
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
            placeholder="Optional"
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
            placeholder="Optional"
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

        <button type="submit" className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OwnerHome;
