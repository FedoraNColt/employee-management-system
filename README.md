# Employee Management System

Monorepo for a simple employee management platform with a Spring Boot backend and a Vite/React frontend. Supports employee self‑service, manager approvals, payroll processing, and admin employee management.

## Project Layout
- `backend/` – Spring Boot API (Java 21, Maven).
- `frontend/` – React + TypeScript UI (Vite).

## Quick Start
1) Start the backend (port 8000, in‑memory H2 seeded with admin/manager/employee):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
2) Start the frontend (port 5173 by default):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The UI points to `http://localhost:8000` (see `src/services/useAxios.ts` / `GlobalContext.tsx`).

3) Run backend tests:
   ```bash
   cd backend
   ./mvnw test
   ```

## Development Notes
- Backend uses H2 in-memory DB with seed data; restart resets state. Tokens are JWT (5 min) + refresh (24h, rotated per use).
- Auth endpoints: `POST /auth/login` returns `{ employee, token, refresh }`; `GET /auth/refresh/{token}` issues new access + rotated refresh.
- Route protection lives in `backend/src/main/java/com/fedorancolt/ems/configs/SecurityConfiguration.java`.
- Frontend routing lives in `frontend/src/App.tsx` and `src/pages`; auth state is in `src/services/GlobalContext.tsx`.

See `backend/README.md` and `frontend/README.md` for deeper details.
