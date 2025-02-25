import { useQuery, useMutation } from '@tanstack/react-query';
import { TLink } from '../types';
import { getLinks, deleteLink as deleteLinkApi, saveLink as saveLinkApi } from '../api/links';

const useLinks = () => {
  const linksQuery = useQuery<TLink[], Error>({
    queryKey: ['links'],
    queryFn: getLinks
  });

  if (linksQuery.error) {
    const err = linksQuery.error;
    let errorMsg = err instanceof Error ? err.message : 'Failed to fetch links';
    console.warn("get links error: ", errorMsg, err);
  }

  const saveLink = useMutation<TLink, Error, Partial<TLink>>({
    mutationFn: async (link: Partial<TLink>) => {
      const savedLink = await saveLinkApi(link);
      linksQuery.refetch();
      return savedLink;
    },
    onError: (err: unknown) => {
      let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
      console.warn("save link error: ", errorMsg, err);
    }
  });

  const deleteLink = useMutation<boolean, Error, string>({
    mutationFn: async (url: string) => {
      await deleteLinkApi(url);
      linksQuery.refetch();
      return true;
    },
    onError: (err: unknown) => {
      let errorMsg = err instanceof Error ? err.message : 'Failed to delete link';
      console.warn("delete link error: ", errorMsg, err);
    }
  });

  return { linksQuery, saveLink, deleteLink };
};

export default useLinks;