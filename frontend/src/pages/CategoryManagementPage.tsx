// frontend/src/pages/CategoryManagementPage.tsx
import React, { useState } from 'react';
import CategoryTree, { type CategoryNode } from '../components/categories/CategoryTree';
import CategoryFormDialog from '../components/categories/CategoryFormDialog';
import DynamicAttributeFormField from '../components/attributes/DynamicAttributeFormField';
import { type CategoryAttributeDefinition, AttributeType } from '../types/attribute.types';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const mockCategories: CategoryNode[] = [
  {
    id: '1',
    name: 'Cutting Tools',
    children: [
      { id: '1-1', name: 'End Mills', children: [
        { id: '1-1-1', name: 'Square End Mills' },
        { id: '1-1-2', name: 'Ball Nose End Mills' },
      ] },
      { id: '1-2', name: 'Drills' },
    ],
  },
  {
    id: '2',
    name: 'Workholding',
    children: [
      { id: '2-1', name: 'Vises' },
      { id: '2-2', name: 'Clamps' },
    ],
  },
  { id: '3', name: 'Measuring Tools' },
];

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null | undefined>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttributeDefinition[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, any>>({});

  const handleSelectCategory = (category: CategoryNode) => {
    console.log('Selected category:', category);
    setSelectedCategory(category);
    // TODO: Fetch real attributes for this category from backend
    // For now, using mock attributes based on category ID
    if (category.id === '1-1-1') { // Square End Mills
      setCategoryAttributes([
        { id: 'attr1', name: 'Diameter', label: 'Diameter (mm)', type: AttributeType.NUMBER, isRequired: true, minValue: 0.1, maxValue: 100, group: 'Dimensions' },
        { id: 'attr2', name: 'Flutes', label: 'Number of Flutes', type: AttributeType.NUMBER, isRequired: true, minValue: 1, maxValue: 8, group: 'Cutting Parameters' },
        { id: 'attr3', name: 'Material', label: 'Coating Material', type: AttributeType.SELECT, isRequired: false, options: [{id: 'opt1', value: 'TiN', label: 'Titanium Nitride (TiN)'}, {id: 'opt2', value: 'AlTiN', label: 'Aluminum Titanium Nitride (AlTiN)'}], group: 'Material' },
        { id: 'attr4', name: 'InStock', label: 'Is In Stock?', type: AttributeType.BOOLEAN, isRequired: false, group: 'Inventory' },
      ]);
      setAttributeValues({ attr1: 2, attr2: 4 }); // Mock initial values
    } else if (category.id === '2-1') { // Vises
      setCategoryAttributes([
        { id: 'attr5', name: 'JawWidth', label: 'Jaw Width (inch)', type: AttributeType.NUMBER, isRequired: true, group: 'Specifications' },
        { id: 'attr6', name: 'OpeningCapacity', label: 'Opening Capacity (inch)', type: AttributeType.NUMBER, isRequired: true, group: 'Specifications' },
        { id: 'attr7', name: 'MountType', label: 'Mounting Type', type: AttributeType.TEXT, isRequired: false, group: 'Specifications' },
      ]);
      setAttributeValues({});
    } else {
      setCategoryAttributes([]);
      setAttributeValues({});
    }
  };

  const handleAddCategory = (parentId?: string) => {
    console.log('Attempting to add category with parentId:', parentId);
    setEditingCategory(null);
    setCurrentParentId(parentId);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryNode) => {
    console.log('Attempting to edit category:', category);
    setEditingCategory(category);
    setCurrentParentId(category.parentId); // Keep track of original parent, though form might not use it directly for edit
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = (data: Omit<CategoryNode, 'id' | 'children'> & { id?: string }) => {
    if (editingCategory && data.id) { // Editing existing category, data.id should be present
      console.log('Submitting edit for category:', data.id, data);
      const editRecursive = (nodes: CategoryNode[]): CategoryNode[] => {
        return nodes.map(node => {
          if (node.id === data.id) { // Use data.id for matching
            return { ...node, name: data.name, description: data.description, parentId: data.parentId }; // Potentially update parentId if supported
          }
          if (node.children) {
            return { ...node, children: editRecursive(node.children) };
          }
          return node;
        });
      };
      setCategories(prev => editRecursive(prev));
    } else { // Creating new category
      const newCategoryNode: CategoryNode = {
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Always generate new ID for new category
        name: data.name,
        description: data.description,
        parentId: data.parentId || null, // Use parentId from submitted form data
        children: [],
      };
      console.log('Submitting new category:', newCategoryNode);

      if (data.parentId) {
        const addRecursive = (nodes: CategoryNode[]): CategoryNode[] => {
          return nodes.map(node => {
            if (node.id === data.parentId) {
              return { ...node, children: [...(node.children || []), newCategoryNode] };
            }
            if (node.children) {
              return { ...node, children: addRecursive(node.children) };
            }
            return node;
          });
        };
        setCategories(prev => addRecursive(prev));
      } else {
        setCategories(prev => [...prev, newCategoryNode]);
      }
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
    setCurrentParentId(null);
  };

  const handleDeleteCategory = (category: CategoryNode) => {
    console.log('Delete category:', category);
    // TODO: Confirm and delete category (ensure no children or handle cascading delete)
    // For now, let's remove it from mock data if it has no children
    if (!category.children || category.children.length === 0) {
      const removeRecursive = (nodes: CategoryNode[], idToRemove: string): CategoryNode[] => {
        return nodes.filter(node => node.id !== idToRemove).map(node => {
          if (node.children) {
            return { ...node, children: removeRecursive(node.children, idToRemove) };
          }
          return node;
        });
      };
      setCategories(prev => removeRecursive(prev, category.id));
    }
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <h1 className="text-2xl font-bold mb-4">Category Management</h1>
        <CategoryTree
          categories={categories}
          onSelectCategory={handleSelectCategory}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          selectedCategoryId={selectedCategory?.id}
        />
      </div>
      <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        {selectedCategory ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Details: {selectedCategory.name}</h2>
            <p>ID: {selectedCategory.id}</p>
            <p>Description: {selectedCategory.description || 'N/A'}</p>
            <p>Parent ID: {selectedCategory.parentId || 'Root'}</p>
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Custom Attributes</h3>
              {categoryAttributes.length > 0 ? (
                <form onSubmit={(e) => e.preventDefault()}> {/* Prevent page reload on enter */}
                  {categoryAttributes.map((attr) => (
                    <DynamicAttributeFormField
                      key={attr.id}
                      attribute={attr}
                      value={attributeValues[attr.id]}
                      onChange={(newValue) => {
                        setAttributeValues(prev => ({ ...prev, [attr.id]: newValue }));
                        console.log(`Attribute ${attr.name} changed to:`, newValue);
                      }}
                    />
                  ))}
                  <Button type="button" onClick={() => console.log('Current Attribute Values:', attributeValues)} className="mt-4">
                    Save Attributes (Mock)
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  {selectedCategory ? 'No custom attributes defined for this category.' : 'Select a category to manage its attributes.'}
                </p>
              )}
              {/* TODO: Implement actual attribute definition management (add/edit/delete attributes for a category) */}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a category to see its details.</p>
        )}
      </div>
      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCategory(null);
          setCurrentParentId(null);
        }}
        onSubmit={handleDialogSubmit}
        category={editingCategory}
        parentId={editingCategory ? editingCategory.parentId : currentParentId}
      />
    </div>
  );
};

export default CategoryManagementPage;
