import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

// Ambil data JSON dari `url`, opsional diperbarui otomatis setiap `refreshInterval` ms.
const useFetch = (url, { refreshInterval } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchData = useCallback(
    async (signal) => {
      if (!url) return;
      setLoading(true);
      try {
        const response = await axios.get(url, { signal });
        setData(response.data);
        setError(null);
        setUpdatedAt(new Date());
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(`Error fetching ${url}:`, err);
        setError(err);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    fetchData(controller.signal);

    if (!refreshInterval) return () => controller.abort();
    const timer = setInterval(() => fetchData(controller.signal), refreshInterval);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [fetchData, refreshInterval]);

  return { data, loading, error, updatedAt, refetch: () => fetchData() };
};

export default useFetch;
