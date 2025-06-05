import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import CategoryTree, { CategoryNode } from '../../components/categories/CategoryTree';
import CategoryForm from '../../components/categories/CategoryForm';
import AttributeManagement from './AttributeManagement';

// Mock data for demo
const mockCategories: CategoryNode[] = [
  {
    id: '1',
    name: 'Cutting Tools',
    description: 'Tools used for cutting operations',
    children: [
      {
        id: '2',
        name: 'End Mills',
        description: 'Cutting tools used for milling operations',
        parentId: '1',
        children: []
      },
      {
        id: '3',
        name: 'Drills',
        description: 'Tools used for drilling operations',
        parentId: '1',
        children: []
      }
    ]
  },
  {
    id: '4',
    name: 'Measuring Tools',
    description: 'Tools used for measurement',
    children: [
      {
        id: '5',
        name: 'Calipers',
        description: 'Tools used for precise measurements',
        parentId: '4',
        children: []
      }
    ]
  }
];

const CategoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryNode[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [parentCategory, setParentCategory] = useState<CategoryNode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // In a real application, you would fetch categories from the API
  useEffect(() => {
    // Fetch categories from API
    // For demo, we're using mock data
  }, []);

  const handleSelectCategory = (category: CategoryNode) => {
    setSelectedCategory(category);
    setActiveTab('details');
  };

  const handleAddCategory = (parentId?: string) => {
    setFormMode('create');
    setIsFormOpen(true);
    
    if (parentId) {
      const findParent = (categories: CategoryNode[]): CategoryNode | null => {
        for (const category of categories) {
          if (category.id === parentId) {
            return category;
          }
          if (category.children) {
            const found = findParent(category.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const parent = findParent(categories);
      setParentCategory(parent);
    } else {
      setParentCategory(null);
    }
  };

  const handleEditCategory = (category: CategoryNode) => {
    setSelectedCategory(category);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (category: CategoryNode) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (!selectedCategory) return;
    
    // In a real application, you would call the API to delete the category
    // For demo, we're just updating the state
    const removeCategory = (categories: CategoryNode[], id: string): CategoryNode[] => {
      return categories.filter(category => {
        if (category.id === id) return false;
        if (category.children) {
          category.children = removeCategory(category.children, id);
        }
        return true;
      });
    };
    
    const updatedCategories = removeCategory(categories, selectedCategory.id);
    setCategories(updatedCategories);
    
    toast({
      title: 'Category deleted',
      description: `${selectedCategory.name} has been deleted successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // In a real application, you would call the API to create/update the category
    // For demo, we're just updating the state
    setTimeout(() => {
      if (formMode === 'create') {
        const newCategory: CategoryNode = {
          id: `new-${Date.now()}`, // In a real app, this would come from the API
          name: data.name,
          description: data.description,
          parentId: parentCategory?.id,
          children: []
        };
        
        if (parentCategory) {
          // Add as child to parent
          const addChild = (categories: CategoryNode[]): CategoryNode[] => {
            return categories.map(category => {
              if (category.id === parentCategory.id) {
                return {
                  ...category,
                  children: [...(category.children || []), newCategory]
                };
              }
              if (category.children) {
                return {
                  ...category,
                  children: addChild(category.children)
                };
              }
              return category;
            });
          };
          
          setCategories(addChild(categories));
        } else {
          // Add as root category
          setCategories([...categories, newCategory]);
        }
        
        toast({
          title: 'Category created',
          description: `${data.name} has been created successfully.`,
        });
      } else {
        // Update existing category
        const updateCategory = (categories: CategoryNode[]): CategoryNode[] => {
          return categories.map(category => {
            if (category.id === selectedCategory?.id) {
              return {
                ...category,
                name: data.name,
                description: data.description
              };
            }
            if (category.children) {
              return {
                ...category,
                children: updateCategory(category.children)
              };
            }
            return category;
          });
        };
        
        setCategories(updateCategory(categories));
        
        toast({
          title: 'Category updated',
          description: `${data.name} has been updated successfully.`,
        });
      }
      
      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 500); // Simulate API call
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CategoryTree
            categories={categories}
            onSelectCategory={handleSelectCategory}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            selectedCategoryId={selectedCategory?.id}
          />
        </div>
        
        <div className="md:col-span-2">
          {selectedCategory ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedCategory.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1">{selectedCategory.description || 'No description provided.'}</p>
                      </div>
                      
                      {selectedCategory.parentId && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Parent Category</h3>
                          <p className="mt-1">
                            {categories.find(c => c.id === selectedCategory.parentId)?.name || 'Unknown'}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Subcategories</h3>
                        <p className="mt-1">
                          {selectedCategory.children && selectedCategory.children.length > 0
                            ? `${selectedCategory.children.length} subcategories`
                            : 'No subcategories'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attributes" className="pt-4">
                    <AttributeManagement categoryId={selectedCategory.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  Select a category to view its details or create a new category to get started.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' 
                ? parentCategory 
                  ? `Create Subcategory under ${parentCategory.name}` 
                  : 'Create Root Category' 
                : `Edit Category: ${selectedCategory?.name}`}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={formMode === 'edit' ? selectedCategory! : undefined}
            parentCategory={parentCategory || undefined}
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
              This will permanently delete the category "{selectedCategory?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManagement;
