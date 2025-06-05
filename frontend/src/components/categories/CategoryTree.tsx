import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Edit, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

export interface CategoryNode {
  id: string;
  name: string;
  description?: string;
  children?: CategoryNode[];
  parentId?: string | null;
}

interface CategoryTreeProps {
  categories: CategoryNode[];
  onSelectCategory: (category: CategoryNode) => void;
  onAddCategory: (parentId?: string) => void;
  onEditCategory: (category: CategoryNode) => void;
  onDeleteCategory: (category: CategoryNode) => void;
  selectedCategoryId?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  selectedCategoryId
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderCategoryNode = (category: CategoryNode, level = 0) => {
    const isExpanded = expandedNodes[category.id];
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = category.id === selectedCategoryId;

    return (
      <div key={category.id} className="category-tree-node">
        <div 
          className={cn(
            "flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
            isSelected && "bg-blue-100 dark:bg-blue-900"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={() => toggleNode(category.id)}
              className="mr-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-6"></span>
          )}
          
          <div 
            className="flex items-center flex-1 py-1"
            onClick={() => onSelectCategory(category)}
          >
            {isExpanded ? <FolderOpen size={18} className="mr-2 text-amber-500" /> : <Folder size={18} className="mr-2 text-amber-500" />}
            <span className="truncate">{category.name}</span>
          </div>
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onAddCategory(category.id);
              }}
              title="Add subcategory"
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEditCategory(category);
              }}
              title="Edit category"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category);
              }}
              title="Delete category"
              disabled={hasChildren}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children!.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="category-tree border rounded-md p-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Categories</h3>
        <Button
          size="sm"
          onClick={() => onAddCategory()}
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add Root Category
        </Button>
      </div>
      
      <div className="category-tree-container">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          categories.map(category => renderCategoryNode(category))
        )}
      </div>
    </div>
  );
};

export default CategoryTree;
