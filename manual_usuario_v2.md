# Sistema de Controle de Finanças Pessoais - Versão 2.0

## 🎯 Visão Geral

O Sistema de Controle de Finanças Pessoais é uma aplicação web completa e moderna que permite gerenciar suas finanças pessoais de forma inteligente e segura. Esta versão 2.0 inclui autenticação de usuário, isolamento de dados, menu de navegação profissional e relatórios visuais avançados.

**URL de Acesso:** https://ogh5izcv0yzj.manus.space

## 🔐 Sistema de Autenticação

### Primeiro Acesso
1. **Cadastro de Conta:**
   - Acesse a URL do sistema
   - Clique em "Cadastre-se"
   - Preencha os campos obrigatórios:
     - Nome de Usuário (único)
     - Email (único)
     - Senha
     - Confirmação de Senha
   - Clique em "Criar Conta"

2. **Login:**
   - Use seu nome de usuário ou email
   - Digite sua senha
   - Clique em "Entrar"

### Segurança
- Cada usuário tem acesso apenas aos seus próprios dados
- Senhas são criptografadas com hash SHA-256
- Autenticação baseada em JWT tokens
- Sessão automática por 24 horas

## 🧭 Navegação do Sistema

### Menu Principal
O sistema possui um menu de navegação com 4 seções principais:

1. **📊 Dashboard** - Visão geral e resumo
2. **💰 Transações** - Lista completa de transações
3. **📈 Relatórios** - Gráficos e análises visuais
4. **🏷️ Categorias** - Gerenciamento de categorias

### Barra Superior
- **Nome do usuário** - Exibe o usuário logado
- **Botão Sair** - Logout seguro do sistema

## 📊 Dashboard

### Resumo Financeiro
- **Saldo Mensal:** Diferença entre receitas e despesas do mês atual
- **Saldo Anual:** Acumulado do ano
- **Receitas do Mês:** Total de receitas do mês atual
- **Despesas do Mês:** Total de despesas do mês atual

### Seções do Dashboard
1. **Cartões de Resumo:** Exibem valores principais com cores indicativas
2. **Formulário Rápido:** Adicionar nova transação diretamente
3. **Transações Recentes:** Últimas 5 transações registradas
4. **Filtros:** Controles para filtrar por período e categoria

## 💰 Gerenciamento de Transações

### Adicionar Transação
1. Acesse "Nova Transação" ou use o formulário no Dashboard
2. Preencha os campos:
   - **Tipo:** Receita ou Despesa
   - **Valor:** Valor em reais (apenas números)
   - **Descrição:** Descrição detalhada
   - **Categoria:** Selecione uma categoria existente
   - **Data:** Data da transação (padrão: hoje)
3. Clique em "Adicionar Transação"

### Visualizar Transações
- **Lista Completa:** Acesse a aba "Transações"
- **Filtros Disponíveis:**
  - Por mês e ano
  - Por tipo (receita/despesa)
  - Por categoria específica
- **Informações Exibidas:**
  - Data da transação
  - Tipo (ícone colorido)
  - Descrição
  - Categoria
  - Valor formatado

### Editar/Excluir Transações
- **Editar:** Clique no ícone de lápis na transação
- **Excluir:** Clique no ícone de lixeira (confirmação necessária)

## 📈 Relatórios Visuais

### Tipos de Gráficos

1. **Resumo Mensal (Gráfico de Barras):**
   - Comparação de receitas vs despesas por mês
   - Visualização anual completa
   - Cores: Verde (receitas) e Vermelho (despesas)

2. **Evolução do Saldo (Gráfico de Linha):**
   - Acompanha a evolução do saldo ao longo do ano
   - Identifica tendências de crescimento ou declínio
   - Linha azul com pontos de dados mensais

3. **Despesas por Categoria (Gráfico de Pizza):**
   - Distribuição percentual das despesas por categoria
   - Filtro por mês específico
   - Cores diferenciadas para cada categoria
   - Percentuais exibidos nas fatias

