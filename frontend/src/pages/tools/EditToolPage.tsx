import React from 'react';
import { useParams } from 'react-router-dom';
import ToolForm from '../../components/forms/ToolForm';

/**
 * Edit tool page component
 */
const EditToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="container py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          Tool ID is missing. Please go back to the tools list and select a tool to edit.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Tool</h1>
      <div className="max-w-4xl">
        <ToolForm toolId={id} />
      </div>
    </div>
  );
};

export default EditToolPage;
