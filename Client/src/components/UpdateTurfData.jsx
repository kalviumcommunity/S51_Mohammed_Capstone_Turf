import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTurfContext } from './TurfProvider';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';
import { useDropzone } from 'react-dropzone';

const UpdateTurfData = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { selectedTurf } = useTurfContext();
  const navigate = useNavigate();
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [turfImagesURL, setTurfImages] = useState([]);
  const [isImagesDropZoneVisible, setIsImagesDropZoneVisible] = useState(true);

  const onThumbnailDrop = async (acceptedFiles) => {
    try {
      const thumbnail = acceptedFiles[0];
      if (thumbnail) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
        await uploadBytes(storageRef, thumbnail);
        const downloadURL = await getDownloadURL(storageRef);
        setThumbnailURL(downloadURL);
      }
    } catch (error) {
      console.log(error);
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
      if (turfImagesURL.length + acceptedFiles.length >= 5) {
        setIsImagesDropZoneVisible(false);
      }
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    if (selectedTurf) {
      setValue('turfImages', selectedTurf.turfImages || []);
      setValue('turfThumbnail', selectedTurf.turfThumbnail || '');
      setValue('turfName', selectedTurf.turfName || '');
      setValue('turfDescription', selectedTurf.turfDescription || '');
      setValue('turfPrice', selectedTurf.turfPrice || '');
      setValue('ownerContact', selectedTurf.ownerContact || '');
      setValue('address', selectedTurf.address || '');
      setValue('turfDistrict', selectedTurf.turfDistrict || '');
      setValue('turfTimings', selectedTurf.turfTimings || '');
    }
  }, [selectedTurf, setValue]);

  const onSubmit = async (data) => {
    try {
      data.turfImages = turfImagesURL;
      data.turfThumbnail = thumbnailURL;
      const response = await axios.patch(
        'http://localhost:3000/api/updateTurfData',
        data,
        { withCredentials: true }
      );
      console.log('Updated Turf:', response.data);
      navigate('/yourTurf');
    } catch (error) {
      console.error('Error updating turf:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Update Turf Data</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="turfThumbnail" className="block text-gray-700 text-lg font-medium mb-2">Turf Thumbnail:</label>
            <div className="border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 text-center">
              {thumbnailURL ? (
                <div>
                  <img src={thumbnailURL} alt="Thumbnail" className="max-w-full h-auto mx-auto mb-4" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                  <button type="button" onClick={removeThumbnail} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Remove Thumbnail
                  </button>
                </div>
              ) : (
                <div {...getThumbnailRootProps({ className: 'dropzone border-2 border-dashed border-gray-400 p-6 rounded-lg cursor-pointer' })}>
                  <input {...getThumbnailInputProps()} />
                  <p className="text-gray-600">Click here or drag 'n' drop a thumbnail image</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="turfImages" className="block text-gray-700 text-lg font-medium mb-2">Turf Images:</label>
            {isImagesDropZoneVisible && (
              <div {...getImagesRootProps({ className: 'dropzone border-2 border-dashed border-gray-400 p-6 rounded-lg cursor-pointer bg-gray-50' })}>
                <input {...getImagesInputProps()} />
                <p className="text-gray-600">Click here or drag 'n' drop images (up to 5)</p>
              </div>
            )}
            <aside className="mt-4">
              <ul className="flex flex-wrap gap-4">
                {turfImagesURL.map((imageURL, index) => (
                  <li key={index} className="relative">
                    <img src={imageURL} alt={`Turf ${index + 1}`} className="max-w-full h-auto" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    <button type="button" onClick={() => removeTurfImages(index)} className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Turf Name</label>
              <input
                type='text'
                {...register('turfName', { required: true })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {errors.turfName && <span className="text-red-600 text-sm">This field is required</span>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
              <textarea
                {...register('turfDescription')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Price</label>
              <input
                type='text'
                {...register('turfPrice')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Contact</label>
              <input
                type='text'
                {...register('ownerContact')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
              <input
                type='text'
                {...register('address')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">District</label>
              <input
                type='text'
                {...register('turfDistrict')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Timings</label>
              <input
                type='text'
                {...register('turfTimings')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <button
            type='submit'
            className='mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Save Changes
          </button>
          <button
            onClick={()=> navigate('/yourTurf')}
            className='mt-6 px-6 py-3 bg-red-500 ml-3 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTurfData;
