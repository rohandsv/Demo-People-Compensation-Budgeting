import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Phase1Page from './pages/Phase1Page';
import Phase2Page from './pages/Phase2Page';
import Phase3Page from './pages/Phase3Page';
import Phase4Page from './pages/Phase4Page';
import Phase5Page from './pages/Phase5Page';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import './App.css';

const AppInner = () => {
  const { currentUser, currentPage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'phase1': return <Phase1Page />;
      case 'phase2': return <Phase2Page />;
      case 'phase3': return <Phase3Page />;
      case 'phase4': return <Phase4Page />;
      case 'phase5': return <Phase5Page />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar onCollapse={setSidebarCollapsed} />
      <div className={sidebarCollapsed ? 'app-main app-main-collapsed' : 'app-main'}>
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="app-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
