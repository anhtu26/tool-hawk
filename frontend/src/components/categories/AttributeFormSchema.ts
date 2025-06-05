import * as z from 'zod';

// Define the attribute types
export const attributeTypes = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'DATE', label: 'Date' },
  { value: 'SELECT_SINGLE', label: 'Single Select' },
  { value: 'SELECT_MULTIPLE', label: 'Multiple Select' },
  { value: 'FILE', label: 'File' }
];

// Form validation schema
export const attributeSchema = z.object({
  name: z.string()
    .min(1, 'Attribute name is required')
    .max(50, 'Attribute name cannot exceed 50 characters')
    .regex(/^[a-z][a-z0-9_]*$/, 'Name must start with lowercase letter and contain only lowercase letters, numbers, and underscores'),
  label: z.string().min(1, 'Display label is required').max(100, 'Label cannot exceed 100 characters'),
  attributeType: z.string().min(1, 'Attribute type is required'),
  isRequired: z.boolean().optional().default(false),
  defaultValue: z.any().optional().nullable(),
  tooltip: z.string().optional().nullable(),
  isFilterable: z.boolean().optional().default(false),
  isSearchable: z.boolean().optional().default(false),
  attributeGroupId: z.string().optional().nullable(),
  validationRules: z.any().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
});

export type AttributeFormValues = z.infer<typeof attributeSchema>;

export interface AttributeFormProps {
  attribute?: any;
  attributeGroups: any[];
  onSubmit: (data: AttributeFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
