# Frontend (React + Vite)

React/TypeScript UI for the employee management system with portals for admins, managers, and employees.

## Prerequisites
- Node.js 20+ recommended
- npm

## Setup & Run
```bash
npm install
npm run dev
```
- Dev server: http://localhost:5173
- API base URL: `http://localhost:8000` (see `src/services/useAxios.ts` / `GlobalContext.tsx`)

## Available Scripts
- `npm run dev` – start Vite dev server.
- `npm run build` – type-check and bundle for production.
- `npm run preview` – preview the production build.
- `npm run lint` – run ESLint.

## Notable Areas
- Routing: `src/App.tsx` and `src/pages/` (admin/manager/employee portals).
- Global state/services: `src/services/GlobalContext.tsx`, `EmployeeService.ts`, `PayService.ts`, `AuthenticationService.ts`.
- Auth: login stores `{ token, refresh, employee }` in global context and localStorage; API calls use axios instances from `useAxios`.
- Timesheets: `src/components/TimeSheetCard/TimeSheetCard.tsx`, `src/pages/TimeSheetPage.tsx`.
- Self-service: `src/pages/ManageSelfPage.tsx` with contact/pay info components.
