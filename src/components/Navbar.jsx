import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="navbar no-print">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Contract Manager</h2>
        </Link>
        <div className="nav-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Dashboard
          </button>
          <button className="btn-secondary" onClick={() => navigate('/blueprints')}>
            Blueprints
          </button>
          <button className="btn-primary" onClick={() => navigate('/create')}>
            + Add New Contract
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;