import { useQuery, useMutation } from '@tanstack/react-query';
import { TLink, TLinkRequest } from '../types';
import { getLinks, deleteLink as deleteLinkApi, saveLink as saveLinkApi } from '../api/links';
import useAuth from './useAuth';
import { extensionLogging } from '@/utils';

const useLinks = () => {
  const { userEmail } = useAuth();
  const linksQuery = useQuery<TLink[], Error>({
    queryKey: ['links'],
    queryFn: () => userEmail ? getLinks(userEmail) : []
  });

  if (linksQuery.error) {
    const err = linksQuery.error;
    let errorMsg = err instanceof Error ? err.message : 'Failed to fetch links';
    extensionLogging("Get links error", errorMsg);
  }

  const saveLink = useMutation<TLink, Error, Partial<TLinkRequest>>({
    mutationFn: async (link: Partial<TLink>) => {
      const savedLink = await saveLinkApi(link);
      linksQuery.refetch();
      return savedLink;
    },
    onError: (err: unknown) => {
      let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
      extensionLogging("Save link error", errorMsg);
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
      extensionLogging("Delete link error", errorMsg);
    }
  });

  return { linksQuery, saveLink, deleteLink };
};

export default useLinks;