import { z } from 'zod';

// Define the TypeScript type for updating a link
export const UpdateLinkRequest = z.object({
  url: z.string().url({ message: 'Invalid URL format' }).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  group: z.enum(['SaaS', 'AI', 'Crypto', 'E-commerce']).optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Export the inferred TypeScript type
export type UpdateLinkRequestType = z.infer<typeof UpdateLinkRequest>;