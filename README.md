# Powering

**Demo online:** [powering.fumarola.dev/auth](https://powering.fumarola.dev/auth)

Monorepo per la gestione di un sistema di alimentazione/ricarica, composto da:

- **Frontend** — TanStack Start (React 19, Vite, TanStack Router/Query, Tailwind CSS 4, shadcn/ui)
- **Backend** — NestJS 11 REST API (TypeORM, PostgreSQL, Passport.js JWT + social auth)

## Prerequisiti

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9
- [Docker](https://www.docker.com/) e Docker Compose

## Primo avvio

### 1. Configurazione ambiente

```bash
cp backend/env-example backend/.env
```

Nel file `backend/.env`, modifica:

- `DATABASE_HOST=postgres` → `DATABASE_HOST=localhost`
- `MAIL_HOST=maildev` → `MAIL_HOST=localhost`

### 2. Avviare i servizi Docker

```bash
cd backend
docker compose up -d
```

Questo avvia PostgreSQL e MailDev.

### 3. Backend

```bash
cd backend
pnpm install
pnpm migration:run
pnpm seed:run
pnpm start:dev
```

### 4. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Link utili

| Servizio | URL |
| -------- | --- |
| Frontend | http://localhost:3000 |
| API Swagger | http://localhost:3000/docs |
| MailDev | http://localhost:1080 |

## Comandi utili

### Backend (`cd backend`)

```bash
pnpm start:dev                # Dev server (watch mode)
pnpm build                    # Compilazione TypeScript
pnpm lint                     # ESLint
pnpm format                   # Prettier
pnpm test                     # Test unitari
pnpm test:e2e                 # Test E2E
pnpm migration:generate src/database/migrations/NomeMigrazione
pnpm migration:run            # Esegui migrazioni
pnpm migration:revert         # Annulla ultima migrazione
pnpm seed:run                 # Esegui seed
```

### Frontend (`cd frontend`)

```bash
pnpm dev                      # Dev server
pnpm build                    # Build produzione
pnpm test                     # Test Vitest
```
