# Documentação Técnica - Sistema de Finanças Pessoais v2.0

## 🏗️ Arquitetura do Sistema

### Visão Geral
O sistema utiliza uma arquitetura moderna de aplicação web com separação clara entre frontend e backend:

- **Frontend:** React.js com Vite
- **Backend:** Flask (Python)
- **Banco de Dados:** SQLite
- **Autenticação:** JWT (JSON Web Tokens)
- **Deploy:** Manus Cloud Platform

### Estrutura de Diretórios

```
projeto/
├── financas-backend/          # Backend Flask
│   ├── src/
│   │   ├── main.py           # Aplicação principal
│   │   ├── models/           # Modelos de dados
│   │   │   ├── user.py       # Modelo de usuário
│   │   │   ├── category.py   # Modelo de categoria
│   │   │   └── transaction.py # Modelo de transação
│   │   ├── routes/           # Rotas da API
│   │   │   ├── user.py       # Rotas de autenticação
│   │   │   ├── category.py   # Rotas de categorias
│   │   │   └── transaction.py # Rotas de transações
│   │   ├── database/         # Banco de dados
│   │   ├── static/           # Frontend buildado
│   │   └── seed_data.py      # Script de dados iniciais
│   ├── requirements.txt      # Dependências Python
│   └── venv/                # Ambiente virtual
│
└── financas-frontend/         # Frontend React
    ├── src/
    │   ├── App.jsx           # Componente principal
    │   ├── components/       # Componentes React
    │   │   ├── auth/         # Componentes de autenticação
    │   │   ├── layout/       # Componentes de layout
    │   │   ├── reports/      # Componentes de relatórios
    │   │   └── ui/           # Componentes de UI
    │   ├── contexts/         # Contextos React
    │   │   ├── AuthContext.jsx
    │   │   └── FinanceContext.jsx
    │   └── lib/              # Utilitários
    │       └── api.js        # Cliente da API
    ├── package.json          # Dependências Node.js
    └── dist/                # Build de produção
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### User (Usuário)
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transactions = db.relationship('Transaction', backref='user', cascade='all, delete-orphan')
    categories = db.relationship('Category', backref='user', cascade='all, delete-orphan')
```

#### Category (Categoria)
```python
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'receita' ou 'despesa'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    transactions = db.relationship('Transaction', backref='category')
```

#### Transaction (Transação)
```python
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'receita' ou 'despesa'
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### Relacionamentos
- **User → Transactions:** 1:N (Um usuário tem muitas transações)
- **User → Categories:** 1:N (Um usuário tem muitas categorias)
- **Category → Transactions:** 1:N (Uma categoria tem muitas transações)

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

1. **Registro:**
   ```
   POST /api/register
   {
     "username": "usuario",
     "email": "email@exemplo.com",
     "password": "senha123",
     "confirm_password": "senha123"
   }
   ```

2. **Login:**
   ```
   POST /api/login
   {
     "username_or_email": "usuario",
     "password": "senha123"
   }
   ```

3. **Resposta de Autenticação:**
   ```json
   {
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "user": {
       "id": 1,
       "username": "usuario",
       "email": "email@exemplo.com"
     }
   }
   ```

### Segurança
- **Hash de Senha:** SHA-256 (simplificado para demo)
- **JWT Tokens:** Expiração de 24 horas
- **Headers de Autorização:** `Authorization: Bearer <token>`
- **Isolamento de Dados:** Filtros automáticos por `user_id`

## 🌐 API REST

### Endpoints de Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Cadastro de usuário |
| POST | `/api/login` | Login de usuário |
| POST | `/api/logout` | Logout (invalidar token) |

### Endpoints de Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Listar categorias do usuário |
| POST | `/api/categories` | Criar nova categoria |
| PUT | `/api/categories/<id>` | Atualizar categoria |
| DELETE | `/api/categories/<id>` | Excluir categoria |

### Endpoints de Transações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/transactions` | Listar transações (com filtros) |
| POST | `/api/transactions` | Criar nova transação |
| PUT | `/api/transactions/<id>` | Atualizar transação |
| DELETE | `/api/transactions/<id>` | Excluir transação |
| GET | `/api/transactions/balance` | Obter saldo mensal/anual |

### Endpoints de Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/reports/expenses-by-category` | Despesas por categoria |
| GET | `/api/reports/monthly-summary` | Resumo mensal do ano |

### Parâmetros de Filtro

#### Transações
- `month`: Filtrar por mês (1-12)
- `year`: Filtrar por ano
- `type`: Filtrar por tipo ('receita' ou 'despesa')
- `category_id`: Filtrar por categoria

#### Relatórios
- `year`: Ano para análise
- `month`: Mês específico (para despesas por categoria)

## ⚛️ Frontend React

### Estrutura de Componentes

#### Contextos
- **AuthContext:** Gerencia estado de autenticação
- **FinanceContext:** Gerencia dados financeiros globais

#### Componentes Principais
- **App.jsx:** Componente raiz com roteamento
- **AuthPage.jsx:** Página de login/cadastro
- **Navbar.jsx:** Barra de navegação
- **BalanceDisplay.jsx:** Exibição de saldos
- **TransactionForm.jsx:** Formulário de transações
- **TransactionList.jsx:** Lista de transações
- **CategoryManagement.jsx:** Gerenciamento de categorias
- **ReportsPage.jsx:** Página de relatórios com gráficos

### Bibliotecas Utilizadas

