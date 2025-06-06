import { useEffect, useState } from 'react';

const useApiFetch = (url, token = null) => {
  const [data, setData] = useState(null);     // fetched data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);     // error state

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unknown error');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // avoid setting state if component is unmounted
    };
  }, [url, token]);

  return { data, loading, error };
};

export default useApiFetch;
