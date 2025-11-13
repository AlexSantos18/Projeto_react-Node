# Finance Pessoal

Este projeto tem como objetivo organizar e gerenciar finanças pessoais.

## Estrutura Inicial

## Como começar
1. Adicione módulos em `src/` para funcionalidades principais (ex: controle de despesas, receitas, relatórios).
2. Crie testes em `tests/` para garantir a qualidade do código.
3. Consulte `.github/copilot-instructions.md` para padrões e convenções do projeto.

## Recomendações

## Comandos rápidos (PowerShell)
Siga estas instruções no PowerShell do Windows (paths absolutos ilustrativos abaixo):

1) Preparar o banco de dados (PostgreSQL):
```powershell
# criar DB (substitua seu_usuario)
psql -U seu_usuario -d postgres -c "CREATE DATABASE finance_pessoal;"
# executar migração inicial
psql -U seu_usuario -d finance_pessoal -f backend/migrations/init.sql
```

2) Backend — instalar dependências, configurar `.env` e rodar:
```powershell
# do diretório do repositório
cd C:\Users\asssa\Documents\LINGUAGEM\finance_pessoal\backend
npm install
# copie o exemplo de .env e ajuste DATABASE_URL
copy .env.example .env
# rodar em modo dev (usa nodemon)
npm run dev
```

3) Rodar seed para popular com dados de teste:
```powershell
cd C:\Users\asssa\Documents\LINGUAGEM\finance_pessoal\backend
node scripts/seed.js
# Saída: credenciais de teste (email: test@example.com)
```

4) Frontend — instalar e rodar (Vite):
```powershell
cd C:\Users\asssa\Documents\LINGUAGEM\finance_pessoal\frontend
npm install
# copie o exemplo de .env se necessário
copy .env.example .env
npm run dev
```

5) Sugestão de uso no VSCode
- Use a configuração de depuração em `Run and Debug` → `Run Full Stack (Backend + Frontend + Browser)` para abrir backend + frontend + navegador automaticamente.
- Alternativamente, use as `Tasks` (veja `.vscode/tasks.json`) para rodar installs, seed e starts.

## Observações
- Ajuste `DATABASE_URL` em `backend/.env` para apontar ao seu PostgreSQL local.
- Para trocar a senha do usuário seed, defina `SEED_TEST_PASSWORD` em `backend/.env` antes de rodar o seed.
 - **Importante:** sempre execute `npm install` dentro de `backend/` antes de rodar scripts (por exemplo `node scripts/seed.js`) para garantir que todas as dependências estejam instaladas.

## Segurança / Git

- Nunca comite arquivos de ambiente com credenciais. Este repositório inclui uma entrada em `.gitignore` para `backend/.env` e `frontend/.env` para ajudar a evitar commits acidentais. Mantenha suas credenciais locais nesses arquivos e não os adicione ao controle de versão.
