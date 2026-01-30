import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import DashboardCabeleireira from './pages/DashboardCabeleireira';
import DashboardAuxiliar from './pages/DashboardAuxiliar';
import DashboardCliente from './pages/DashboardCliente';
import Auxiliares from './pages/Auxiliares';
import Cabeleireiras from './pages/Cabeleireiras';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Horarios from './pages/Horarios';
import Registros from './pages/Registros';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import { getStoredUser, clearStoredUser, hasPermission } from './utils/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleRefresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const hasAccess = (permission) => hasPermission(user.role, permission);

  const getAvailablePages = () => {
    const pages = [{ id: 'dashboard', label: 'Dashboard' }];

    if (user.role === 'admin') {
      pages.push(
        { id: 'auxiliares', label: 'Auxiliares' },
        { id: 'cabeleireiras', label: 'Cabeleireiras' },
        { id: 'clientes', label: 'Clientes' },
        { id: 'servicos', label: 'Serviços' },
        { id: 'horarios', label: 'Horários' },
        { id: 'registros', label: 'Agendamentos' }
      );
    } else if (user.role === 'cabeleireira') {
      pages.push(
        { id: 'clientes', label: 'Clientes' },
        { id: 'servicos', label: 'Serviços' },
        { id: 'registros', label: 'Agendamentos' }
      );
    } else if (user.role === 'auxiliar') {
      pages.push(
        { id: 'clientes', label: 'Clientes' },
        { id: 'servicos', label: 'Serviços' },
        { id: 'registros', label: 'Agendamentos' }
      );
    }

    return pages;
  };

  const renderPage = () => {
    if (!hasAccess('view_dashboard') && currentPage === 'dashboard') {
      return <div className="access-denied">Acesso negado</div>;
    }

    switch (user.role) {
      case 'admin':
        return renderAdminPage();
      case 'cabeleireira':
        return renderCabeleiraPage();
      case 'auxiliar':
        return renderAuxiliarPage();
      case 'cliente':
        return renderClientePage();
      default:
        return <Dashboard key={refreshFlag} />;
    }
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard key={refreshFlag} />;
      case 'auxiliares':
        return <Auxiliares key={refreshFlag} onAdd={handleRefresh} />;
      case 'cabeleireiras':
        return <Cabeleireiras key={refreshFlag} onAdd={handleRefresh} />;
      case 'clientes':
        return <Clientes key={refreshFlag} onAdd={handleRefresh} />;
      case 'servicos':
        return <Servicos key={refreshFlag} onAdd={handleRefresh} />;
      case 'horarios':
        return <Horarios key={refreshFlag} onAdd={handleRefresh} />;
      case 'registros':
        return <Registros key={refreshFlag} onAdd={handleRefresh} />;
      default:
        return <Dashboard key={refreshFlag} />;
    }
  };

  const renderCabeleiraPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardCabeleireira key={refreshFlag} user={user} />;
      case 'clientes':
        return <Clientes key={refreshFlag} onAdd={handleRefresh} readOnly={true} />;
      case 'servicos':
        return <Servicos key={refreshFlag} onAdd={handleRefresh} readOnly={true} />;
      case 'registros':
        return <Registros key={refreshFlag} onAdd={handleRefresh} />;
      default:
        return <DashboardCabeleireira key={refreshFlag} user={user} />;
    }
  };

  const renderAuxiliarPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardAuxiliar key={refreshFlag} user={user} />;
      case 'clientes':
        return <Clientes key={refreshFlag} onAdd={handleRefresh} readOnly={true} />;
      case 'servicos':
        return <Servicos key={refreshFlag} onAdd={handleRefresh} readOnly={true} />;
      case 'registros':
        return <Registros key={refreshFlag} onAdd={handleRefresh} />;
      default:
        return <DashboardAuxiliar key={refreshFlag} user={user} />;
    }
  };

  const renderClientePage = () => {
    return <DashboardCliente key={refreshFlag} user={user} />;
  };

  return (
    <div className="app">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        availablePages={getAvailablePages()}
        user={user}
        onLogout={handleLogout}
      />
      <div className="app-content">
        {renderPage()}
      </div>
    </div>
  );
}
