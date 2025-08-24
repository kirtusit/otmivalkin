import React, { useState, useEffect } from 'react';
import './App.css';
import Inventory from './components/Inventory';
import Process from './components/Process';
import Locations from './components/Locations';
import Footer from './components/Footer';

function App() {
  const [active, setActive] = useState(() => sessionStorage.getItem('active') || 'inventory');
  const [selected, setSelected] = useState(() => sessionStorage.getItem('selected') || null);
  const [subSelected, setSubSelected] = useState(() => sessionStorage.getItem('subSelected') || null);
  const [filters, setFilters] = useState(() => {
    const stored = sessionStorage.getItem('filters');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => { sessionStorage.setItem('active', active); }, [active]);
  useEffect(() => { sessionStorage.setItem('selected', selected || ''); }, [selected]);
  useEffect(() => { sessionStorage.setItem('subSelected', subSelected || ''); }, [subSelected]);
  useEffect(() => { sessionStorage.setItem('filters', JSON.stringify(filters)); }, [filters]);

  const renderContent = () => {
    switch (active) {
      case 'inventory':
        return (
          <Inventory
            selected={selected}
            setSelected={setSelected}
            subSelected={subSelected}
            setSubSelected={setSubSelected}
            filters={filters}
            setFilters={setFilters}
          />
        );
      case 'process':   return <Process />;
      case 'locations': return <Locations />;
      default:          return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <button className={active === 'inventory' ? 'nav-button active' : 'nav-button'} onClick={() => setActive('inventory')}>Инвентарь и оборудование</button>
          <button className={active === 'process' ? 'nav-button active' : 'nav-button'} onClick={() => setActive('process')}>Процесс автомойки</button>
          <button className={active === 'locations' ? 'nav-button active' : 'nav-button'} onClick={() => setActive('locations')}>Где помыть авто</button>
        </nav>
      </header>
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;