// frontend/src/components/attributes/DynamicAttributeFormField.tsx (intended path)
import React from 'react';
// Adjust the import path once attribute.types.ts is moved
import { CategoryAttributeDefinition, AttributeType } from '../../types/attribute.types'; 
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DynamicAttributeFormFieldProps {
  attribute: CategoryAttributeDefinition;
  value: any;
  onChange: (value: any) => void;
}

const DynamicAttributeFormField: React.FC<DynamicAttributeFormFieldProps> = ({
  attribute,
  value,
  onChange,
}) => {
  const renderField = () => {
    switch (attribute.type) {
      case AttributeType.TEXT:
        return (
          <Input
            type="text"
            id={attribute.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={attribute.label}
            required={attribute.isRequired}
          />
        );
      case AttributeType.NUMBER:
        return (
          <Input
            type="number"
            id={attribute.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder={attribute.label}
            required={attribute.isRequired}
            min={attribute.minValue}
            max={attribute.maxValue}
            step="any"
          />
        );
      case AttributeType.BOOLEAN:
        return (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id={attribute.id}
              checked={!!value}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <Label htmlFor={attribute.id} className="font-normal">
              {attribute.label}
            </Label>
          </div>
        );
      case AttributeType.DATE:
        return (
          <Input
            type="date"
            id={attribute.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={attribute.isRequired}
          />
        );
      case AttributeType.SELECT:
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            required={attribute.isRequired}
          >
            <SelectTrigger id={attribute.id}>
              <SelectValue placeholder={`Select ${attribute.label}`} />
            </SelectTrigger>
            <SelectContent>
              {attribute.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <p>Unsupported attribute type: {attribute.type}</p>;
    }
  };

  const showSeparateLabel = attribute.type !== AttributeType.BOOLEAN;

  return (
    <div className="mb-4">
      {showSeparateLabel && (
        <Label htmlFor={attribute.id} className="mb-1 block">
          {attribute.label} {attribute.isRequired && <span className="text-red-500">*</span>}
        </Label>
      )}
      {renderField()}
      {attribute.description && (
        <p className="text-xs text-gray-500 mt-1">{attribute.description}</p>
      )}
    </div>
  );
};

export default DynamicAttributeFormField;
