# Descobertas da Pesquisa - Autenticação e Relatórios Visuais

## Autenticação no Flask

### Opções e Abordagens:

1.  **Flask-Login**: Uma extensão popular que fornece gerenciamento de sessão de usuário, lembre-me de funcionalidade, proteção contra força bruta e muito mais. É relativamente simples de usar para autenticação baseada em sessão.
    -   **Prós**: Fácil de integrar, bem documentado, amplamente utilizado, lida com muitos detalhes de segurança.
    -   **Contras**: Principalmente baseado em sessão (cookies), o que pode ser menos flexível para APIs RESTful puras ou aplicações móveis.

2.  **JSON Web Tokens (JWT)**: Uma abordagem baseada em token onde o servidor gera um token após o login bem-sucedido, e o cliente envia esse token em cada requisição subsequente. O token contém informações sobre o usuário e é assinado digitalmente para garantir sua integridade.
    -   **Prós**: Stateless (não requer sessões no servidor), escalável, ideal para APIs RESTful e aplicações distribuídas, pode ser usado em diferentes plataformas (web, mobile).
    -   **Contras**: Requer mais gerenciamento de segurança (revogação de tokens, armazenamento seguro no cliente), pode ser mais complexo de implementar inicialmente.

3.  **Flask-Security-Too**: Uma extensão mais abrangente que constrói sobre o Flask-Login e adiciona funcionalidades como registro de usuário, gerenciamento de papéis, recuperação de senha, etc. Suporta autenticação baseada em sessão e token.
    -   **Prós**: Solução completa para segurança, abstrai muitos detalhes de implementação.
    -   **Contras**: Pode ser excessivo para requisitos muito simples, curva de aprendizado um pouco maior.

### Decisão para Autenticação:

Considerando a necessidade de uma aplicação multi-usuário com isolamento de dados e a natureza de uma aplicação web moderna (frontend React consumindo backend Flask), a abordagem com **JWT (JSON Web Tokens)** parece ser a mais adequada. Ela oferece a flexibilidade necessária para uma API RESTful e é mais escalável. Usaremos uma biblioteca como `Flask-JWT-Extended` para facilitar a implementação.

## Relatórios Visuais no React

### Opções e Abordagens:

1.  **Recharts**: Uma biblioteca de gráficos construída com React e D3.js. Oferece uma ampla variedade de tipos de gráficos e é altamente personalizável.
    -   **Prós**: Componentes React nativos, boa documentação, flexível, bom desempenho.
    -   **Contras**: Pode ter uma curva de aprendizado para personalizações avançadas.

2.  **Chart.js (com react-chartjs-2)**: Uma biblioteca de gráficos JavaScript popular e leve, com uma wrapper React (`react-chartjs-2`).
    -   **Prós**: Leve, fácil de usar, boa variedade de gráficos, grande comunidade.
    -   **Contras**: Menos 


React-native do que Recharts, personalização pode ser mais complexa para alguns casos.

3.  **MUI X Charts**: Uma biblioteca de gráficos da Material-UI, que se integra bem com outros componentes MUI.
    -   **Prós**: Integração perfeita com Material-UI, bom design.
    -   **Contras**: Pode ser mais pesado se você não estiver usando Material-UI em outras partes do projeto.

4.  **Nivo**: Uma biblioteca de gráficos React que oferece muitos componentes interativos e responsivos, com foco em personalização e temas.
    -   **Prós**: Muitos recursos interativos, fácil personalização, bom para dashboards.
    -   **Contras**: Pode ser um pouco mais complexo para casos de uso muito simples.

### Decisão para Relatórios Visuais:

**Recharts** é uma excelente escolha para a maioria dos casos de uso em React devido à sua natureza de componentes React nativos, flexibilidade e boa documentação. Será a biblioteca principal para a implementação de relatórios visuais. Para gráficos mais simples ou específicos, `react-chartjs-2` pode ser uma alternativa viável.

## Planejamento de Requisitos Adicionais

### Autenticação de Usuário
-   **Cadastro**: Formulário para novos usuários criarem uma conta (username, email, password).
-   **Login**: Formulário para usuários existentes acessarem suas contas (username/email, password).
-   **Logout**: Funcionalidade para encerrar a sessão do usuário.
-   **Proteção de Rotas**: Acesso restrito a funcionalidades e dados apenas para usuários autenticados.
-   **Hash de Senhas**: Armazenamento seguro de senhas usando técnicas de hashing (e.g., Bcrypt).

### Isolamento de Dados por Usuário
-   Cada transação e categoria será associada a um `user_id`.
-   Todas as consultas ao banco de dados para transações e categorias incluirão um filtro por `user_id` para garantir que um usuário só possa ver e gerenciar seus próprios dados.

### Menu de Navegação Abrangente
-   Um menu de navegação claro e intuitivo no frontend.
-   Links para as principais seções: Dashboard, Transações, Categorias, Relatórios, Perfil (futuro), Logout.
-   Navegação condicional: Mostrar/ocultar itens de menu com base no status de autenticação do usuário.

### Relatórios Visuais
-   **Gráfico de Barras**: Comparação de receitas vs. despesas por mês/ano.
-   **Gráfico de Pizza**: Distribuição de despesas por categoria.
-   **Gráfico de Linhas**: Evolução do saldo ao longo do tempo.
-   **Filtros de Relatórios**: Permitir que o usuário filtre os relatórios por período (mês, ano) e, para despesas, por categoria.
-   **Dados Agregados**: O backend precisará fornecer endpoints para dados agregados para os relatórios (ex: soma de despesas por categoria, receitas por mês).

## Próximos Passos

Com base nesta análise, o próximo passo será iniciar a implementação da autenticação e autorização no backend (Fase 2), utilizando JWT para a segurança das APIs e adaptando o modelo de usuário existente para incluir campos de senha e hash. Em seguida, o modelo de dados será adaptado para multi-usuário (Fase 3), e então o frontend será atualizado para lidar com autenticação, navegação e relatórios visuais (Fases 4 e 5).

