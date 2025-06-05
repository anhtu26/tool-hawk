import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { attributeSchema, AttributeFormValues } from './AttributeFormSchema';
import AttributeFormBasicTab from './AttributeFormBasicTab';
import AttributeFormValidationTab from './AttributeFormValidationTab';
import AttributeFormAdvancedTab from './AttributeFormAdvancedTab';

interface AttributeFormProps {
  attribute?: Partial<AttributeFormValues>;
  attributeGroups: any[];
  onSubmit: (data: AttributeFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AttributeForm: React.FC<AttributeFormProps> = ({
  attribute,
  attributeGroups,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedType, setSelectedType] = useState(attribute?.attributeType || 'TEXT');
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    attribute?.options || []
  );

  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: attribute?.name || '',
      label: attribute?.label || '',
      attributeType: attribute?.attributeType || 'TEXT',
      isRequired: attribute?.isRequired || false,
      defaultValue: attribute?.defaultValue || null,
      tooltip: attribute?.tooltip || '',
      isFilterable: attribute?.isFilterable || false,
      isSearchable: attribute?.isSearchable || false,
      attributeGroupId: attribute?.attributeGroupId || null,
      validationRules: attribute?.validationRules || {},
      options: attribute?.options || []
    },
  });

  // Update form when attribute type changes
  useEffect(() => {
    setSelectedType(form.watch('attributeType'));
  }, [form.watch('attributeType')]);

  const handleSubmit = (data: AttributeFormValues) => {
    // Add options to the data if the type is SELECT_SINGLE or SELECT_MULTIPLE
    if (selectedType === 'SELECT_SINGLE' || selectedType === 'SELECT_MULTIPLE') {
      data.options = options;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <AttributeFormBasicTab form={form} attributeGroups={attributeGroups} />
          </TabsContent>
          
          <TabsContent value="validation">
            <AttributeFormValidationTab 
              form={form} 
              selectedType={selectedType}
              options={options}
              setOptions={setOptions}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AttributeFormAdvancedTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : attribute ? 'Update Attribute' : 'Create Attribute'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AttributeForm;
