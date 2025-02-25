import { TLink } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/links';

export const getLinks = async (): Promise<TLink[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }
  return response.json();
};

export const deleteLink = async (url: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(url)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete link');
  }
};

export const saveLink = async (link: Partial<TLink>): Promise<TLink> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  });
  if (!response.ok) {
    throw new Error('Failed to save link');
  }
  return response.json();
};