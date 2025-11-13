# Passo a passo (resumo) — comandos para criar e rodar o projeto

## Pré-requisitos
- Node.js (v18+ recomendado)
- npm ou yarn
- PostgreSQL rodando localmente
- VSCode

## 1) Criar frontend (Vite)
PowerShell:
```powershell
cd C:\Users\asssa\Documents\LINGUAGEM\finance_pessoal
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

> Nota: Eu já adicionei um esqueleto em `frontend/src/` — rodar `npm install` criará dependências listadas em `frontend/package.json`.

## 2) Criar backend
```powershell
cd backend
npm install
# configure .env (copiar .env.example)
npm run dev
```

## 3) Criar DB e executar migração
```powershell
psql -U seu_usuario -d postgres -c "CREATE DATABASE finance_pessoal;"
psql -U seu_usuario -d finance_pessoal -f backend/migrations/init.sql
```

### Erro comum: "autenticação do tipo senha falhou para o usuário \"user\""
Se ao rodar o `seed` ou conectar o backend você receber um erro de autenticação (ex.: `auth_failed` / senha falhou), há duas abordagens:

Opção A — Ajustar `DATABASE_URL` para um usuário existente
- Abra `backend/.env` e substitua `DATABASE_URL` pelo usuário/senha corretos do seu PostgreSQL. Exemplo:
```text
DATABASE_URL=postgresql://postgres:MinhaSenhaSegura@localhost:5432/finance_pessoal
```

Opção B — Criar um usuário/DB específico e usar nas variáveis de ambiente
- Use um superusuário (geralmente `postgres`) para criar um role e o banco com owner:
```powershell
# criar role (substitua nomes e senha)
psql -U postgres -c "CREATE ROLE finance_user WITH LOGIN PASSWORD 'senha_segura';"
# criar database com owner
psql -U postgres -c "CREATE DATABASE finance_pessoal OWNER finance_user;"
# executar migração para criar tabelas (como owner finance_user)
psql -U finance_user -d finance_pessoal -f backend/migrations/init.sql
```

Depois, no `backend/.env` coloque:
```text
DATABASE_URL=postgresql://finance_user:senha_segura@localhost:5432/finance_pessoal
```

Observação: se preferir, pode usar o usuário `postgres` diretamente — apenas ajuste `DATABASE_URL` com a senha correta.

## 3.1) Popular com dados de exemplo (seed)
Há um script Node que popula um usuário de teste e transações de exemplo.
1. Configure `backend/.env` copiando `backend/.env.example` e ajustando `DATABASE_URL`.
2. No PowerShell execute:
```powershell
cd backend
npm install
node scripts/seed.js
```

O script imprimirá as credenciais de teste (email `test@example.com`, senha padrão `password123` ou `SEED_TEST_PASSWORD` se definido).

**Importante:** sempre execute `npm install` dentro da pasta `backend` antes de rodar o `seed` ou quaisquer scripts Node (migrações, seeds, etc.). Caso contrário, pacotes como `dotenv` não estarão disponíveis e o script irá falhar.

## 4) Conectar frontend e backend
- Ajuste `VITE_API_URL` em `.env` do frontend ou altere `frontend/.env` com `VITE_API_URL=http://localhost:4000`.

## 5) Testar fluxos básicos
- Registrar usuário -> Login -> Criar transação -> Listar/Filtrar -> Editar/Excluir
