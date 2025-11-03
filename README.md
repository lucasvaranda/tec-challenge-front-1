# Pós Bank - Sistema de Gerenciamento Financeiro

Sistema de gerenciamento financeiro desenvolvido com Next.js.

## 🚀 Tecnologias

- Next.js 15.5.6
- React 19.1.0
- TypeScript
- SASS/SCSS
- React Icons

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## 🏃 Como Executar

### Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

### Produção
```bash
npm run build
npm start
```

## 📁 Estrutura

```
src/app/
├── (authenticated)/     # Rotas autenticadas
│   ├── dashboard/       # Dashboard
│   └── transactions/    # Transações
├── _components/         # Componentes reutilizáveis
├── _context/            # Contextos React
├── _core/               # Lógica de negócio
├── api/                 # API Routes
├── login/               # Login
└── register/            # Registro

data/                    # Dados mockados
├── transactions.json
└── users.json
```

## 🔐 Funcionalidades

- Autenticação (Login/Registro)
- Dashboard com saldo
- CRUD completo de transações (PIX, TED, Boleto)
- Interface responsiva

## 📡 API

- `GET /api/transactions` - Lista transações
- `POST /api/transactions` - Cria transação
- `PUT /api/transactions/[id]` - Atualiza transação
- `DELETE /api/transactions/[id]` - Deleta transação
- `POST /api/login` - Login
- `POST /api/register` - Registro

## 🎯 Rotas

- `/` - Landing page
- `/login` - Login
- `/register` - Registro
- `/dashboard` - Dashboard
- `/transactions` - Listagem de transações
- `/transactions/[id]` - Detalhes/Edição
