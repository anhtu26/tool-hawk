import React from 'react';
import ToolForm from '../../components/forms/ToolForm';

/**
 * Create tool page component
 */
const CreateToolPage: React.FC = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Tool</h1>
      <div className="max-w-4xl">
        <ToolForm />
      </div>
    </div>
  );
};

export default CreateToolPage;
