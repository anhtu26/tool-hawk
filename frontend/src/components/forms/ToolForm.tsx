import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import toolService from '../../services/toolService';
import type { ToolCategory } from '../../services/toolService';

// Define ToolAttribute interface locally since we're having import issues
interface ToolAttribute {
  name: string;
  value: string;
  unit?: string;
}

// Define validation schema using Zod
const toolSchema = z.object({
  name: z.string().min(1, 'Tool name is required'),
  serialNumber: z.string().optional(),
  partNumber: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'BROKEN']),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional(),
  vendorId: z.string().optional(),
});

// Infer the type from the schema
type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolFormProps {
  toolId?: string; // If provided, we're editing an existing tool
}

const ToolForm: React.FC<ToolFormProps> = ({ toolId }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [attributes, setAttributes] = useState<ToolAttribute[]>([]);
  const [vendors, setVendors] = useState<any[]>([]); // Simplified for now

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      serialNumber: '',
      partNumber: '',
      description: '',
      categoryId: '',
      status: 'AVAILABLE',
      purchaseDate: '',
      purchasePrice: '',
      vendorId: '',
    },
  });

  // Load categories and tool data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await toolService.getToolCategories();
        setCategories(categoriesData);

        // Fetch vendors (simplified for now)
        // In a real implementation, this would call a vendor service
        setVendors([
          { id: '1', name: 'Vendor 1' },
          { id: '2', name: 'Vendor 2' },
        ]);

        // If editing an existing tool, fetch its data
        if (toolId) {
          const toolData = await toolService.getToolById(toolId);
          
          // Set form values
          setValue('name', toolData.name);
          setValue('serialNumber', toolData.serialNumber || '');
          setValue('partNumber', toolData.partNumber || '');
          setValue('description', toolData.description || '');
          setValue('categoryId', toolData.category?.id || '');
          setValue('status', toolData.status);
          setValue('purchaseDate', toolData.purchaseDate ? new Date(toolData.purchaseDate).toISOString().split('T')[0] : '');
          setValue('purchasePrice', toolData.purchasePrice ? toolData.purchasePrice.toString() : '');
          setValue('vendorId', toolData.vendor?.id || '');
          
          // Set attributes
          setAttributes(toolData.attributes || []);
        }
      } catch (err: any) {
        console.error('Failed to fetch form data:', err);
        setError('Failed to load form data. Please try again later.');
      }
    };

    fetchData();
  }, [toolId, setValue]);

  // Handle form submission
  const onSubmit = async (data: ToolFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert string price to number if provided
      const formattedData = {
        ...data,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
        attributes: attributes,
      };

      if (toolId) {
        // Update existing tool
        await toolService.updateTool(toolId, formattedData as any);
        navigate(`/tools/${toolId}`);
      } else {
        // Create new tool
        const newTool = await toolService.createTool(formattedData as any);
        navigate(`/tools/${newTool.id}`);
      }
    } catch (err: any) {
      console.error('Failed to save tool:', err);
      setError(err.message || 'Failed to save tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle attribute changes
  const handleAttributeChange = (index: number, field: 'name' | 'value' | 'unit', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  // Add a new attribute
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '', unit: '' }]);
  };

  // Remove an attribute
  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{toolId ? 'Edit Tool' : 'Add New Tool'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tool Name *
            </label>
            <Input
              id="name"
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="serialNumber" className="text-sm font-medium">
                Serial Number
              </label>
              <Input
                id="serialNumber"
                {...register('serialNumber')}
                aria-invalid={errors.serialNumber ? 'true' : 'false'}
              />
              {errors.serialNumber && (
                <p className="text-destructive text-sm mt-1">{errors.serialNumber.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="partNumber" className="text-sm font-medium">
                Part Number
              </label>
              <Input
                id="partNumber"
                {...register('partNumber')}
                aria-invalid={errors.partNumber ? 'true' : 'false'}
              />
              {errors.partNumber && (
                <p className="text-destructive text-sm mt-1">{errors.partNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('description')}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="categoryId"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('categoryId')}
                aria-invalid={errors.categoryId ? 'true' : 'false'}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-destructive text-sm mt-1">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status *
              </label>
              <select
                id="status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('status')}
                aria-invalid={errors.status ? 'true' : 'false'}
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="BROKEN">Broken</option>
              </select>
              {errors.status && (
                <p className="text-destructive text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="purchaseDate" className="text-sm font-medium">
                Purchase Date
              </label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
                aria-invalid={errors.purchaseDate ? 'true' : 'false'}
              />
              {errors.purchaseDate && (
                <p className="text-destructive text-sm mt-1">{errors.purchaseDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="purchasePrice" className="text-sm font-medium">
                Purchase Price ($)
              </label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                {...register('purchasePrice')}
                aria-invalid={errors.purchasePrice ? 'true' : 'false'}
              />
              {errors.purchasePrice && (
                <p className="text-destructive text-sm mt-1">{errors.purchasePrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="vendorId" className="text-sm font-medium">
              Vendor
            </label>
            <select
              id="vendorId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('vendorId')}
              aria-invalid={errors.vendorId ? 'true' : 'false'}
            >
              <option value="">Select Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            {errors.vendorId && (
              <p className="text-destructive text-sm mt-1">{errors.vendorId.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Technical Specifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddAttribute}>
                Add Specification
              </Button>
            </div>
            
            {attributes.map((attr, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label className="text-xs">Name</label>
                  <Input
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    placeholder="e.g., Diameter"
                  />
                </div>
                <div>
                  <label className="text-xs">Value</label>
                  <Input
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label className="text-xs">Unit</label>
                    <Input
                      value={attr.unit}
                      onChange={(e) => handleAttributeChange(index, 'unit', e.target.value)}
                      placeholder="e.g., mm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tools')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (toolId ? 'Update Tool' : 'Create Tool')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ToolForm;
