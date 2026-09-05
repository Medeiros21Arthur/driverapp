# DriverCare AI

Aplicativo mobile-first de saúde e segurança para motoristas (React + Vite), com API em Node.js (Express) e banco de dados **Azure SQL Server**.

## Arquitetura

- **Frontend**: React + Vite + Tailwind (`src/`)
- **Backend**: Node.js + Express (`server/`)
- **Banco de dados**: Azure SQL Server via driver `mssql` (browser não acessa o SQL Server diretamente)

O Supabase foi substituído por uma API própria sobre o Azure SQL Server:

| Recurso Supabase (antigo) | Azure SQL Server (atual) |
| --- | --- |
| `supabase.auth` (login/senha) | JWT + bcrypt geridos pela API em `server/index.js` |
| `supabase.auth.signInWithOAuth(google)` | Removido (pode ser adicionado depois com OAuth) |
| Tabelas `profiles`, `health_logs`, `water_logs`, `active_breaks` | Mesmas tabelas no Azure SQL (`server/schema.sql`) |

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Preparar o banco no Azure SQL Server

1. Crie um SQL Database no portal do Azure.
2. Execute o script `server/schema.sql` (Azure Data Studio, SSMS ou o "Query editor" do portal).
3. Configure o acesso no firewall do Azure para permitir a sua máquina (maiúscula "Your client IP"):
   - Vá em **Settings > Networking** e adicione o IP da sua máquina, ou habilite a opção de permitir serviços do Azure.

### 3. Configurar o ambiente

Copie o modelo e preencha as credenciais:

```bash
copy .env.example .env
```

Preencha no `.env`:
- `VITE_API_URL=/api` — em dev, o Vite usa proxy para o backend (não precisa mudar).
- `AZURE_SQL_CONNECTION_STRING` — string de conexão do Azure (recomendado). No portal, copie em
  **Connection strings > ADO.NET** e ajuste `{your_password}`.
- `JWT_SECRET` — troque por uma frase longa e secreta.

### 4. Rodar

```bash
npm run dev:all
```

Isso sobe a API (`http://localhost:3001`) e o Vite (`http://localhost:5173`) juntos.

Ou, em dois terminais:

```bash
npm run server   # API
npm run dev      # frontend
```

Abra o endereço exibido pelo Vite. Ao se cadastrar, o perfil é criado automaticamente e o login já entra na conta.

## Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Cadastro (nome, e-mail, senha, nascimento) |
| POST | `/api/auth/login` | Login — retorna JWT |
| GET | `/api/auth/me` | Usuário logado (valida o token) |
| POST | `/api/auth/change-password` | Troca de senha (autenticado) |
| POST | `/api/auth/forgot-password` | Gera token de redefinição (o envio real por e-mail precisa de SMTP) |
| POST | `/api/auth/reset-password` | Redefine a senha com o token |
| GET/PUT | `/api/profile` | Ler/atualizar perfil |
| GET/PUT | `/api/health` | Ler/salvar log de saúde do dia |
| POST | `/api/water` | Registrar copo de água |
| GET | `/api/water/day?date=` | Total de ml do dia |
| POST | `/api/breaks` | Registrar pausa ativa |
| GET | `/api/breaks/day?date=` | Total de pausas do dia |
| GET | `/api/breaks/weekly?date=&days=` | Pausas dos últimos N dias |
| GET | `/api/summary/day?date=` | Resumo do dia |
| GET | `/api/summary/month?year=&month=` | Resumo do mês |

Todas as rotas de dados exigem o header `Authorization: Bearer <token>`.

## Produção

- Rode `npm run build` e hospede a pasta `dist` (Vercel, Netlify, Azure Static Web Apps, etc.).
- Hospede a API (Azure App Service, Azure Functions, um VPS...) e aponte `VITE_API_URL` no build para a URL da API.
- Configure a variável `JWT_SECRET` e um provedor de e-mail (SMTP) para o envio do link de redefinição de senha.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Frontend (Vite) com proxy para a API |
| `npm run server` | API Express (Azure SQL) |
| `npm run dev:all` | Frontend + API juntos |
| `npm run build` | Build de produção do frontend |
| `npm run lint` | Lint (oxlint) |