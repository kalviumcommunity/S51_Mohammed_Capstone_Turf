import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useFetchTurfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getAllTurfs');
        setTurfs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Failed to fetch turfs. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  return { turfs, loading };
};

export default useFetchTurfs;
