// backend/src/features/tools/tools.schemas.ts (intended path)
import { z } from 'zod';

export const createToolSchema = z.object({
  toolNumber: z.string().min(1, 'Tool number is required').max(100),
  name: z.string().min(1, 'Tool name is required').max(255),
  description: z.string().optional(),
  categoryId: z.string().cuid('Invalid category ID format'), // Assuming CUID for category IDs from Prisma
  vendorId: z.string().cuid('Invalid vendor ID format').optional(), // Assuming CUID for vendor IDs
  sku: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  // customAttributes will be a JSON object. Prisma expects JsonValue.
  // For validation, we expect an object where keys are attribute IDs (strings)
  // and values can be string, number, boolean, or null.
  // More specific validation per attribute type would be handled dynamically if needed,
  // but for a generic endpoint, a simple object check is a starting point.
  customAttributes: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').optional().default(0),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required').max(50), // Added as it's required in schema.prisma
  // Add other common tool fields as needed
});

export type CreateToolInput = z.infer<typeof createToolSchema>;

// Schema for updating a tool (similar to create, but all fields optional)
export const updateToolSchema = createToolSchema.partial();
export type UpdateToolInput = z.infer<typeof updateToolSchema>;

export const getToolParamsSchema = z.object({
  toolId: z.string().cuid('Invalid tool ID format'),
});
export type GetToolParams = z.infer<typeof getToolParamsSchema>;

export const listToolsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional().default('createdAt'), // e.g., 'name', 'createdAt'
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  categoryId: z.string().cuid('Invalid category ID format').optional(),
  vendorId: z.string().cuid('Invalid vendor ID format').optional(),
  search: z.string().optional(), // General search term for name, sku, etc.
});
export type ListToolsQuery = z.infer<typeof listToolsQuerySchema>;
