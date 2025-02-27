import { TLink } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLinks = async (email: string): Promise<TLink[]> => {
  const params = new URLSearchParams({
    userEmail: email
  });
  const response = await fetch(`${API_BASE_URL}/links?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }
  return response.json();
};

export const deleteLink = async (url: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/links/${encodeURIComponent(url)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete link');
  }
};

export const saveLink = async (link: Partial<TLink>): Promise<TLink> => {
  const response = await fetch(API_BASE_URL + "/links", {
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