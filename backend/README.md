# Backend (Spring Boot)

API for authentication (JWT + refresh), employees, timesheets, and payroll.

## Prerequisites
- JDK 21+
- Maven Wrapper (`./mvnw`) included

## Run
```bash
./mvnw spring-boot:run
```
- Port: `8000`
- DB: in-memory H2 (`spring.datasource.url` in `src/main/resources/application.properties`)
- H2 console: `/h2-console` (enabled)
- Seed users: `admin.employee@company.com` / `pass`, `manager.employee@company.com` / `pass`, `employee.one@company.com` / `pass`
- JWT/refresh:
  - `POST /auth/login` -> `{ employee, token, refresh }` (5 min access token, 24h refresh, rotated on refresh)
  - `GET /auth/refresh/{token}` -> rotated refresh + new access
  - Logout deletes the stored refresh token; refresh tokens are one-per-user

## Test
```bash
./mvnw test
```

## Key Endpoints
- `POST /auth/login` – authenticate user.
- `GET /auth/refresh/{token}` – rotate refresh & issue new access token.
- `GET /employee/{email}` / `PUT /employee/` – read/update employee.
- `GET /employee/reportsTo/{email}` – list manager’s reports.
- `PUT /employee/contact/{email}` / `PUT /employee/pay/{email}` – update contact/pay info.
- `POST /timesheet/` – create/read current employee timesheet.
- `PUT /timesheet/hours` / `PUT /timesheet/submit/{id}` – save/submit timesheet.
- `POST /timesheet/manager` / `PUT /timesheet/review` – manager review queue and approvals.
- `GET /payroll/preview` / `GET /payroll/run` – preview and execute payroll; `GET /payroll/view/{email}` for pay history.

Roles and route protections are defined in `src/main/java/com/fedorancolt/ems/configs/SecurityConfiguration.java`.
