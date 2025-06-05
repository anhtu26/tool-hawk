import { z } from 'zod';

export const vendorValidation = {
  // Create vendor validation schema
  createVendor: z.object({
    body: z.object({
      name: z.string().min(1, 'Vendor name is required'),
      description: z.string().optional(),
      website: z.string().url('Invalid website URL').optional().nullable(),
      email: z.string().email('Invalid email address').optional().nullable(),
      phone: z.string().optional().nullable(),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      }).optional().nullable(),
      notes: z.string().optional().nullable(),
      accountNumber: z.string().optional().nullable(),
      paymentTerms: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
    }),
  }),

  // Update vendor validation schema
  updateVendor: z.object({
    params: z.object({
      id: z.string().min(1, 'Vendor ID is required'),
    }),
    body: z.object({
      name: z.string().min(1, 'Vendor name is required').optional(),
      description: z.string().optional().nullable(),
      website: z.string().url('Invalid website URL').optional().nullable(),
      email: z.string().email('Invalid email address').optional().nullable(),
      phone: z.string().optional().nullable(),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      }).optional().nullable(),
      notes: z.string().optional().nullable(),
      accountNumber: z.string().optional().nullable(),
      paymentTerms: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
    }),
  }),

  // Create contact validation schema
  createContact: z.object({
    params: z.object({
      id: z.string().min(1, 'Vendor ID is required'),
    }),
    body: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      title: z.string().optional().nullable(),
      email: z.string().email('Invalid email address').optional().nullable(),
      phone: z.string().optional().nullable(),
      isPrimary: z.boolean().optional(),
      notes: z.string().optional().nullable(),
    }),
  }),

  // Update contact validation schema
  updateContact: z.object({
    params: z.object({
      id: z.string().min(1, 'Vendor ID is required'),
      contactId: z.string().min(1, 'Contact ID is required'),
    }),
    body: z.object({
      firstName: z.string().min(1, 'First name is required').optional(),
      lastName: z.string().min(1, 'Last name is required').optional(),
      title: z.string().optional().nullable(),
      email: z.string().email('Invalid email address').optional().nullable(),
      phone: z.string().optional().nullable(),
      isPrimary: z.boolean().optional(),
      notes: z.string().optional().nullable(),
    }),
  }),
};
