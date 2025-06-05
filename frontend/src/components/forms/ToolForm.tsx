import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import type { ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Added
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Added
import toolService from '../../services/toolService';
import type { ToolCategory } from '../../services/toolService';

// Define ToolAttribute interface locally
interface ToolAttribute {
  name: string;
  value: string;
  unit?: string;
}

const toolSchema = z.object({
  name: z.string().min(1, 'Tool name is required'),
  serialNumber: z.string().optional(),
  partNumber: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'BROKEN']),
  purchaseDate: z.string().optional(), // Keep as string for date input, conversion handled in onSubmit
  purchasePrice: z.string().optional(), // Keep as string for number input, conversion handled in onSubmit
  vendorId: z.string().optional(),
});

type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolFormProps {
  toolId?: string;
}

const ToolForm: React.FC<ToolFormProps> = ({ toolId }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [attributes, setAttributes] = useState<ToolAttribute[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const form = useForm<ToolFormValues>({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await toolService.getToolCategories();
        setCategories(categoriesData);
        setVendors([
          { id: '1', name: 'Vendor 1' },
          { id: '2', name: 'Vendor 2' },
        ]);

        if (toolId) {
          const toolData = await toolService.getToolById(toolId);
          form.setValue('name', toolData.name);
          form.setValue('serialNumber', toolData.serialNumber || '');
          form.setValue('partNumber', toolData.partNumber || '');
          form.setValue('description', toolData.description || '');
          form.setValue('categoryId', toolData.category?.id || '');
          form.setValue('status', toolData.status);
          form.setValue('purchaseDate', toolData.purchaseDate ? new Date(toolData.purchaseDate).toISOString().split('T')[0] : '');
          form.setValue('purchasePrice', toolData.purchasePrice ? toolData.purchasePrice.toString() : '');
          form.setValue('vendorId', toolData.vendor?.id || '');
          setAttributes(toolData.attributes || []);
        }
      } catch (err: any) {
        console.error('Failed to fetch form data:', err);
        setError('Failed to load form data. Please try again later.');
      }
    };
    fetchData();
  }, [toolId, form.setValue, form]); // Added form to dependency array for setValue stability

  const onSubmit = async (data: ToolFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formattedData = {
        ...data,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
        attributes: attributes,
      };
      if (toolId) {
        await toolService.updateTool(toolId, formattedData as any);
        navigate(`/tools/${toolId}`);
      } else {
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

  const handleAttributeChange = (index: number, field: 'name' | 'value' | 'unit', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '', unit: '' }]);
  };

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'name'> }) => (
                <FormItem>
                  <FormLabel>Tool Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tool name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'serialNumber'> }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'partNumber'> }) => (
                  <FormItem>
                    <FormLabel>Part Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter part number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'description'> }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'categoryId'> }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="status"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'status'> }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="IN_USE">In Use</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="BROKEN">Broken</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'purchaseDate'> }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'purchasePrice'> }) => (
                  <FormItem>
                    <FormLabel>Purchase Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }: { field: ControllerRenderProps<ToolFormValues, 'vendorId'> }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map(vendor => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Technical Specifications Section - Remains unchanged for now */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Technical Specifications</h3>
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
                        value={attr.unit || ''} // Ensure value is not null/undefined for Input
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
              disabled={isSubmitting || !form.formState.isDirty && toolId !== undefined}
            >
              {isSubmitting ? 'Saving...' : (toolId ? 'Update Tool' : 'Create Tool')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ToolForm;
