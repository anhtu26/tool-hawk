/**
 * Type definitions for the Category service
 */

export interface CategoryCreateInput {
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string | null;
  parentId?: string | null;
}

export interface AttributeGroupCreateInput {
  name: string;
  sortOrder?: number;
}

export interface AttributeGroupUpdateInput {
  name?: string;
  sortOrder?: number;
}

export interface CategoryAttributeCreateInput {
  name: string;
  label: string;
  attributeType: string;
  attributeGroupId?: string | null;
  isRequired?: boolean;
  defaultValue?: string | null;
  options?: any;
  validationRules?: any;
  sortOrder?: number;
  tooltip?: string | null;
  isFilterable?: boolean;
  isSearchable?: boolean;
}

export interface CategoryAttributeUpdateInput {
  label?: string;
  attributeType?: string;
  attributeGroupId?: string | null;
  isRequired?: boolean;
  defaultValue?: string | null;
  options?: any;
  validationRules?: any;
  sortOrder?: number;
  tooltip?: string | null;
  isFilterable?: boolean;
  isSearchable?: boolean;
}
