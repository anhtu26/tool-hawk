import { z } from 'zod';
import { AttributeType } from '@prisma/client';

export const categoryValidation = {
  // Create category validation schema
  createCategory: z.object({
    body: z.object({
      name: z.string().min(1, 'Category name is required'),
      description: z.string().optional(),
      parentId: z.string().optional(),
    }),
  }),

  // Update category validation schema
  updateCategory: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
    }),
    body: z.object({
      name: z.string().min(1, 'Category name is required').optional(),
      description: z.string().optional(),
      parentId: z.string().optional().nullable(),
    }),
  }),

  // Create attribute group validation schema
  createAttributeGroup: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
    }),
    body: z.object({
      name: z.string().min(1, 'Group name is required'),
      sortOrder: z.number().int().nonnegative().optional(),
    }),
  }),

  // Update attribute group validation schema
  updateAttributeGroup: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
      groupId: z.string().min(1, 'Group ID is required'),
    }),
    body: z.object({
      name: z.string().min(1, 'Group name is required').optional(),
      sortOrder: z.number().int().nonnegative().optional(),
    }),
  }),

  // Create category attribute validation schema
  createAttribute: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
    }),
    body: z.object({
      name: z.string().min(1, 'Attribute name is required'),
      label: z.string().min(1, 'Attribute label is required'),
      attributeType: z.enum([
        AttributeType.TEXT,
        AttributeType.NUMBER,
        AttributeType.BOOLEAN,
        AttributeType.DATE,
        AttributeType.SELECT_SINGLE,
        AttributeType.SELECT_MULTI,
        AttributeType.RICH_TEXT,
        AttributeType.FILE_ATTACHMENT,
      ]),
      attributeGroupId: z.string().optional(),
      isRequired: z.boolean().optional(),
      defaultValue: z.string().optional(),
      options: z.any().optional(), // Will be validated in controller based on attributeType
      validationRules: z.any().optional(), // Will be validated in controller based on attributeType
      sortOrder: z.number().int().nonnegative().optional(),
      tooltip: z.string().optional(),
      isFilterable: z.boolean().optional(),
      isSearchable: z.boolean().optional(),
    }),
  }),

  // Update category attribute validation schema
  updateAttribute: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
      attributeId: z.string().min(1, 'Attribute ID is required'),
    }),
    body: z.object({
      label: z.string().min(1, 'Attribute label is required').optional(),
      attributeType: z.enum([
        AttributeType.TEXT,
        AttributeType.NUMBER,
        AttributeType.BOOLEAN,
        AttributeType.DATE,
        AttributeType.SELECT_SINGLE,
        AttributeType.SELECT_MULTI,
        AttributeType.RICH_TEXT,
        AttributeType.FILE_ATTACHMENT,
      ]).optional(),
      attributeGroupId: z.string().optional().nullable(),
      isRequired: z.boolean().optional(),
      defaultValue: z.string().optional().nullable(),
      options: z.any().optional(), // Will be validated in controller based on attributeType
      validationRules: z.any().optional(), // Will be validated in controller based on attributeType
      sortOrder: z.number().int().nonnegative().optional(),
      tooltip: z.string().optional().nullable(),
      isFilterable: z.boolean().optional(),
      isSearchable: z.boolean().optional(),
    }),
  }),
};
