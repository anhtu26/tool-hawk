import type { Attribute as AttributeType } from '../../components/categories/AttributeListItem';
import type { AttributeGroup as AttributeGroupType } from '../../components/categories/AttributeGroupForm';

export const mockAttributes: AttributeType[] = [
  {
    id: '1',
    name: 'diameter',
    label: 'Diameter',
    attributeType: 'NUMBER',
    isRequired: true,
    defaultValue: null,
    validationRules: {
      min: 0.1,
      max: 100,
      step: 0.1
    },
    sortOrder: 1,
    tooltip: 'Diameter of the tool in mm',
    isFilterable: true,
    isSearchable: true,
    attributeGroup: {
      id: '1',
      name: 'Physical Properties',
      sortOrder: 1
    }
  },
  {
    id: '2',
    name: 'length',
    label: 'Length',
    attributeType: 'NUMBER',
    isRequired: true,
    defaultValue: null,
    validationRules: {
      min: 1,
      max: 500,
      step: 0.1
    },
    sortOrder: 2,
    tooltip: 'Length of the tool in mm',
    isFilterable: true,
    isSearchable: true,
    attributeGroup: {
      id: '1',
      name: 'Physical Properties',
      sortOrder: 1
    }
  },
  {
    id: '3',
    name: 'material',
    label: 'Material',
    attributeType: 'SELECT_SINGLE',
    isRequired: true,
    defaultValue: null,
    options: [
      { value: 'hss', label: 'High Speed Steel' },
      { value: 'carbide', label: 'Carbide' },
      { value: 'diamond', label: 'Diamond' },
      { value: 'ceramic', label: 'Ceramic' }
    ],
    sortOrder: 1,
    tooltip: 'Material of the cutting tool',
    isFilterable: true,
    isSearchable: true,
    attributeGroup: {
      id: '2',
      name: 'Performance Metrics',
      sortOrder: 2
    }
  }
];

export const mockAttributeGroups: AttributeGroupType[] = [
  {
    id: '1',
    name: 'Physical Properties',
    sortOrder: 1
  },
  {
    id: '2',
    name: 'Performance Metrics',
    sortOrder: 2
  }
];
