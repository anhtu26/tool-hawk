import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import type { AttributeGroup as AttributeGroupType } from '../components/categories/AttributeGroupForm';
import type { Attribute as AttributeType } from '../components/categories/AttributeListItem';
import type { AttributeFormValues } from '../components/categories/AttributeFormSchema';
import { mockAttributes, mockAttributeGroups } from '../pages/categories/mockData'; // Adjust path as needed

export interface UseAttributeCrudProps {
  categoryId: string;
}

export const useAttributeCrud = ({ categoryId }: UseAttributeCrudProps) => {
  const [attributes, setAttributes] = useState<AttributeType[]>(mockAttributes);
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroupType[]>(mockAttributeGroups);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // For AttributeForm
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false); // For AttributeGroupForm
  const [selectedGroup, setSelectedGroup] = useState<AttributeGroupType | null>(null);

  useEffect(() => {
    // In a real application, fetch attributes and groups for the given categoryId
    // For now, mock data is initialized in useState
    // console.log('Hook - Category ID:', categoryId);
    // setAttributes(mockAttributes); // Already set in useState initial
    // setAttributeGroups(mockAttributeGroups); // Already set in useState initial
  }, [categoryId]);

  // Attribute Handlers
  const handleAddAttribute = () => {
    setFormMode('create');
    setSelectedAttribute(null);
    setIsFormOpen(true);
  };

  const handleEditAttribute = (attribute: AttributeType) => {
    setSelectedAttribute(attribute);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteAttribute = (attribute: AttributeType) => {
    setSelectedAttribute(attribute);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAttribute = () => {
    if (!selectedAttribute) return;
    setAttributes(prev => prev.filter(attr => attr.id !== selectedAttribute.id));
    toast.success('Attribute deleted', {
      description: `${selectedAttribute.label} has been deleted successfully.`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedAttribute(null);
  };

  const handleFormSubmit = async (data: AttributeFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (formMode === 'create') {
        const newAttribute: AttributeType = {
          id: `new-${Date.now()}`,
          ...data,
          // categoryId, // categoryId is part of the hook's scope
          sortOrder: attributes.length + 1,
          attributeGroup: data.attributeGroupId 
            ? (() => {
                const foundGroup = attributeGroups.find(ag => ag.id === data.attributeGroupId);
                return foundGroup && foundGroup.id 
                  ? { id: foundGroup.id, name: foundGroup.name, sortOrder: foundGroup.sortOrder }
                  : undefined;
              })()
            : undefined,
        };
        setAttributes(prev => [...prev, newAttribute]);
        toast.success('Attribute created', {
          description: `${data.label} has been created successfully.`,
        });
      } else if (selectedAttribute) {
        setAttributes(prev => prev.map(attr =>
          attr.id === selectedAttribute.id ? { 
            ...attr, 
            ...data, 
            attributeGroup: data.attributeGroupId 
              ? (() => {
                  const foundGroup = attributeGroups.find(ag => ag.id === data.attributeGroupId);
                  return foundGroup && foundGroup.id
                    ? { id: foundGroup.id, name: foundGroup.name, sortOrder: foundGroup.sortOrder }
                    : undefined;
                })()
              : undefined,
          } : attr
        ));
        toast.success('Attribute updated', {
          description: `${data.label} has been updated successfully.`,
        });
      }
      setIsSubmitting(false);
      setIsFormOpen(false);
      setSelectedAttribute(null);
    }, 500); // Simulate API call
  };

  // Attribute Group Handlers
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: AttributeGroupType) => {
    setSelectedGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleGroupFormSubmit = (data: AttributeGroupType) => {
    setTimeout(() => {
      if (!selectedGroup) { // Creating a new group
        const newGroup = {
          id: `new-group-${Date.now()}`,
          ...data,
          // categoryId, // categoryId is part of the hook's scope
          sortOrder: attributeGroups.length + 1,
        };
        setAttributeGroups(prev => [...prev, newGroup]);
        toast.success('Group created', {
          description: `${data.name} has been created successfully.`,
        });
      } else { // Editing existing group
        setAttributeGroups(prev => prev.map(group =>
          group.id === selectedGroup.id ? { ...group, ...data } : group
        ));
        toast.success('Group updated', {
          description: `${data.name} has been updated successfully.`,
        });
      }
      setIsGroupFormOpen(false);
      setSelectedGroup(null);
    }, 500); // Simulate API call
  };

  // Derived state
  const attributesByGroup = useMemo(() => {
    return attributeGroups.map(group => ({
      ...group,
      attributes: attributes.filter(attr => attr.attributeGroup?.id === group.id)
    })).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [attributes, attributeGroups]);

  const ungroupedAttributes = useMemo(() => {
    return attributes.filter(attr => !attr.attributeGroup)
                     .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [attributes]);

  const preparedAttributeForForm = useMemo(() => {
    if (!selectedAttribute) return undefined;
    return {
      ...selectedAttribute,
      name: selectedAttribute.name || '',
      label: selectedAttribute.label || '',
      attributeType: selectedAttribute.attributeType || '', 
      isRequired: selectedAttribute.isRequired === undefined ? false : selectedAttribute.isRequired,
      isFilterable: selectedAttribute.isFilterable === undefined ? false : selectedAttribute.isFilterable,
      isSearchable: selectedAttribute.isSearchable === undefined ? false : selectedAttribute.isSearchable,
      attributeGroupId: selectedAttribute.attributeGroup?.id ?? undefined,
      options: selectedAttribute.options || undefined,
      validationRules: selectedAttribute.validationRules || undefined,
      defaultValue: selectedAttribute.defaultValue,
      tooltip: selectedAttribute.tooltip,
    } as AttributeFormValues; // Cast to ensure compatibility with form
  }, [selectedAttribute]);

  return {
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
  };
};
