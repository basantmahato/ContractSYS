import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContractProvider } from './context/ContractContext';
import { BlueprintProvider } from './context/BlueprintContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import CreateContract from './pages/CreateContract';
import Blueprints from './pages/Blueprints';
import BlueprintEditor from './pages/BlueprintEditor';
import './App.css';

function App() {
  return (
    <ContractProvider>
      <BlueprintProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateContract />} />
                <Route path="/blueprints" element={<Blueprints />} />
                <Route path="/blueprints/create" element={<BlueprintEditor />} />
                <Route path="/blueprints/edit/:id" element={<BlueprintEditor />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BlueprintProvider>
    </ContractProvider>
  );
}

export default App;