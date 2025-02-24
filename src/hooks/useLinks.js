import { useEffect, useState } from 'react';

const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (chrome.storage) {
          // Chrome extension context
          chrome.storage.local.get({ links: [] }, (result) => {
            if (chrome.runtime.lastError) {
              throw new Error(chrome.runtime.lastError.message);
            }
            setLinks(result.links);
            setLoading(false);
          });
        } else {
          // Development context
          const storedLinks = localStorage.getItem('links');
          const parsedLinks = storedLinks ? JSON.parse(storedLinks) : [];
          if (!Array.isArray(parsedLinks)) {
            throw new Error('Invalid links data format');
          }
          setLinks(parsedLinks);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error };
};

export default useLinks;