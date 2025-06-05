/**
 * Service for tool-related API requests
 */
import api from './api';

// Define types for tool-related data
export interface Tool {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  serialNumber?: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  expectedLifespan?: number;
  manufacturerId?: string;
  vendorId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  attributes?: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryAttribute {
  id: string;
  name: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'ENUM';
  required: boolean;
  options?: string[];
  defaultValue?: string;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolFilter {
  categoryId?: string;
  status?: string;
  search?: string;
  vendorId?: string;
  manufacturerId?: string;
  page?: number;
  limit?: number;
}

/**
 * Tool service for handling tool-related API requests
 */
const toolService = {
  /**
   * Get a list of tools with optional filtering
   */
  getTools: (filters?: ToolFilter) => {
    return api.get<{ data: Tool[]; total: number; page: number; limit: number }>('/tools')
      // Add filters to query params if they exist (commented out for now due to TypeScript error)
      // We'll implement proper filtering when connecting to the real API
      .then(response => response.data || []); // For now, return mock data
  },

  /**
   * Get a specific tool by ID
   */
  getToolById: (id: string) => {
    return api.get<Tool>(`/tools/${id}`)
      .then(() => {
        // Mock data for development
        return {
          id,
          name: 'Sample Tool',
          serialNumber: 'SN12345',
          partNumber: 'PT-789',
          description: 'This is a sample tool for development',
          categoryId: '1',
          status: 'AVAILABLE' as const,
          purchaseDate: '2023-01-15',
          purchasePrice: 299.99,
          vendorId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: { id: '1', name: 'Cutting Tools', createdAt: '', updatedAt: '' },
          vendor: { id: '1', name: 'Acme Tools', createdAt: '', updatedAt: '' },
          attributes: [
            { name: 'Diameter', value: '10', unit: 'mm' },
            { name: 'Length', value: '100', unit: 'mm' },
            { name: 'Material', value: 'Carbide', unit: '' }
          ]
        };
      });
  },

  /**
   * Create a new tool
   */
  createTool: (toolData: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'vendor'>) => {
    return api.post<Tool>('/tools', toolData)
      .then(() => {
        // Mock response for development
        return {
          ...toolData,
          id: Math.random().toString(36).substring(2, 11),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Tool;
      });
  },

  /**
   * Update an existing tool
   */
  updateTool: (id: string, toolData: Partial<Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'vendor'>>) => {
    return api.put<Tool>(`/tools/${id}`, toolData)
      .then(() => {
        // Mock response for development
        return {
          ...toolData,
          id,
          updatedAt: new Date().toISOString()
        } as Tool;
      });
  },

  /**
   * Delete a tool
   */
  deleteTool: (id: string) => {
    return api.delete<void>(`/tools/${id}`);
  },

  /**
   * Get a list of tool categories
   */
  getToolCategories: () => {
    return api.get<ToolCategory[]>('/tools/categories')
      .then(() => {
        // Mock data for development
        return [
          { id: '1', name: 'Cutting Tools', createdAt: '', updatedAt: '' },
          { id: '2', name: 'Measuring Tools', createdAt: '', updatedAt: '' },
          { id: '3', name: 'Hand Tools', createdAt: '', updatedAt: '' },
          { id: '4', name: 'Power Tools', createdAt: '', updatedAt: '' },
        ];
      });
  },

  /**
   * Get a specific tool category by ID
   */
  getCategory: (id: string) => {
    return api.get<ToolCategory>(`/tools/categories/${id}`);
  },

  /**
   * Create a new tool category
   */
  createCategory: (categoryData: Omit<ToolCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    return api.post<ToolCategory>('/tools/categories', categoryData);
  },

  /**
   * Update an existing tool category
   */
  updateCategory: (id: string, categoryData: Partial<Omit<ToolCategory, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return api.put<ToolCategory>(`/tools/categories/${id}`, categoryData);
  },

  /**
   * Delete a tool category
   */
  deleteCategory: (id: string) => {
    return api.delete<void>(`/tools/categories/${id}`);
  },
};

export default toolService;
