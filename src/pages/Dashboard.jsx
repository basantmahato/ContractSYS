import React, { useState } from 'react';
import { useContracts } from '../context/ContractContext';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { contracts, nextStage, deleteContract, revokeContract, STAGES } = useContracts();
  const [statusFilter, setStatusFilter] = useState('All');

  const handlePrintContract = (contract) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contract - ${contract.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .contract-header { text-align: center; border-bottom: 2px solid #0e4b66; padding-bottom: 20px; margin-bottom: 30px; }
            .contract-header h1 { color: #0e4b66; margin: 0; }
            .contract-content { line-height: 1.8; }
            .contract-field { margin-bottom: 20px; }
            .contract-field strong { display: block; margin-bottom: 5px; color: #0e4b66; }
            .contract-signature { margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0; }
            .contract-signature img { max-width: 300px; display: block; margin: 20px 0; }
            .signature-date { margin-top: 10px; font-style: italic; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="contract-header">
            <h1>CONTRACT AGREEMENT</h1>
          </div>
          <div class="contract-content">
            <div class="contract-field">
              <strong>Contract ID:</strong> ${contract.id}
            </div>
            <div class="contract-field">
              <strong>Contract Name:</strong> ${contract.name}
            </div>
            <div class="contract-field">
              <strong>Contract Type:</strong> ${contract.type}
            </div>
            <div class="contract-field">
              <strong>Status:</strong> ${contract.status}
            </div>
            ${contract.clientName ? `<div class="contract-field"><strong>Client Name:</strong> ${contract.clientName}</div>` : ''}
            ${contract.contractValue ? `<div class="contract-field"><strong>Contract Value:</strong> ${contract.contractValue}</div>` : ''}
            ${contract.description ? `<div class="contract-field"><strong>Description:</strong><p>${contract.description}</p></div>` : ''}
            ${contract.signature ? `
              <div class="contract-signature">
                <strong>Signature:</strong>
                <img src="${contract.signature}" alt="Signature" />
                <div class="signature-date">Date: ${contract.createdAt}</div>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const getStatusIndex = (status) => {
    return STAGES.indexOf(status);
  };

  const handleDeleteContract = (contract) => {
    if (window.confirm(`Are you sure you want to permanently delete the contract "${contract.name}"? This action cannot be undone.`)) {
      deleteContract(contract.id);
    }
  };

  const handleRevokeContract = (contract) => {
    if (window.confirm(`Are you sure you want to revoke the contract "${contract.name}"? This will mark the contract as revoked.`)) {
      revokeContract(contract.id);
    }
  };

  // Filter contracts based on selected status
  const filteredContracts = statusFilter === 'All' 
    ? contracts 
    : contracts.filter(contract => contract.status === statusFilter);

  return (
    <div className="container">
      <div className="dashboard-header no-print">
        <h1>Contract Dashboard</h1>
        <p className="dashboard-subtitle">Manage all your contracts and track their status</p>
      </div>

      {/* Status Filter */}
      {contracts.length > 0 && (
        <div className="dashboard-filters no-print">
          <div className="filter-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <h3>Filter by Status</h3>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
              All Contracts
            </button>
            {STAGES.map(stage => (
              <button
                key={stage}
                className={`filter-btn ${statusFilter === stage ? 'active' : ''}`}
                onClick={() => setStatusFilter(stage)}
              >
                {stage}
              </button>
            ))}
            <button
              className={`filter-btn ${statusFilter === 'Revoked' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Revoked')}
            >
              Revoked
            </button>
          </div>
          <div className="filter-info">
            Showing {filteredContracts.length} of {contracts.length} contract(s)
          </div>
        </div>
      )}

      {filteredContracts.length === 0 ? (
        <div className="empty-state no-print">
          <p>
            {contracts.length === 0 
              ? 'No contracts found. Create your first contract to get started.' 
              : `No contracts found with status "${statusFilter}". Try selecting a different filter.`}
          </p>
        </div>
      ) : (
        <div className="contracts-grid no-print">
          {filteredContracts.map(contract => (
            <div key={contract.id} className="contract-card">
              <div className="contract-card-header">
                <h3>{contract.name}</h3>
                <StatusBadge status={contract.status} />
              </div>
              
              <div className="status-timeline">
                {STAGES.map((stage, index) => {
                  const currentIndex = getStatusIndex(contract.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  return (
                    <div key={stage} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="timeline-dot"></div>
                      <span className="timeline-label">{stage}</span>
                      {index < STAGES.length - 1 && <div className="timeline-line"></div>}
                    </div>
                  );
                })}
              </div>

              <div className="contract-card-details">
                <div className="detail-item">
                  <strong>ID:</strong> {contract.id}
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {contract.type}
                </div>
                <div className="detail-item">
                  <strong>Created:</strong> {contract.createdAt}
                </div>
                {contract.clientName && (
                  <div className="detail-item">
                    <strong>Client:</strong> {contract.clientName}
                  </div>
                )}
              </div>

              <div className="contract-card-actions">
                <button 
                  className="btn-primary" 
                  onClick={() => handlePrintContract(contract)}
                >
                  Print
                </button>
                {contract.status !== 'Locked' && contract.status !== 'Revoked' && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => nextStage(contract.id)}
                  >
                    Advance Stage
                  </button>
                )}
                {contract.status !== 'Revoked' && (
                  <button 
                    className="btn-revoke" 
                    onClick={() => handleRevokeContract(contract)}
                    title="Revoke Contract"
                  >
                    Revoke
                  </button>
                )}
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteContract(contract)}
                  title="Delete Contract"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;