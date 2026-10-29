import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  ALERTS_PROXY_URL,
  parseAlertCap,
  parseAlertsRss,
} from '../utils/peringatan';

const fetchXml = async (file, signal) => {
  const response = await axios.get(ALERTS_PROXY_URL, {
    params: { file },
    responseType: 'text',
    signal,
  });
  return response.data;
};

// Daftar Peringatan Dini Cuaca BMKG. `withDetails` juga memuat CAP tiap
// peringatan (tingkat keparahan, masa berlaku, poligon area).
const useAlerts = ({ withDetails = false, refreshInterval = 5 * 60000 } = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const items = parseAlertsRss(await fetchXml('rss.xml', signal));
        if (!withDetails) {
          setAlerts(items);
        } else {
          const details = await Promise.allSettled(
            items.map((item) => fetchXml(item.file, signal))
          );
          const now = Date.now();
          setAlerts(
            items
              .map((item, i) => ({
                ...item,
                detail:
                  details[i].status === 'fulfilled'
                    ? parseAlertCap(details[i].value)
                    : null,
              }))
              // Buang peringatan yang sudah kedaluwarsa.
              .filter((item) => !item.detail || item.detail.expires > now)
          );
        }
        setError(null);
        setUpdatedAt(new Date());
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Error fetching peringatan dini:', err);
        setError(err);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [withDetails]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const timer = setInterval(() => load(controller.signal), refreshInterval);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [load, refreshInterval]);

  return { alerts, loading, error, updatedAt, refetch: () => load() };
};

export default useAlerts;
