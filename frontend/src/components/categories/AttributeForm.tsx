import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Define the attribute types
const attributeTypes = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'DATE', label: 'Date' },
  { value: 'SELECT_SINGLE', label: 'Single Select' },
  { value: 'SELECT_MULTIPLE', label: 'Multiple Select' },
  { value: 'FILE', label: 'File' }
];

// Form validation schema
const attributeSchema = z.object({
  name: z.string()
    .min(1, 'Attribute name is required')
    .max(50, 'Attribute name cannot exceed 50 characters')
    .regex(/^[a-z][a-z0-9_]*$/, 'Name must start with lowercase letter and contain only lowercase letters, numbers, and underscores'),
  label: z.string().min(1, 'Display label is required').max(100, 'Label cannot exceed 100 characters'),
  attributeType: z.string().min(1, 'Attribute type is required'),
  isRequired: z.boolean().default(false),
  defaultValue: z.any().optional().nullable(),
  tooltip: z.string().optional().nullable(),
  isFilterable: z.boolean().default(false),
  isSearchable: z.boolean().default(false),
  attributeGroupId: z.string().optional().nullable(),
  validationRules: z.any().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
});

type AttributeFormValues = z.infer<typeof attributeSchema>;

interface AttributeFormProps {
  attribute?: any;
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
      attributeGroupId: attribute?.attributeGroup?.id || null,
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

  const addOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
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
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attribute Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. diameter" {...field} />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Internal name used in the system. Use lowercase letters, numbers, and underscores.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Diameter" {...field} />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      User-friendly label shown in forms and tables.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="attributeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attributeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attributeGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute Group</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute group (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Group</SelectItem>
                      {attributeGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tooltip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Help Text / Tooltip (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter help text or tooltip" 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Required Field</FormLabel>
                    <p className="text-sm text-gray-500">
                      Make this attribute mandatory when creating or editing tools
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            {(selectedType === 'TEXT') && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validationRules.minLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Length</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validationRules.maxLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Length</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {(selectedType === 'NUMBER') && (
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="validationRules.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Value</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validationRules.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Value</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validationRules.step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="e.g. 0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {(selectedType === 'SELECT_SINGLE' || selectedType === 'SELECT_MULTIPLE') && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Options</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    Add Option
                  </Button>
                </div>
                
                {options.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 border rounded-md">
                    No options defined. Click "Add Option" to create options.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Value (internal)"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Label (display)"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeOption(index)}
                          className="text-red-500"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <FormField
              control={form.control}
              name="isFilterable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Filterable</FormLabel>
                    <p className="text-sm text-gray-500">
                      Allow filtering tools by this attribute in lists and search
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isSearchable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Searchable</FormLabel>
                    <p className="text-sm text-gray-500">
                      Include this attribute in search results
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Pre-filled value when creating new tools
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
