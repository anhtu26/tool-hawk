import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { AttributeFormValues } from './AttributeFormSchema';

interface AttributeFormValidationTabProps {
  form: UseFormReturn<AttributeFormValues>;
  selectedType: string;
  options: { value: string; label: string }[];
  setOptions: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
}

const AttributeFormValidationTab: React.FC<AttributeFormValidationTabProps> = ({ 
  form, 
  selectedType, 
  options, 
  setOptions 
}) => {
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
    <div className="space-y-4">
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
    </div>
  );
};

export default AttributeFormValidationTab;
