// frontend/src/types/attribute.types.ts (intended path)

export enum AttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  SELECT = 'SELECT', // For predefined options
  MULTISELECT = 'MULTISELECT', // For multiple predefined options
}

export interface AttributeOption {
  id: string;
  value: string;
  label: string;
}

export interface CategoryAttributeDefinition {
  id: string;
  name: string;
  label: string;
  type: AttributeType;
  isRequired: boolean;
  defaultValue?: any;
  options?: AttributeOption[];
  group?: string;
  description?: string;
  validationRegex?: string;
  minValue?: number;
  maxValue?: number;
}

export interface ToolAttributeValue {
  attributeDefinitionId: string;
  value: any;
}
