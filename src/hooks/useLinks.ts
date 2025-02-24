import { useEffect, useState } from 'react';

import { TLink } from '../types';

const useLinks = () => {
  const [links, setLinks] = useState<TLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const deleteLink = async (url: string) => {
    try {
      const updatedLinks = links.filter(link => link.url !== url);
      if (chrome.storage) {
        // Chrome extension context
        await chrome.storage.local.set({ links: updatedLinks });
      } else {
        // Development context
        localStorage.setItem('links', JSON.stringify(updatedLinks));
      }
      setLinks(updatedLinks);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (chrome.storage) {
          // Chrome extension context
          chrome.storage.local.get({ links: [] }, (result: { links: TLink[] }) => {
            // Add default group to existing links
            const linksWithGroup = result.links.map(link => ({
              ...link,
              group: link.group || 'SaaS' // Default to SaaS for existing links
            }));
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

  return { links, loading, error, deleteLink };
};

export default useLinks;