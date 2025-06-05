import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Plus, Edit, Trash, MoveVertical } from 'lucide-react';
import AttributeForm from '../../components/categories/AttributeForm';

// Mock data for demo
const mockAttributes = [
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

const mockAttributeGroups = [
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

interface AttributeManagementProps {
  categoryId: string;
}

const AttributeManagement: React.FC<AttributeManagementProps> = ({ categoryId }) => {
  const { toast } = useToast();
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  // In a real application, you would fetch attributes from the API
  useEffect(() => {
    // Fetch attributes from API
    // For demo, we're using mock data
    setAttributes(mockAttributes);
    setAttributeGroups(mockAttributeGroups);
  }, [categoryId]);

  const handleAddAttribute = () => {
    setFormMode('create');
    setSelectedAttribute(null);
    setIsFormOpen(true);
  };

  const handleEditAttribute = (attribute: any) => {
    setSelectedAttribute(attribute);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteAttribute = (attribute: any) => {
    setSelectedAttribute(attribute);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAttribute = () => {
    if (!selectedAttribute) return;
    
    // In a real application, you would call the API to delete the attribute
    // For demo, we're just updating the state
    setAttributes(attributes.filter(attr => attr.id !== selectedAttribute.id));
    
    toast({
      title: 'Attribute deleted',
      description: `${selectedAttribute.label} has been deleted successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedAttribute(null);
  };

  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // In a real application, you would call the API to create/update the attribute
    // For demo, we're just updating the state
    setTimeout(() => {
      if (formMode === 'create') {
        const newAttribute = {
          id: `new-${Date.now()}`, // In a real app, this would come from the API
          ...data,
          categoryId,
          sortOrder: attributes.length + 1
        };
        
        setAttributes([...attributes, newAttribute]);
        
        toast({
          title: 'Attribute created',
          description: `${data.label} has been created successfully.`,
        });
      } else {
        // Update existing attribute
        setAttributes(attributes.map(attr => 
          attr.id === selectedAttribute?.id ? { ...attr, ...data } : attr
        ));
        
        toast({
          title: 'Attribute updated',
          description: `${data.label} has been updated successfully.`,
        });
      }
      
      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 500); // Simulate API call
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleGroupFormSubmit = (data: any) => {
    // In a real application, you would call the API to create/update the group
    // For demo, we're just updating the state
    setTimeout(() => {
      if (!selectedGroup) {
        const newGroup = {
          id: `new-${Date.now()}`, // In a real app, this would come from the API
          ...data,
          categoryId,
          sortOrder: attributeGroups.length + 1
        };
        
        setAttributeGroups([...attributeGroups, newGroup]);
        
        toast({
          title: 'Group created',
          description: `${data.name} has been created successfully.`,
        });
      } else {
        // Update existing group
        setAttributeGroups(attributeGroups.map(group => 
          group.id === selectedGroup?.id ? { ...group, ...data } : group
        ));
        
        toast({
          title: 'Group updated',
          description: `${data.name} has been updated successfully.`,
        });
      }
      
      setIsGroupFormOpen(false);
    }, 500); // Simulate API call
  };

  // Group attributes by their group
  const attributesByGroup = attributeGroups.map(group => ({
    ...group,
    attributes: attributes.filter(attr => attr.attributeGroup?.id === group.id)
  }));

  // Get ungrouped attributes
  const ungroupedAttributes = attributes.filter(attr => !attr.attributeGroup);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Category Attributes</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAddGroup}>
            <Plus size={16} className="mr-1" /> Add Group
          </Button>
          <Button onClick={handleAddAttribute}>
            <Plus size={16} className="mr-1" /> Add Attribute
          </Button>
        </div>
      </div>

      {attributeGroups.length === 0 && attributes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No attributes defined for this category. Add attributes to define the properties of tools in this category.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Display attribute groups */}
          {attributesByGroup.map(group => (
            <Card key={group.id} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">{group.name}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
              
              {group.attributes.length === 0 ? (
                <div className="text-sm text-gray-500">No attributes in this group</div>
              ) : (
                <div className="space-y-2">
                  {group.attributes.map((attr: any) => (
                    <div 
                      key={attr.id} 
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{attr.label}</div>
                        <div className="text-xs text-gray-500">
                          {attr.attributeType} {attr.isRequired ? '• Required' : '• Optional'}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAttribute(attr)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAttribute(attr)}>
                          <Trash size={14} className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
          
          {/* Display ungrouped attributes */}
          {ungroupedAttributes.length > 0 && (
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-md font-medium">General</h3>
              </div>
              
              <div className="space-y-2">
                {ungroupedAttributes.map(attr => (
                  <div 
                    key={attr.id} 
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{attr.label}</div>
                      <div className="text-xs text-gray-500">
                        {attr.attributeType} {attr.isRequired ? '• Required' : '• Optional'}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAttribute(attr)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAttribute(attr)}>
                        <Trash size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
      
      {/* Attribute Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Create Attribute' : `Edit Attribute: ${selectedAttribute?.label}`}
            </DialogTitle>
          </DialogHeader>
          <AttributeForm
            attribute={selectedAttribute}
            attributeGroups={attributeGroups}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the attribute "{selectedAttribute?.label}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAttribute} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Group Form Dialog */}
      <Dialog open={isGroupFormOpen} onOpenChange={setIsGroupFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? `Edit Group: ${selectedGroup.name}` : 'Create Attribute Group'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="groupName" className="text-sm font-medium">
                Group Name
              </label>
              <input
                id="groupName"
                className="w-full p-2 border rounded-md"
                defaultValue={selectedGroup?.name || ''}
                placeholder="Enter group name"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupFormOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleGroupFormSubmit({ name: (document.getElementById('groupName') as HTMLInputElement).value })}
              >
                {selectedGroup ? 'Update Group' : 'Create Group'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributeManagement;
