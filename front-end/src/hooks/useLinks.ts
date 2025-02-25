import { useEffect, useState } from 'react';
import { TLink } from '../types';
import { getLinks, deleteLink as deleteLinkApi } from '../api/links';

const useLinks = () => {
  const [links, setLinks] = useState<TLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const deleteLink = async (url: string) => {
    try {
      await deleteLinkApi(url);
      const updatedLinks = links.filter(link => link.url !== url);
      setLinks(updatedLinks);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const fetchedLinks = await getLinks();
        setLinks(fetchedLinks);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error, deleteLink };
};

export default useLinks;