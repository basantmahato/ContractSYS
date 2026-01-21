import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlueprints } from '../context/BlueprintContext';

// Start of Blueprints component

const Blueprints = () => {
  const { blueprints, deleteBlueprint } = useBlueprints();
  const navigate = useNavigate();

  // End of Blueprints component

  // Start of handleDelete function

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      deleteBlueprint(id);
    }
  };

  // End of handleDelete function

  // Start of return statement

  return (
    <div className="container">
      <div className="dashboard-header no-print">
        <h1>Blueprint Management</h1>
        <p className="dashboard-subtitle">Create and manage contract templates</p>
      </div>

      <div className="action-bar no-print" style={{ marginBottom: '20px' }}>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/blueprints/create')}
        >
          + Create New Blueprint
        </button>
      </div>

      {blueprints.length === 0 ? (
        <div className="empty-state no-print">
          <p>No blueprints found. Create your first blueprint to get started.</p>
        </div>
      ) : (
        <div className="contracts-grid no-print">
          {blueprints.map(blueprint => (
            <div 
              key={blueprint.id} 
              className="contract-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/blueprints/edit/${blueprint.id}`)}
            >
              <div className="contract-card-header">
                <h3>{blueprint.name}</h3>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDelete(blueprint.id, e)}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Delete
                </button>
              </div>

              <div className="contract-card-details">
                <div className="detail-item">
                  <strong>Description:</strong> {blueprint.description || 'No description'}
                </div>
                <div className="detail-item">
                  <strong>Fields:</strong> {blueprint.fields?.length || 0}
                </div>
                <div className="detail-item">
                  <strong>Created:</strong> {blueprint.createdAt}
                </div>
              </div>

              <div className="contract-card-actions">
                <button 
                  className="btn-primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blueprints/edit/${blueprint.id}`);
                  }}
                >
                  Edit Blueprint
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/create?blueprint=${blueprint.id}`);
                  }}
                >
                  Create Contract
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blueprints;

