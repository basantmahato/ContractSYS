import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';
import { useBlueprints } from '../context/BlueprintContext';

const CreateContract = () => {
  const { addContract } = useContracts();
  const { blueprints, getBlueprint } = useBlueprints();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedBlueprintId, setSelectedBlueprintId] = useState(searchParams.get('blueprint') || '');
  const [useBlueprint, setUseBlueprint] = useState(!!searchParams.get('blueprint'));
  const [fieldValues, setFieldValues] = useState({});
  const [signatureFiles, setSignatureFiles] = useState({});

  const selectedBlueprint = selectedBlueprintId ? getBlueprint(selectedBlueprintId) : null;

  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'Standard',
    description: '',
    clientName: '',
    contractValue: ''
  });
  const [signature, setSignature] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    if (selectedBlueprint) {
      // Initialize field values for blueprint fields
      const initialValues = {};
      selectedBlueprint.fields.forEach(field => {
        if (field.type === 'Checkbox') {
          initialValues[field.id] = false;
        } else if (field.type !== 'Signature') {
          initialValues[field.id] = '';
        }
      });
      setFieldValues(initialValues);
    }
  }, [selectedBlueprint]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (useBlueprint && selectedBlueprint) {
      // Create contract from blueprint
      const contractData = {
        name: formData.name || fieldValues[selectedBlueprint.fields.find(f => f.label.toLowerCase().includes('name'))?.id] || 'Contract',
        type: selectedBlueprint.name,
        description: selectedBlueprint.description,
        clientName: fieldValues[selectedBlueprint.fields.find(f => f.label.toLowerCase().includes('client'))?.id] || '',
        contractValue: fieldValues[selectedBlueprint.fields.find(f => f.label.toLowerCase().includes('value') || f.label.toLowerCase().includes('salary') || f.label.toLowerCase().includes('amount'))?.id] || '',
        blueprintId: selectedBlueprint.id,
        blueprintFields: selectedBlueprint.fields.map(field => ({
          ...field,
          value: field.type === 'Signature' ? signatureFiles[field.id] || null : fieldValues[field.id]
        }))
      };
      addContract(contractData);
    } else {
      // Create contract from standard form
      addContract({
        ...formData,
        signature: signature
      });
    }
    navigate('/');
  };

  const handleFile = (e, fieldId = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldId) {
          setSignatureFiles({ ...signatureFiles, [fieldId]: reader.result });
        } else {
          setSignature(reader.result);
          setSignatureFile(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFieldValues({ ...fieldValues, [fieldId]: value });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let contractContent = '';

    if (useBlueprint && selectedBlueprint) {
      contractContent = `
        <div class="contract-header">
          <h1>CONTRACT AGREEMENT</h1>
          <h2>${selectedBlueprint.name}</h2>
        </div>
        <div class="contract-content" style="position: relative; min-height: 800px;">
          ${selectedBlueprint.fields.map(field => {
            const value = field.type === 'Signature' 
              ? (signatureFiles[field.id] || '') 
              : fieldValues[field.id] || '';
            
            if (field.type === 'Text') {
              return `
                <div style="position: absolute; left: ${field.position.x}px; top: ${field.position.y}px;">
                  <strong>${field.label}:</strong> ${value}
                </div>
              `;
            } else if (field.type === 'Date') {
              return `
                <div style="position: absolute; left: ${field.position.x}px; top: ${field.position.y}px;">
                  <strong>${field.label}:</strong> ${value}
                </div>
              `;
            } else if (field.type === 'Signature') {
              return value ? `
                <div style="position: absolute; left: ${field.position.x}px; top: ${field.position.y}px;">
                  <strong>${field.label}:</strong>
                  <img src="${value}" alt="Signature" style="max-width: 200px; display: block; margin-top: 10px; border: 1px solid #e2e8f0; padding: 5px;" />
                </div>
              ` : '';
            } else if (field.type === 'Checkbox') {
              return `
                <div style="position: absolute; left: ${field.position.x}px; top: ${field.position.y}px;">
                  <strong>${field.label}:</strong> ${value ? '✓' : '✗'}
                </div>
              `;
            }
            return '';
          }).join('')}
        </div>
      `;
    } else {
      contractContent = `
        <div class="contract-header">
          <h1>CONTRACT AGREEMENT</h1>
        </div>
        <div class="contract-content">
          <div class="contract-field">
            <strong>Contract Name:</strong> ${formData.name || 'N/A'}
          </div>
          <div class="contract-field">
            <strong>Contract Type:</strong> ${formData.type || 'N/A'}
          </div>
          ${formData.clientName ? `<div class="contract-field"><strong>Client Name:</strong> ${formData.clientName}</div>` : ''}
          ${formData.contractValue ? `<div class="contract-field"><strong>Contract Value:</strong> ${formData.contractValue}</div>` : ''}
          ${formData.description ? `<div class="contract-field"><strong>Description:</strong><p>${formData.description}</p></div>` : ''}
          ${signature ? `
            <div class="contract-signature">
              <strong>Signature:</strong>
              <img src="${signature}" alt="Signature" />
              <div class="signature-date">Date: ${new Date().toLocaleDateString()}</div>
            </div>
          ` : ''}
        </div>
      `;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contract - ${useBlueprint && selectedBlueprint ? selectedBlueprint.name : formData.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .contract-header { text-align: center; border-bottom: 2px solid #0e4b66; padding-bottom: 20px; margin-bottom: 30px; }
            .contract-header h1 { color: #0e4b66; margin: 0; }
            .contract-header h2 { color: #718096; margin: 10px 0 0 0; font-size: 1.2rem; font-weight: normal; }
            .contract-content { line-height: 1.8; }
            .contract-field { margin-bottom: 20px; }
            .contract-field strong { display: block; margin-bottom: 5px; color: #0e4b66; }
            .contract-signature { margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0; }
            .contract-signature img { max-width: 300px; display: block; margin: 20px 0; border: 1px solid #e2e8f0; padding: 10px; }
            .signature-date { margin-top: 10px; font-style: italic; color: #718096; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${contractContent}
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <form className="form-card no-print" onSubmit={handleSubmit}>
          <h2>Create New Contract</h2>

          <div className="input-group">
            <label>
              <input
                type="checkbox"
                checked={useBlueprint}
                onChange={(e) => {
                  setUseBlueprint(e.target.checked);
                  if (!e.target.checked) {
                    setSelectedBlueprintId('');
                  }
                }}
                style={{ marginRight: '8px' }}
              />
              Use Blueprint Template
            </label>
          </div>

          {useBlueprint && (
            <div className="input-group">
              <label>Select Blueprint *</label>
              <select
                value={selectedBlueprintId}
                onChange={(e) => setSelectedBlueprintId(e.target.value)}
                required={useBlueprint}
              >
                <option value="">Select a blueprint...</option>
                {blueprints.map(bp => (
                  <option key={bp.id} value={bp.id}>{bp.name}</option>
                ))}
              </select>
            </div>
          )}

          {useBlueprint && selectedBlueprint ? (
            <>
              <div className="input-group">
                <label>Contract Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter contract name"
                  required
                />
              </div>

              <div className="blueprint-fields-section">
                <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Fill Contract Fields</h3>
                {selectedBlueprint.fields.map(field => (
                  <div key={field.id} className="input-group">
                    <label>
                      {field.label}
                      {field.required && <span style={{ color: 'var(--danger)' }}> *</span>}
                    </label>
                    
                    {field.type === 'Text' && (
                      <input
                        type="text"
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'Date' && (
                      <input
                        type="date"
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'Signature' && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFile(e, field.id)}
                          required={field.required}
                          className="file-input"
                        />
                        {signatureFiles[field.id] && (
                          <div className="signature-preview">
                            <img src={signatureFiles[field.id]} alt={`${field.label} preview`} />
                            <span>{field.label}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {field.type === 'Checkbox' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={fieldValues[field.id] || false}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          required={field.required}
                        />
                        <span>I agree to this condition</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>Contract Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter contract name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="input-group">
                <label>Contract Type *</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="Standard">Standard</option>
                  <option value="Lease">Lease</option>
                  <option value="Service">Service</option>
                  <option value="Employment">Employment</option>
                </select>
              </div>

              <div className="input-group">
                <label>Client Name</label>
                <input 
                  type="text" 
                  placeholder="Enter client name" 
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})} 
                />
              </div>

              <div className="input-group">
                <label>Contract Value</label>
                <input 
                  type="text" 
                  placeholder="Enter contract value" 
                  value={formData.contractValue}
                  onChange={e => setFormData({...formData, contractValue: e.target.value})} 
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea 
                  placeholder="Enter contract description" 
                  rows="4"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="input-group">
                <label>Upload Signature *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFile}
                  required
                  className="file-input"
                />
                {signature && (
                  <div className="signature-preview">
                    <img src={signature} alt="Signature preview" />
                    <span>{signatureFile}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="btn-group">
            <button type="submit" className="btn-primary">Create Contract</button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handlePrint}
            >
              Print Preview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;
