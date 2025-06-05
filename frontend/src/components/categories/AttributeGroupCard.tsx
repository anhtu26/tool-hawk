import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import AttributeListItem, { type Attribute } from './AttributeListItem';

// Define AttributeGroup interface, can be moved to a shared types file
export interface AttributeGroup {
  id?: string;
  name: string;
  sortOrder?: number;
  // categoryId?: string; // If needed
}

interface AttributeGroupCardProps {
  group: AttributeGroup;
  attributes: Attribute[]; // Attributes specifically for this group
  onEditGroup: (group: AttributeGroup) => void;
  onEditAttribute: (attribute: Attribute) => void;
  onDeleteAttribute: (attribute: Attribute) => void;
  // onAddAttributeToGroup?: (group: AttributeGroup) => void; // Optional: if adding attributes directly to a group
}

const AttributeGroupCard: React.FC<AttributeGroupCardProps> = ({
  group,
  attributes,
  onEditGroup,
  onEditAttribute,
  onDeleteAttribute,
  // onAddAttributeToGroup,
}) => {
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{group.name}</h3>
        <div className="flex items-center space-x-2">
          {/* Optional: Button to add attribute directly to this group
          {onAddAttributeToGroup && (
            <Button variant="outline" size="sm" onClick={() => onAddAttributeToGroup(group)}>
              <Plus size={14} className="mr-1" /> Add Attr.
            </Button>
          )}
          */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEditGroup(group)} 
            aria-label={`Edit group ${group.name}`}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Edit size={16} />
          </Button>
          {/* Consider adding a delete group button here, with appropriate confirmation */}
        </div>
      </div>

      {attributes.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
          No attributes currently in this group.
        </div>
      ) : (
        <div className="space-y-2">
          {attributes.map((attr) => (
            <AttributeListItem
              key={attr.id}
              attribute={attr}
              onEdit={onEditAttribute}
              onDelete={onDeleteAttribute}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default AttributeGroupCard;
