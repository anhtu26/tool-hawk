import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { AttributeFormValues } from './AttributeFormSchema';

interface AttributeFormAdvancedTabProps {
  form: UseFormReturn<AttributeFormValues>;
}

const AttributeFormAdvancedTab: React.FC<AttributeFormAdvancedTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AttributeFormAdvancedTab;
