import { useEffect, useState } from 'react';

interface Link {
  url: string;
  title: string;
  timestamp: number;
}

const useLinks = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (chrome.storage) {
          // Chrome extension context
          chrome.storage.local.get({ links: [] }, (result: { links: Link[] }) => {
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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error };
};

export default useLinks;