### Filtros de Relatórios
- **Ano:** Selecione o ano para análise
- **Mês:** Para gráfico de pizza (despesas por categoria)
- **Atualização:** Botão para recarregar dados

### Cards de Resumo Anual
- **Receitas Anuais:** Total de receitas do ano
- **Despesas Anuais:** Total de despesas do ano
- **Saldo Anual:** Diferença entre receitas e despesas

## 🏷️ Gerenciamento de Categorias

### Categorias Padrão
O sistema vem com categorias pré-definidas:

**Receitas:**
- Salário
- Freelance
- Investimentos
- Vendas
- Outros Ganhos

**Despesas:**
- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Compras
- Contas
- Investimentos
- Outros Gastos

### Gerenciar Categorias
1. **Adicionar Nova Categoria:**
   - Acesse a aba "Categorias"
   - Clique em "Nova Categoria"
   - Preencha nome e tipo (receita/despesa)
   - Clique em "Adicionar"

2. **Editar Categoria:**
   - Clique no ícone de edição
   - Modifique o nome ou tipo
   - Salve as alterações

3. **Excluir Categoria:**
   - Clique no ícone de exclusão
   - Confirme a ação
   - **Atenção:** Transações vinculadas serão afetadas

## 🎨 Interface e Design

### Características Visuais
- **Design Moderno:** Interface limpa e profissional
- **Responsivo:** Funciona em desktop, tablet e mobile
- **Cores Intuitivas:**
  - Verde: Receitas e valores positivos
  - Vermelho: Despesas e valores negativos
  - Azul: Elementos neutros e navegação
- **Ícones:** Lucide icons para melhor usabilidade

### Experiência do Usuário
- **Feedback Visual:** Botões com estados de loading
- **Validação:** Campos obrigatórios destacados
- **Mensagens:** Alertas de sucesso e erro
- **Navegação:** Menu fixo e breadcrumbs

## 📱 Compatibilidade

### Dispositivos Suportados
- **Desktop:** Windows, macOS, Linux
- **Mobile:** iOS, Android
- **Tablet:** iPad, Android tablets

### Navegadores Suportados
- Chrome (recomendado)
- Firefox
- Safari
- Edge

## 🔧 Funcionalidades Técnicas

### Performance
- **Carregamento Rápido:** Otimizado para velocidade
- **Cache:** Dados armazenados localmente quando possível
- **Compressão:** Assets minificados para produção

### Segurança
- **HTTPS:** Comunicação criptografada
- **JWT:** Tokens seguros para autenticação
- **Validação:** Dados validados no frontend e backend
- **Isolamento:** Dados completamente isolados por usuário

## 🆘 Solução de Problemas

### Problemas Comuns

1. **Não consigo fazer login:**
   - Verifique usuário/email e senha
   - Certifique-se de ter uma conta cadastrada
   - Tente limpar cache do navegador

2. **Gráficos não carregam:**
   - Verifique conexão com internet
   - Atualize a página
   - Certifique-se de ter transações no período

3. **Transação não aparece:**
   - Verifique os filtros aplicados
   - Confirme se a data está no período selecionado
   - Atualize a página

### Dicas de Uso

1. **Organização:**
   - Use categorias específicas para melhor análise
   - Mantenha descrições claras e consistentes
   - Registre transações regularmente

2. **Análise:**
   - Use os relatórios mensalmente para acompanhar tendências
   - Compare meses diferentes para identificar padrões
   - Foque nas categorias com maiores gastos

3. **Planejamento:**
   - Defina metas baseadas nos relatórios
   - Use o saldo mensal para controle de gastos
   - Monitore a evolução do saldo anual

## 📞 Suporte

Para dúvidas ou problemas técnicos, o sistema foi desenvolvido com as melhores práticas de usabilidade. A interface é intuitiva e autoexplicativa, mas este manual serve como referência completa para todas as funcionalidades disponíveis.

---

**Versão do Sistema:** 2.0  
**Última Atualização:** Julho 2025  
**Desenvolvido com:** React.js, Flask, SQLite, Recharts

