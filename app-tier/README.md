# Backend

Express API backed by MySQL. The backend loads its local settings from `app-tier/.env`.

## Setup

1. Copy `.env.example` to `.env` if needed.
2. Set `DB_HOST`, `DB_USER`, `DB_PWD`, and `DB_DATABASE` to match your local MySQL server.
3. Ensure the configured database already exists.
4. Install dependencies from the project root with `npm ci --prefix app-tier`.

On startup, the backend retries the database connection and creates the `transactions` table if needed. The default API port is `4000`; override it with `PORT`.

## API routes

- `GET /health` — health check
- `GET /transaction` — list transactions
- `POST /transaction` — add a transaction with JSON `{ "amount": 12.50, "desc": "example" }`
- `DELETE /transaction` — delete all transactions
- `GET /transaction/id?id=1` — retrieve one transaction
- `DELETE /transaction/id` — delete one transaction by JSON body `{ "id": 1 }` or query parameter

Run the backend together with the frontend using `pm2 start ecosystem.config.js` from the project root.
