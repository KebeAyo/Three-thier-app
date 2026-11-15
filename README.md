# Three-tier application

This project contains a React frontend and an Express/MySQL backend. Run both locally with PM2; Docker and Docker Compose are not required.

## Requirements

- Node.js and npm
- MySQL Server running locally
- PM2: `npm install --global pm2`

## Configure MySQL and environment

Create the database on your local MySQL server if it does not exist:

```sql
CREATE DATABASE mydatabase;
```

Configure the two applications independently:

- `app-tier/.env` contains `DB_HOST`, `DB_USER`, `DB_PWD`, `DB_DATABASE`, and the backend `PORT`.
- `web-tier/.env` contains the frontend `PORT` and `REACT_APP_API_BASE_URL`.

Use the corresponding `.env.example` files as templates. Replace the backend database values with credentials for your local MySQL server. The backend creates the `transactions` table when it starts. Actual `.env` files are ignored by Git.

## Install dependencies

From the project root in PowerShell:

```powershell
npm ci --prefix app-tier
npm install --prefix web-tier
```

The local frontend uses the React development server from `ecosystem.config.js`.
The EC2 deployment builds the frontend in GitHub Actions and serves the production
build on the server using `ecosystem.production.config.js`.

## Run with PM2

From the project root:

```powershell
pm2 start ecosystem.config.js
pm2 status
```

Or in VS Code, run **Terminal → Run Task → Start local application**.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health check: [http://localhost:4000/health](http://localhost:4000/health)

Useful PM2 commands:

```powershell
pm2 logs
pm2 stop three-tier-backend three-tier-frontend
pm2 restart ecosystem.config.js
```

The VS Code tasks also provide stop and status commands. If you change a port, update the matching `.env`; when changing the backend port, update `REACT_APP_API_BASE_URL` in `web-tier/.env` as well.

See [app-tier/README.md](./app-tier/README.md) for backend details and [web-tier/README.md](./web-tier/README.md) for frontend details.
