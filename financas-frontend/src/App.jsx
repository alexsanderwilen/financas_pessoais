import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import AuthPage from './components/auth/AuthPage';
import Navbar from './components/layout/Navbar';
import BalanceDisplay from './components/BalanceDisplay';
import FilterControls from './components/FilterControls';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryManagement from './components/CategoryManagement';
import ReportsPage from './components/reports/ReportsPage';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <BalanceDisplay />
            <FilterControls />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Adicionar Transação</h2>
                <TransactionForm />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Transações Recentes</h2>
                <TransactionList limit={5} />
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Transações</h1>
            </div>
            <FilterControls />
            <TransactionList />
          </div>
        );
      case 'reports':
        return <ReportsPage />;
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Categorias</h1>
            </div>
            <CategoryManagement />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <BalanceDisplay />
            <FilterControls />
            <TransactionForm />
            <TransactionList />
          </div>
        );
    }
  };

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
      </div>
    </FinanceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

