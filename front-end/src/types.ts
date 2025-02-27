export type TLinkGroup = 'SaaS' | 'AI' | 'Crypto' | 'E-commerce';

export interface TLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  created_at: number;
  group: TLinkGroup;
  rating?: number;
}

export interface TLinkRequest {
  id: string;
  url: string;
  title: string;
  description?: string;
  created_at: number;
  group: TLinkGroup;
  rating?: number;
  userEmail: string;
}