#### UI e Estilo
- **Tailwind CSS:** Framework de CSS utilitário
- **shadcn/ui:** Componentes de UI pré-construídos
- **Lucide React:** Ícones modernos

#### Gráficos
- **Recharts:** Biblioteca de gráficos para React
  - BarChart: Gráficos de barras
  - LineChart: Gráficos de linha
  - PieChart: Gráficos de pizza

#### Estado e Dados
- **React Context:** Gerenciamento de estado global
- **Fetch API:** Comunicação com backend

### Fluxo de Dados

1. **Autenticação:**
   ```
   Login → AuthContext → Token Storage → API Headers
   ```

2. **Dados Financeiros:**
   ```
   API Call → FinanceContext → Component State → UI Update
   ```

3. **Formulários:**
   ```
   User Input → Validation → API Call → Context Update → UI Refresh
   ```

## 📊 Sistema de Relatórios

### Tipos de Visualização

#### 1. Gráfico de Barras (Resumo Mensal)
```javascript
<BarChart data={monthlySummary}>
  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
</BarChart>
```

#### 2. Gráfico de Linha (Evolução do Saldo)
```javascript
<LineChart data={monthlySummary}>
  <Line 
    type="monotone" 
    dataKey="saldo" 
    stroke="#3B82F6" 
    strokeWidth={3}
  />
</LineChart>
```

#### 3. Gráfico de Pizza (Despesas por Categoria)
```javascript
<PieChart>
  <Pie
    data={expensesByCategory}
    dataKey="amount"
    nameKey="category"
    outerRadius={80}
  />
</PieChart>
```

### Processamento de Dados

#### Backend (Flask)
```python
def get_monthly_summary(year):
    # Agrupa transações por mês
    # Calcula receitas, despesas e saldo
    # Retorna dados formatados para gráficos
```

#### Frontend (React)
```javascript
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
```

## 🚀 Deploy e Produção

### Processo de Build

#### Frontend
```bash
cd financas-frontend
pnpm run build
# Gera arquivos otimizados em dist/
```

#### Integração
```bash
# Copia frontend buildado para Flask
cp -r financas-frontend/dist/* financas-backend/src/static/
```

### Configuração de Produção

#### Flask (main.py)
```python
# Serve arquivos estáticos do React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')
```

#### CORS Configuration
```python
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])
```

### Ambiente de Deploy

- **Plataforma:** Manus Cloud
- **URL:** https://ogh5izcv0yzj.manus.space
- **SSL:** Certificado automático
- **Banco:** SQLite (arquivo local)

## 🔧 Configuração de Desenvolvimento

### Backend Setup
```bash
cd financas-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python src/seed_data.py  # Dados iniciais
python src/main.py       # Servidor dev
```

### Frontend Setup
```bash
cd financas-frontend
pnpm install
pnpm run dev  # Servidor dev na porta 5173
```

### Proxy Configuration (vite.config.js)
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

## 📈 Performance e Otimização

### Frontend
- **Code Splitting:** Componentes carregados sob demanda
- **Minificação:** Assets comprimidos para produção
- **Tree Shaking:** Remoção de código não utilizado
- **Lazy Loading:** Gráficos carregados apenas quando necessário

### Backend
- **Query Optimization:** Consultas SQL otimizadas
- **Indexação:** Índices em campos frequentemente consultados
- **Caching:** Headers de cache para assets estáticos

### Banco de Dados
- **Índices:** user_id, date, category_id
- **Constraints:** Chaves estrangeiras e validações
- **Normalização:** Estrutura normalizada para evitar redundância

## 🧪 Testes e Qualidade

### Estratégia de Testes
- **Testes Manuais:** Interface testada em múltiplos dispositivos
- **Validação de API:** Endpoints testados com diferentes cenários
- **Testes de Integração:** Frontend e backend testados em conjunto

### Validações Implementadas
- **Frontend:** Validação de formulários em tempo real
- **Backend:** Validação de dados e autorização
- **Banco:** Constraints e validações de integridade

## 🔒 Segurança

### Medidas Implementadas
- **Autenticação JWT:** Tokens seguros com expiração
- **Hash de Senhas:** Senhas nunca armazenadas em texto plano
- **CORS:** Configurado para permitir acesso do frontend
- **Validação:** Dados validados no frontend e backend
- **Isolamento:** Dados completamente isolados por usuário

### Considerações de Segurança
- **HTTPS:** Comunicação criptografada em produção
- **SQL Injection:** Prevenido pelo uso do SQLAlchemy ORM
- **XSS:** Prevenido pela sanitização automática do React

## 📋 Dependências

### Backend (Python)
```
Flask==3.0.3
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.6.0
Flask-Cors==5.0.0
```

### Frontend (Node.js)
```
react==18.3.1
recharts==2.12.7
tailwindcss==3.4.4
lucide-react==0.400.0
```

## 🔄 Versionamento e Atualizações

### Versão Atual: 2.0
- ✅ Sistema de autenticação completo
- ✅ Interface moderna e responsiva
- ✅ Relatórios visuais avançados
- ✅ Isolamento de dados por usuário
- ✅ Menu de navegação profissional

### Melhorias Futuras Sugeridas
- **Backup de Dados:** Export/import de dados
- **Notificações:** Alertas de gastos
- **Metas Financeiras:** Definição e acompanhamento de metas
- **Categorias Personalizadas:** Mais opções de personalização
- **Relatórios Avançados:** Mais tipos de análises

---

**Desenvolvido com:** React.js, Flask, SQLite, Recharts  
**Versão:** 2.0  
**Data:** Julho 2025

