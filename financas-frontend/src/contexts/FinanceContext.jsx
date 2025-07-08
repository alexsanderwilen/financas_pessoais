import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryAPI, transactionAPI } from '../lib/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({
    mensal: {
      receitas: 0,
      despesas: 0,
      saldo: 0,
    },
    anual: {
      receitas: 0,
      despesas: 0,
      saldo: 0,
    },
    periodo: {
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
    },
  });
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
      loadTransactions();
      loadBalance();
    } else {
      // Limpar dados quando não autenticado
      setCategories([]);
      setTransactions([]);
      setBalance({
        receitas: 0,
        despesas: 0,
        saldo: 0,
        receitas_anuais: 0,
        despesas_anuais: 0,
        saldo_anual: 0
      });
    }
  }, [isAuthenticated]);

  // Recarregar dados quando filtros mudam
  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
      loadBalance();
    }
  }, [filters, isAuthenticated]);

  const loadCategories = async () => {
    try {
      setError(null);
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (err) {
      setError('Erro ao carregar categorias: ' + err.message);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionAPI.getAll(filters);
      setTransactions(data);
    } catch (err) {
      setError('Erro ao carregar transações: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      setError(null);
      const data = await transactionAPI.getBalance(filters);
      setBalance({
        mensal: {
          receitas: data.receitas,
          despesas: data.despesas,
          saldo: data.saldo,
        },
        anual: {
          receitas: data.receitas_anuais,
          despesas: data.despesas_anuais,
          saldo: data.saldo_anual,
        },
        periodo: {
          mes: filters.month,
          ano: filters.year,
        },
      });
    } catch (err) {
      setError('Erro ao carregar saldo: ' + err.message);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      setError(null);
      const newTransaction = await transactionAPI.create(transactionData);
      await loadTransactions();
      await loadBalance();
      return { success: true, data: newTransaction };
    } catch (err) {
      setError('Erro ao adicionar transação: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      setError(null);
      const updatedTransaction = await transactionAPI.update(id, transactionData);
      await loadTransactions();
      await loadBalance();
      return { success: true, data: updatedTransaction };
    } catch (err) {
      setError('Erro ao atualizar transação: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setError(null);
      await transactionAPI.delete(id);
      await loadTransactions();
      await loadBalance();
      return { success: true };
    } catch (err) {
      setError('Erro ao excluir transação: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const addCategory = async (categoryData) => {
    try {
      setError(null);
      const newCategory = await categoryAPI.create(categoryData);
      await loadCategories();
      return { success: true, data: newCategory };
    } catch (err) {
      setError('Erro ao adicionar categoria: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setError(null);
      const updatedCategory = await categoryAPI.update(id, categoryData);
      await loadCategories();
      return { success: true, data: updatedCategory };
    } catch (err) {
      setError('Erro ao atualizar categoria: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError(null);
      await categoryAPI.delete(id);
      await loadCategories();
      return { success: true };
    } catch (err) {
      setError('Erro ao excluir categoria: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      type: '',
      category_id: ''
    });
  };

  const value = {
    // Estado
    categories,
    transactions,
    balance,
    filters,
    loading,
    error,
    
    // Ações de transações
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Ações de categorias
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Ações de filtros
    updateFilters,
    clearFilters,
    
    // Recarregar dados
    loadTransactions,
    loadCategories,
    loadBalance,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

