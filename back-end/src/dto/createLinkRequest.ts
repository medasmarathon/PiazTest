import { z } from 'zod';

// Define the TypeScript type for creating a link
export const CreateLinkRequest = z.object({
  url: z.string().url({ message: 'Invalid URL format' }),
  title: z.string(),
  description: z.string().optional(),
  group: z.enum(['SaaS', 'AI', 'Crypto', 'E-commerce']),
  created_at: z.number(),
});

// Export the inferred TypeScript type
export type CreateLinkRequestType = z.infer<typeof CreateLinkRequest>;