import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import toolService from '../../services/toolService';
import type { Tool, ToolCategory, ToolFilter } from '../../services/toolService';

/**
 * Tools list page component
 * Displays a list of tools with filtering and pagination
 */
const ToolsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<ToolFilter>({
    categoryId: '',
    status: '',
    page: 1,
    limit: 10
  });

  // Load tools and categories on initial render
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch categories first
        const categoriesData = await toolService.getToolCategories();
        setCategories(categoriesData);
        
        // Then fetch tools with current filters
        const toolsData = await toolService.getTools(filters);
        setTools(toolsData);
      } catch (err: any) {
        console.error('Failed to fetch tools data:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev: ToolFilter) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev: ToolFilter) => ({ ...prev, categoryId: e.target.value, page: 1 }));
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev: ToolFilter) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev: ToolFilter) => ({ ...prev, page: newPage }));
  };

  // Navigate to tool details page
  const handleViewTool = (id: string) => {
    navigate(`/tools/${id}`);
  };

  // Navigate to create tool page
  const handleCreateTool = () => {
    navigate('/tools/create');
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tools</h1>
        <Button onClick={handleCreateTool}>Add New Tool</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow"
              />
              <Button type="submit">Search</Button>
            </form>
            
            <div>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status}
                onChange={handleStatusChange}
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="BROKEN">Broken</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tools found. Try adjusting your filters or add a new tool.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(tool => (
              <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewTool(tool.id)}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.serialNumber}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        tool.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        tool.status === 'IN_USE' ? 'bg-blue-100 text-blue-800' :
                        tool.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">Category: {categories.find(cat => cat.id === tool.categoryId)?.name || 'Uncategorized'}</p>
                    {tool.vendorId && <p className="text-sm">Vendor ID: {tool.vendorId}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange((filters.page ?? 1) - 1)}
              disabled={(filters.page ?? 1) <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange((filters.page ?? 1) + 1)}
              disabled={tools.length < (filters.limit ?? 10)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ToolsListPage;
