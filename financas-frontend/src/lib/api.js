const API_BASE_URL = '/api';

// Função para obter headers de autenticação
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Função para fazer requisições autenticadas
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
    return;
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  
  return data;
};

// API de Categorias
export const categoryAPI = {
  getAll: () => apiRequest('/categories'),
  
  create: (categoryData) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  update: (id, categoryData) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  delete: (id) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// API de Transações
export const transactionAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    return apiRequest(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  
  create: (transactionData) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),
  
  update: (id, transactionData) => apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  }),
  
  delete: (id) => apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  }),
  
  getBalance: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    return apiRequest(`/balance${queryString ? `?${queryString}` : ''}`);
  },
};

// API de Relatórios
export const reportsAPI = {
  getExpensesByCategory: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    return apiRequest(`/reports/expenses-by-category${queryString ? `?${queryString}` : ''}`);
  },
  
  getMonthlySummary: (year) => {
    const params = year ? `?year=${year}` : '';
    return apiRequest(`/reports/monthly-summary${params}`);
  },
};

