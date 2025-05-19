import { useEffect, useState } from 'react';

const useApiFetch = (url) => {
  const [data, setData] = useState(null);     // fetched data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);     // error state

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
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
  }, [url]);

  return { data, loading, error };
};

export default useApiFetch;
