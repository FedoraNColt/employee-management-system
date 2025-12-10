# Employee Management System

Monorepo for a simple employee management platform with a Spring Boot backend and a Vite/React frontend. Supports employee self‑service, manager approvals, payroll processing, and admin employee management.

## Project Layout
- `backend/` – Spring Boot API (Java 21, Maven).
- `frontend/` – React + TypeScript UI (Vite).

## Quick Start
1) Start the backend (port 8000, in‑memory H2):
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
   The UI expects the API at `http://localhost:8000` (configured in `frontend/src/services/apiClient.ts`).

## Development Notes
- Backend uses H2 in-memory DB with seed data; restart resets state.
- Update routes/roles in `backend/src/main/java/com/fedorancolt/ems/configs/SecurityConfiguration.java`.
- Frontend routing lives in `frontend/src/App.tsx` with portal pages under `frontend/src/pages`.

See `backend/README.md` and `frontend/README.md` for deeper details.
