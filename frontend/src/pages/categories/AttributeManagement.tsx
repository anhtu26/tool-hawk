import React from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import AttributeGroupForm from '../../components/categories/AttributeGroupForm';
import AttributeGroupCard from '../../components/categories/AttributeGroupCard';
import AttributeListItem, { type Attribute as AttributeType } from '../../components/categories/AttributeListItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import AttributeForm from '../../components/categories/AttributeForm';
import { useAttributeCrud } from '../../hooks/useAttributeCrud';

interface AttributeManagementProps {
  categoryId: string;
}

const AttributeManagement: React.FC<AttributeManagementProps> = ({ categoryId }) => {
  const {
    attributes,
    attributeGroups,
    selectedAttribute,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formMode,
    isSubmitting,
    isGroupFormOpen,
    setIsGroupFormOpen,
    selectedGroup,
    handleAddAttribute,
    handleEditAttribute,
    handleDeleteAttribute,
    confirmDeleteAttribute,
    handleFormSubmit,
    handleAddGroup,
    handleEditGroup,
    handleGroupFormSubmit,
    attributesByGroup,
    ungroupedAttributes,
    preparedAttributeForForm,
  } = useAttributeCrud({ categoryId });

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
          {attributesByGroup.map(groupWithAttrs => (
            <AttributeGroupCard
              key={groupWithAttrs.id}
              group={groupWithAttrs}
              attributes={groupWithAttrs.attributes as AttributeType[]} // Cast attributes here
              onEditGroup={handleEditGroup}
              onEditAttribute={handleEditAttribute}
              onDeleteAttribute={handleDeleteAttribute}
            />
          ))}
          
          {/* Display ungrouped attributes */}
          {ungroupedAttributes.length > 0 && (
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-md font-medium">General</h3>
              </div>
              
              <div className="space-y-2">
                {ungroupedAttributes.map(attr => (
                  <AttributeListItem
                    key={attr.id}
                    attribute={attr}
                    onEdit={handleEditAttribute}
                    onDelete={handleDeleteAttribute}
                  />
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
            attribute={preparedAttributeForForm}
            attributeGroups={attributeGroups}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Attribute Group Form Dialog */}
      <Dialog open={isGroupFormOpen} onOpenChange={setIsGroupFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Edit Attribute Group' : 'Create Attribute Group'}
            </DialogTitle>
          </DialogHeader>
          <AttributeGroupForm
            isOpen={isGroupFormOpen} // Pass isOpen state
            onOpenChange={setIsGroupFormOpen} // Pass state setter for onOpenChange
            group={selectedGroup}
            onSubmit={handleGroupFormSubmit}
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
    
    {/* Attribute Form Dialog */}
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {formMode === 'create' ? 'Create Attribute' : `Edit Attribute: ${selectedAttribute?.label}`}
          </DialogTitle>
        </DialogHeader>
        <AttributeForm
          attribute={preparedAttributeForForm}
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
    
    {/* Attribute Group Form Dialog */}
    <AttributeGroupForm
      isOpen={isGroupFormOpen}
      onOpenChange={setIsGroupFormOpen}
      group={selectedGroup}
      onSubmit={handleGroupFormSubmit}
    />
  </div>
);
};

export default AttributeManagement;
