import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toolService, { type Tool } from '@/services/toolService';

// Define ToolStatus type based on the Tool interface
type ToolStatus = Tool['status'];

/**
 * Tool detail page component
 * Displays detailed information about a specific tool
 */
const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tool data on initial render
  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const toolData = await toolService.getToolById(id);
        setTool(toolData);
      } catch (err: any) {
        console.error('Failed to fetch tool data:', err);
        setError('Failed to load tool information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  // Navigate to edit tool page
  const handleEditTool = () => {
    navigate(`/tools/edit/${id}`);
  };

  // Navigate back to tools list
  const handleBackToList = () => {
    navigate('/tools');
  };

  // Handle tool status change
  const handleStatusChange = async (newStatus: ToolStatus) => {
    if (!id || !tool) return;
    
    try {
      await toolService.updateTool(id, { ...tool, status: newStatus });
      // Refresh tool data
      const updatedTool = await toolService.getToolById(id);
      setTool(updatedTool);
    } catch (err: any) {
      console.error('Failed to update tool status:', err);
      setError('Failed to update tool status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="container py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error || 'Tool not found'}
        </div>
        <Button onClick={handleBackToList} className="mt-4">Back to Tools</Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleBackToList}>Back</Button>
          <Button onClick={handleEditTool}>Edit Tool</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p>{tool.serialNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Part Number</p>
                  {/* <p>{tool.partNumber || 'N/A'}</p> // partNumber does not exist on Tool interface */}
                  <p>N/A</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{tool.description || 'No description available'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{tool.categoryId || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center space-x-2">
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p>{tool.purchaseDate ? new Date(tool.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p>{tool.purchasePrice ? `$${tool.purchasePrice.toFixed(2)}` : 'N/A'}</p>
                </div>
              </div>
              
              {tool.vendorId && (
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p>{tool.vendorId}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* 
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {tool.attributes && tool.attributes.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {tool.attributes.map((attr: any, index: number) => ( // Added types for attr and index for completeness if uncommented
                    <div key={index}>
                      <p className="text-sm text-muted-foreground">{attr.name}</p>
                      <p>{attr.value} {attr.unit || ''}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available</p>
              )}
            </CardContent>
          </Card>
          // Attributes are not directly on the Tool object. This section needs rework based on how ToolAttributeValue is fetched and related to CategoryAttributeDefinition.
          */}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Change Status</p>
                <div className="space-y-2">
                  <Button 
                    variant={tool.status === 'AVAILABLE' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => handleStatusChange('AVAILABLE')}
                    disabled={tool.status === 'AVAILABLE'}
                  >
                    Mark as Available
                  </Button>
                  <Button 
                    variant={tool.status === 'IN_USE' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => handleStatusChange('IN_USE')}
                    disabled={tool.status === 'IN_USE'}
                  >
                    Mark as In Use
                  </Button>
                  <Button 
                    variant={tool.status === 'MAINTENANCE' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => handleStatusChange('MAINTENANCE')}
                    disabled={tool.status === 'MAINTENANCE'}
                  >
                    Mark for Maintenance
                  </Button>
                  <Button 
                    variant={tool.status === 'RETIRED' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => handleStatusChange('RETIRED')}
                    disabled={tool.status === 'RETIRED'}
                  >
                    Mark as Retired
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No maintenance records available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
