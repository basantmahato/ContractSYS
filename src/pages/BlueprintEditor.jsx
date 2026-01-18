import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlueprints } from '../context/BlueprintContext';

const FIELD_TYPES = ['Text', 'Date', 'Signature', 'Checkbox'];

const BlueprintEditor = () => {
  const { id } = useParams();
  const { getBlueprint, addBlueprint, updateBlueprint } = useBlueprints();
  const navigate = useNavigate();
  const fieldIdCounterRef = useRef(0);

  const isEditing = id && id !== 'create';
  const existingBlueprint = isEditing ? getBlueprint(id) : null;

  const [blueprintData, setBlueprintData] = useState({
    name: '',
    description: '',
    fields: []
  });

  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    if (existingBlueprint) {
      setBlueprintData({
        name: existingBlueprint.name || '',
        description: existingBlueprint.description || '',
        fields: existingBlueprint.fields || []
      });
    }
  }, [existingBlueprint, id]);

  const handleAddField = (type) => {
    fieldIdCounterRef.current += 1;
    const newField = {
      id: `field-${type.toLowerCase()}-${fieldIdCounterRef.current}`,
      type,
      label: `${type} Field`,
      position: { x: 50, y: 50 + blueprintData.fields.length * 80 },
      required: false
    };
    setBlueprintData({
      ...blueprintData,
      fields: [...blueprintData.fields, newField]
    });
    setSelectedField(newField.id);
  };

  const handleFieldChange = useCallback((fieldId, updates) => {
    setBlueprintData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const handleDeleteField = (fieldId) => {
    setBlueprintData({
      ...blueprintData,
      fields: blueprintData.fields.filter(field => field.id !== fieldId)
    });
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };


  const handleSave = () => {
    if (!blueprintData.name.trim()) {
      alert('Please enter a blueprint name');
      return;
    }

    if (isEditing) {
      updateBlueprint(id, blueprintData);
    } else {
      addBlueprint(blueprintData);
    }
    navigate('/blueprints');
  };

  const currentField = blueprintData.fields.find(f => f.id === selectedField);

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="form-card no-print">
          <h2>{isEditing ? 'Edit Blueprint' : 'Create New Blueprint'}</h2>

          <div className="input-group">
            <label>Blueprint Name *</label>
            <input
              type="text"
              value={blueprintData.name}
              onChange={(e) => setBlueprintData({ ...blueprintData, name: e.target.value })}
              placeholder="Enter blueprint name"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              value={blueprintData.description}
              onChange={(e) => setBlueprintData({ ...blueprintData, description: e.target.value })}
              placeholder="Enter blueprint description"
              rows="3"
            />
          </div>

          <div className="input-group">
            <label>Add Fields</label>
            <div className="field-types-grid">
              {FIELD_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  className="btn-field-type"
                  onClick={() => handleAddField(type)}
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Blueprint Fields</label>
            {blueprintData.fields.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic', margin: '10px 0' }}>
                No fields added yet. Click the buttons above to add fields.
              </p>
            ) : (
              <div className="fields-list">
                {blueprintData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`field-item ${selectedField === field.id ? 'selected' : ''}`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="field-item-content">
                      <div className="field-item-number">{index + 1}</div>
                      <div className="field-item-info">
                        <div className="field-item-label">{field.label}</div>
                        <div className="field-item-type">
                          <span className="field-type-badge">{field.type}</span>
                          {field.required && (
                            <span className="field-required-badge">Required</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className="field-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                      title="Delete Field"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentField && (
            <div className="field-properties-panel">
              <h3>Field Properties</h3>
              <div className="input-group">
                <label>Label</label>
                <input
                  type="text"
                  value={currentField.label}
                  onChange={(e) => handleFieldChange(currentField.id, { label: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={currentField.required}
                    onChange={(e) => handleFieldChange(currentField.id, { required: e.target.checked })}
                  />
                  Required
                </label>
              </div>
            </div>
          )}

          <div className="btn-group">
            <button type="button" className="btn-primary" onClick={handleSave}>
              {isEditing ? 'Update Blueprint' : 'Create Blueprint'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/blueprints')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintEditor;

