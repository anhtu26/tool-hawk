import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export interface AttributeGroup {
  id?: string;
  name: string;
  sortOrder?: number;
  // categoryId: string; // Might be needed if submitting directly from here
}

interface AttributeGroupFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  group?: AttributeGroup | null; // For editing
  onSubmit: (groupData: AttributeGroup) => void;
  // categoryId: string; // Pass if needed for submission
}

const AttributeGroupForm: React.FC<AttributeGroupFormProps> = ({
  isOpen,
  onOpenChange,
  group,
  onSubmit,
}) => {
  const [groupName, setGroupName] = useState('');
  // Add other fields like sortOrder if necessary

  useEffect(() => {
    if (group) {
      setGroupName(group.name || '');
    } else {
      setGroupName('');
    }
  }, [group, isOpen]); // Reset form when group or isOpen changes

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error('Validation Error', {
        description: 'Group name cannot be empty.',
      });
      return;
    }
    onSubmit({
      id: group?.id,
      name: groupName,
      // sortOrder: ... // handle sortOrder if implemented
    });
    onOpenChange(false); // Close dialog on submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group ? 'Edit Attribute Group' : 'Create Attribute Group'}</DialogTitle>
          <DialogDescription>
            {group ? `Update the details for the group: ${group.name}` : 'Enter the details for the new attribute group.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Physical Dimensions, Performance Specs"
                required
              />
            </div>
            {/* Add input for sortOrder if needed */}
            {/* 
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order (Optional)</Label>
              <Input
                id="sortOrder"
                type="number"
                // value={sortOrder}
                // onChange={(e) => setSortOrder(parseInt(e.target.value))}
                placeholder="e.g., 1, 2, 3..."
              />
            </div>
            */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {group ? 'Save Changes' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeGroupForm;
