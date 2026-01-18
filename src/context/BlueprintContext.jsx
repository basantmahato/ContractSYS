import React, { createContext, useState, useContext, useEffect } from 'react';

const BlueprintContext = createContext();

export const BlueprintProvider = ({ children }) => {
  // Dummy blueprint data
  const getDummyBlueprints = () => {
    return [
      {
        id: 'blueprint-1',
        name: 'Standard Service Contract',
        description: 'Template for service agreements',
        fields: [
          {
            id: 'field-1',
            type: 'Text',
            label: 'Contract Name',
            position: { x: 50, y: 100 },
            required: true
          },
          {
            id: 'field-2',
            type: 'Text',
            label: 'Client Name',
            position: { x: 50, y: 150 },
            required: true
          },
          {
            id: 'field-3',
            type: 'Date',
            label: 'Start Date',
            position: { x: 50, y: 200 },
            required: true
          },
          {
            id: 'field-4',
            type: 'Date',
            label: 'End Date',
            position: { x: 300, y: 200 },
            required: false
          },
          {
            id: 'field-5',
            type: 'Text',
            label: 'Contract Value',
            position: { x: 50, y: 250 },
            required: false
          },
          {
            id: 'field-6',
            type: 'Text',
            label: 'Description',
            position: { x: 50, y: 300 },
            required: false
          },
          {
            id: 'field-7',
            type: 'Signature',
            label: 'Signature',
            position: { x: 50, y: 450 },
            required: true
          },
          {
            id: 'field-8',
            type: 'Checkbox',
            label: 'Terms and Conditions Accepted',
            position: { x: 50, y: 550 },
            required: true
          }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      {
        id: 'blueprint-2',
        name: 'Employment Contract',
        description: 'Template for employment agreements',
        fields: [
          {
            id: 'field-1',
            type: 'Text',
            label: 'Employee Name',
            position: { x: 50, y: 100 },
            required: true
          },
          {
            id: 'field-2',
            type: 'Text',
            label: 'Position',
            position: { x: 50, y: 150 },
            required: true
          },
          {
            id: 'field-3',
            type: 'Date',
            label: 'Start Date',
            position: { x: 50, y: 200 },
            required: true
          },
          {
            id: 'field-4',
            type: 'Text',
            label: 'Salary',
            position: { x: 50, y: 250 },
            required: true
          },
          {
            id: 'field-5',
            type: 'Signature',
            label: 'Employee Signature',
            position: { x: 50, y: 400 },
            required: true
          },
          {
            id: 'field-6',
            type: 'Signature',
            label: 'Employer Signature',
            position: { x: 300, y: 400 },
            required: true
          },
          {
            id: 'field-7',
            type: 'Checkbox',
            label: 'Background Check Completed',
            position: { x: 50, y: 500 },
            required: true
          }
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    ];
  };

  const [blueprints, setBlueprints] = useState(() => {
    const saved = localStorage.getItem('blueprint_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDummyBlueprints();
      } catch (e) {
        return getDummyBlueprints();
      }
    }
    const dummyBlueprints = getDummyBlueprints();
    localStorage.setItem('blueprint_data', JSON.stringify(dummyBlueprints));
    return dummyBlueprints;
  });

  useEffect(() => {
    localStorage.setItem('blueprint_data', JSON.stringify(blueprints));
  }, [blueprints]);

  const addBlueprint = (newBlueprint) => {
    const blueprintEntry = {
      ...newBlueprint,
      id: `blueprint-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleDateString()
    };
    setBlueprints([...blueprints, blueprintEntry]);
    return blueprintEntry.id;
  };

  const getBlueprint = (id) => {
    return blueprints.find(b => b.id === id);
  };

  const updateBlueprint = (id, updatedBlueprint) => {
    setBlueprints(prev => prev.map(b => 
      b.id === id ? { ...b, ...updatedBlueprint } : b
    ));
  };

  const deleteBlueprint = (id) => {
    setBlueprints(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BlueprintContext.Provider value={{ 
      blueprints, 
      addBlueprint, 
      getBlueprint, 
      updateBlueprint,
      deleteBlueprint 
    }}>
      {children}
    </BlueprintContext.Provider>
  );
};

export const useBlueprints = () => useContext(BlueprintContext);

