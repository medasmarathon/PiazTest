import { useQuery, useMutation } from '@tanstack/react-query';
import { TLink, TLinkRequest } from '../types';
import { getLinks, deleteLink as deleteLinkApi, saveLink as saveLinkApi } from '../api/links';

const useLinks = (userEmail?: string) => {
  const linksQuery = useQuery<TLink[], Error>({
    queryKey: ['links', userEmail],
    queryFn: () => userEmail ? getLinks(userEmail) : []
  });

  if (linksQuery.error) {
    const err = linksQuery.error;
    let errorMsg = err instanceof Error ? err.message : 'Failed to fetch links';
    console.warn("Get links error", errorMsg, err);
  }

  const saveLink = useMutation<TLink, Error, Partial<TLinkRequest>>({
    mutationFn: async (link: Partial<TLinkRequest>) => {
      const savedLink = await saveLinkApi(link);
      linksQuery.refetch();
      return savedLink;
    },
    onError: (err: unknown) => {
      let errorMsg = err instanceof Error ? err.message : 'Failed to save link';
      console.warn("Save link error", errorMsg, err);
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
      console.warn("Delete link error", errorMsg, err);
    }
  });

  return { linksQuery, saveLink, deleteLink };
};

export default useLinks;