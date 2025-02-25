import { useEffect, useState } from 'react';
import { TLink } from '../types';
import { getLinks, deleteLink as deleteLinkApi, saveLink as saveLinkApi } from '../api/links';

const useLinks = () => {
  const [links, setLinks] = useState<TLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const saveLink = async (link: Partial<TLink>) => {
    try {
      const savedLink = await saveLinkApi(link);
      setLinks(prevLinks => [...prevLinks, savedLink]);
      return true;
    } catch (err: unknown) {
      let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
      setError(errorMsg);
      console.warn("save link error: ", errorMsg, err);
      return false;
    }
  };

  const deleteLink = async (url: string) => {
    try {
      await deleteLinkApi(url);
      const updatedLinks = links.filter(link => link.url !== url);
      setLinks(updatedLinks);
    } catch (err: unknown) {
      let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
      setError(errorMsg);
      console.warn("delete link error: ", errorMsg, err);
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const fetchedLinks = await getLinks();
        setLinks(fetchedLinks);
        setLoading(false);
      } catch (err: unknown) {
        let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
        setError(errorMsg);
        console.warn("get links error: ", errorMsg, err);
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error, saveLink, deleteLink };
};

export default useLinks;