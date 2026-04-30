# CRM Projeto (React + Node + PostgreSQL)

CRM completo com autenticacao JWT, cadastro e gestao de clientes, detalhes, relatorios, paginacao e deploy com Docker.

## Estrutura

```txt
crm-primo/
├── frontend/    # React 18+ (Vite)
├── backend/     # Node.js + Express + PostgreSQL
└── README.md
```

## Funcionalidades implementadas

- Login e registro com JWT
- Rotas protegidas no frontend
- Dashboard com busca, paginacao (10 por pagina), criar/editar/deletar
- Pagina de detalhes do cliente com notas
- Relatorios com resumo e grafico de barras
- Toasts, loading, confirmacao antes de deletar
- Validacao de inputs no backend e frontend
- Seed automatico de usuario de teste

## 1) Instalar dependencias

```bash
cd frontend && npm install
cd ../backend && npm install
```

## 2) Configurar banco de dados

### Opcao A: Docker (recomendado)

No diretorio raiz:

```bash
docker compose up -d postgres
```

### Opcao B: PostgreSQL local

Crie um banco chamado `crm_db` e ajuste `backend/.env`.

## 3) Configurar variaveis de ambiente

Arquivo `backend/.env` (ja incluido):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm_db
JWT_SECRET=troque_esta_chave_em_producao
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
SEED_USER_EMAIL=admin@crm.local
SEED_USER_PASSWORD=123456
SEED_USER_NAME=Admin CRM
```

Arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4) Rodar em desenvolvimento

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 5) Deploy / producao

### Build local

```bash
cd frontend && npm run build
cd ../backend && npm start
```

### Docker completo

Na raiz:

```bash
docker compose up --build -d
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

## Scripts disponiveis

### Frontend (`frontend/package.json`)
- `npm run dev`
- `npm run build`
- `npm start`

### Backend (`backend/package.json`)
- `npm run dev`
- `npm run build`
- `npm start`

## Credenciais de teste

- Email: `admin@crm.local`
- Senha: `123456`

Esse usuario e criado automaticamente quando o backend inicia e conecta ao banco.
