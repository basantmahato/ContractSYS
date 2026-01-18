import React, { createContext, useState, useContext, useEffect } from 'react';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  // Dummy contract data
  const getDummyContracts = () => {
    return [
      {
        id: 12345,
        name: 'Software Development Agreement',
        type: 'Service',
        status: 'Approved',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clientName: 'Tech Solutions Inc.',
        contractValue: '$50,000',
        description: 'Development of custom web application with React and Node.js backend.',
        signature: null
      },
      {
        id: 23456,
        name: 'Office Lease Agreement',
        type: 'Lease',
        status: 'Sent',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clientName: 'ABC Corporation',
        contractValue: '$2,400/month',
        description: 'Annual lease agreement for office space in downtown building.',
        signature: null
      },
      {
        id: 34567,
        name: 'Employment Contract',
        type: 'Employment',
        status: 'Signed',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clientName: 'John Smith',
        contractValue: '$75,000/year',
        description: 'Full-time employment contract for Senior Developer position.',
        signature: null
      },
      {
        id: 45678,
        name: 'Service Maintenance Contract',
        type: 'Service',
        status: 'Created',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clientName: 'XYZ Industries',
        contractValue: '$15,000',
        description: 'Monthly maintenance and support services for enterprise software.',
        signature: null
      },
      {
        id: 56789,
        name: 'Consulting Services Agreement',
        type: 'Standard',
        status: 'Locked',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        clientName: 'Global Enterprises Ltd.',
        contractValue: '$100,000',
        description: 'Strategic consulting services for digital transformation project.',
        signature: null
      }
    ];
  };

  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('contract_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved data exists and is an array, use it; otherwise use dummy data
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDummyContracts();
      } catch (e) {
        // If parsing fails, use dummy data
        return getDummyContracts();
      }
    }
    // If no saved data, use dummy contracts
    const dummyContracts = getDummyContracts();
    localStorage.setItem('contract_data', JSON.stringify(dummyContracts));
    return dummyContracts;
  });

  const STAGES = ['Created', 'Approved', 'Sent', 'Signed', 'Locked'];

  useEffect(() => {
    localStorage.setItem('contract_data', JSON.stringify(contracts));
  }, [contracts]);

  const addContract = (newContract) => {
    const contractEntry = {
      ...newContract,
      id: Math.floor(Math.random() * 90000) + 10000,
      status: 'Created',
      createdAt: new Date().toLocaleDateString(),
      signature: newContract.signature || null
    };
    setContracts([...contracts, contractEntry]);
  };

  const getContract = (id) => {
    return contracts.find(c => c.id === id);
  };

  const nextStage = (id) => {
    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        const currentIndex = STAGES.indexOf(c.status);
        if (currentIndex < STAGES.length - 1) {
          return { ...c, status: STAGES[currentIndex + 1] };
        }
      }
      return c;
    }));
  };

  const deleteContract = (id) => {
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const revokeContract = (id) => {
    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'Revoked', revokedAt: new Date().toLocaleDateString() };
      }
      return c;
    }));
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, nextStage, getContract, deleteContract, revokeContract, STAGES }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => useContext(ContractContext);