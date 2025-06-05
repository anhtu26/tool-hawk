import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

// This interface should ideally be shared or imported from a types definition file
export interface Attribute {
  id: string;
  name: string; // machine-readable
  label: string; // human-readable
  attributeType: string; // e.g., TEXT, NUMBER, SELECT_SINGLE
  isRequired?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  validationRules?: any;
  sortOrder?: number;
  tooltip?: string | null;
  isFilterable?: boolean;
  isSearchable?: boolean;
  attributeGroup?: {
    id: string;
    name: string;
    sortOrder?: number;
  };
  // categoryId: string; // If needed directly on the attribute
}

interface AttributeListItemProps {
  attribute: Attribute;
  onEdit: (attribute: Attribute) => void;
  onDelete: (attribute: Attribute) => void;
}

const AttributeListItem: React.FC<AttributeListItemProps> = ({
  attribute,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div>
        <div className="font-medium">{attribute.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {attribute.attributeType}
          {attribute.isRequired ? ' • Required' : ' • Optional'}
        </div>
        {attribute.tooltip && (
          <div className="text-xs text-gray-400 dark:text-gray-500 italic">
            Tooltip: {attribute.tooltip}
          </div>
        )}
      </div>
      <div className="flex space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(attribute)} aria-label={`Edit ${attribute.label}`}>
          <Edit size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(attribute)} aria-label={`Delete ${attribute.label}`}>
          <Trash size={14} className="text-red-500 hover:text-red-600" />
        </Button>
      </div>
    </div>
  );
};

export default AttributeListItem;
