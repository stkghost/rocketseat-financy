# Financy

Aplicação web para organizar finanças pessoais, desenvolvida como desafio da pós-graduação da Rocketseat. Com ela, cada usuário registra suas receitas e despesas, organiza tudo em categorias e acompanha o saldo e os gastos do mês em um dashboard.

O projeto é dividido em duas partes:

- **Front-end** (este repositório): aplicação React que consome a API via GraphQL.
- **Back-end**: API GraphQL com Node.js, Prisma e SQLite, na pasta `backend` ao lado desta (`../backend`).

## Funcionalidades

- **Conta**
  - Criar conta e fazer login, com a opção "Lembrar-me" para manter a sessão após fechar o navegador.
  - Editar o nome no perfil (o e-mail não pode ser alterado) e sair da conta.
- **Dashboard**
  - Saldo total, receitas do mês e despesas do mês.
  - As 5 transações mais recentes e as categorias mais utilizadas.
- **Transações**
  - Criar, editar e excluir receitas e despesas.
  - Listagem com busca por descrição, filtros por tipo, categoria e período, e paginação.
- **Categorias**
  - Criar, editar e excluir categorias com título, descrição, ícone e cor.
  - Resumo com total de categorias, total de transações e categoria mais utilizada.
  - Uma categoria que possui transações não pode ser excluída.
- **Privacidade**: cada usuário vê e gerencia apenas as próprias transações e categorias.

## Tecnologias

**Front-end**

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [Apollo Client](https://www.apollographql.com/docs/react) para consultas GraphQL
- [React Router](https://reactrouter.com) para as rotas
- [Tailwind CSS 4](https://tailwindcss.com) e [shadcn/ui](https://ui.shadcn.com) (Radix UI) para a interface
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) para formulários e validação
- [Zustand](https://zustand.docs.pmnd.rs) para a sessão do usuário
- [Lucide](https://lucide.dev) para os ícones, [Sonner](https://sonner.emilkowal.ski) para as notificações e a fonte Inter

**Back-end**

- [Node.js](https://nodejs.org) + [Express](https://expressjs.com) + [Apollo Server](https://www.apollographql.com/docs/apollo-server)
- [TypeGraphQL](https://typegraphql.com) para o schema GraphQL
- [Prisma](https://www.prisma.io) com banco [SQLite](https://www.sqlite.org)
- Autenticação com JWT e senhas criptografadas com bcrypt

## Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior (desenvolvido com a versão 24)
- npm (instalado junto com o Node.js)

## Como executar

Rode a API primeiro e depois o front-end, cada um em um terminal.

### 1. API (back-end)

Na pasta `backend`:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

> No PowerShell, use `Copy-Item .env.example .env`.

Abra o `.env` e preencha `JWT_SECRET` com um texto secreto qualquer. Para gerar um valor aleatório:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Crie o banco de dados e inicie o servidor:

```bash
npm run migrate
npm run dev
```

A API fica disponível em `http://localhost:4000/graphql`. Ao abrir esse endereço no navegador, o Apollo Sandbox permite testar as queries e mutations. Para as operações que exigem login, envie o header `Authorization: Bearer <token>` com o token retornado por `register` ou `login`.

### 2. Front-end

Neste repositório:

```bash
npm install
cp .env.example .env
npm run dev
```

> No PowerShell, use `Copy-Item .env.example .env`.

Acesse `http://localhost:5173`, crie uma conta e comece a usar.

## Variáveis de ambiente

**Front-end** (`.env`)

| Variável           | Descrição                    | Exemplo                         |
| ------------------ | ---------------------------- | ------------------------------- |
| `VITE_BACKEND_URL` | Endereço da API GraphQL      | `http://localhost:4000/graphql` |

**Back-end** (`backend/.env`)

| Variável       | Descrição                                            | Exemplo                 |
| -------------- | ---------------------------------------------------- | ----------------------- |
| `JWT_SECRET`   | Segredo usado para assinar os tokens de login        | texto aleatório         |
| `DATABASE_URL` | Caminho do banco SQLite                              | `file:./dev.db`         |
| `PORT`         | Porta da API                                         | `4000`                  |
| `CORS_ORIGIN`  | Endereço do front-end liberado no CORS               | `http://localhost:5173` |

## Scripts

**Front-end**

| Comando           | Descrição                                   |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento        |
| `npm run build`   | Verifica os tipos e gera a versão de produção |
| `npm run preview` | Serve localmente a versão de produção       |
| `npm run lint`    | Analisa o código com o Oxlint               |

**Back-end**

| Comando            | Descrição                                                   |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Inicia a API com recarregamento automático (`tsx watch`)    |
| `npm run migrate`  | Cria ou atualiza o banco de dados com as migrations         |
| `npm run studio`   | Abre o Prisma Studio para visualizar os dados               |
| `npm run build`    | Compila a API para JavaScript                               |
| `npm run start`    | Executa a versão compilada                                  |

## Páginas

| Rota            | Descrição                                                    |
| --------------- | ------------------------------------------------------------ |
| `/`             | Login (sem sessão) ou dashboard (com sessão)                 |
| `/signup`       | Criação de conta                                             |
| `/transactions` | Listagem, filtros e gerenciamento de transações              |
| `/categories`   | Listagem e gerenciamento de categorias                       |
| `/profile`      | Perfil do usuário                                            |

Os formulários de transação e de categoria abrem em modais.

## Estrutura de pastas

```
src/
├── assets/            # Logo e imagens
├── components/
│   ├── categories/    # Card e modal de categoria, seletores de ícone e cor
│   ├── dashboard/     # Cards e painéis do dashboard
│   ├── form/          # Campos de formulário (texto, senha, select, data, valor)
│   ├── transactions/  # Modal, tabela e filtros de transações
│   └── ui/            # Componentes base do shadcn/ui (botão, modal, checkbox...)
├── lib/
│   └── graphql/       # Cliente Apollo, queries e mutations
├── pages/             # Páginas da aplicação
├── stores/            # Estado da sessão (Zustand)
└── types/             # Tipos compartilhados
```
