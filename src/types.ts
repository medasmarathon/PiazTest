export type TLinkGroup = 'SaaS' | 'AI' | 'Crypto' | 'E-commerce';

export interface TLink {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  group: TLinkGroup;
}