import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { attributeTypes } from './AttributeFormSchema';
import { AttributeFormValues } from './AttributeFormSchema';

interface AttributeFormBasicTabProps {
  form: UseFormReturn<AttributeFormValues>;
  attributeGroups: any[];
}

const AttributeFormBasicTab: React.FC<AttributeFormBasicTabProps> = ({ form, attributeGroups }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AttributeFormBasicTab;
