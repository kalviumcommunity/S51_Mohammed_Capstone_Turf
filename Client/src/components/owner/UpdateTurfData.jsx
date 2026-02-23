import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTurfContext } from './TurfProvider';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';
import { useDropzone } from 'react-dropzone';

const UpdateTurfData = ({setTurfs}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { selectedTurf } = useTurfContext();
  const navigate = useNavigate();
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [turfImagesURL, setTurfImages] = useState([]);
  const [isImagesDropZoneVisible, setIsImagesDropZoneVisible] = useState(true);

  const [turfTimings, setTurfTimings] = useState([
    { day: 'Monday', start: '', end: '' },
    { day: 'Tuesday', start: '', end: '' },
    { day: 'Wednesday', start: '', end: '' },
    { day: 'Thursday', start: '', end: '' },
    { day: 'Friday', start: '', end: '' },
    { day: 'Saturday', start: '', end: '' },
    { day: 'Sunday', start: '', end: '' },
  ]);
  
  // Function to handle timing changes
  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...turfTimings];
    updatedTimings[index][field] = value;
    setTurfTimings(updatedTimings);
  };

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
      setValue('turfTimings', selectedTurf.turfTimings || []);
      setTurfTimings(selectedTurf.turfTimings || turfTimings);
      setThumbnailURL(selectedTurf.turfThumbnail || null);
      setTurfImages(selectedTurf.turfImages || []);
    }
  }, [selectedTurf, setValue]);

  const onSubmit = async (data) => {
    try {
      data._id = selectedTurf._id;
      data.turfImages = turfImagesURL;
      data.turfThumbnail = thumbnailURL;
      data.turfTimings = turfTimings;
      data.email = data.email;
      data.turfSportCategory = data.turfSportCategory;

      const response = await axios.put(
        'http://localhost:3000/api/updateTurfData',
        {data},
        { withCredentials: true}
      );
      console.log('Updated Turf:', response.data);
      const response2 = await axios.get("http://localhost:3000/api/yourTurfs", {
        withCredentials: true,
      });
      console.log(response2.data)
      setTurfs(Array.isArray(response.data) ? response.data : []);
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
              <ul className="grid grid-cols-2 gap-7">
                {turfImagesURL.map((imageURL, index) => (
                  <li key={index} className="flex-row justify-center text-center items-center ">
                    <img src={imageURL} alt={`Turf ${index + 1}`} className=''/>
                    <button type="button" onClick={() => removeTurfImages(index)} className="btn mt-4 bg-red-600 text-white hover:bg-red-700 ">
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
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: "Email is necessary",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
              <label htmlFor="turfSportCategory" className="block text-gray-700 text-sm font-medium mb-2">Sport Category</label>
              <select
                id="turfSportCategory"
                {...register('turfSportCategory', { required: "Sport category is necessary" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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


            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Turf Timings</label>
              {turfTimings.map((timing, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="w-1/4">{timing.day}</span>
                  <input
                    type="time"
                    value={timing.start}
                    className="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleTimingChange(index, 'start', e.target.value)}
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="time"
                    value={timing.end}
                    className="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleTimingChange(index, 'end', e.target.value)}
                  />
                </div>
              ))}
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
