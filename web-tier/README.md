# Frontend

React application built with Create React App. It loads local settings from `web-tier/.env`.

## Setup

1. Copy `.env.example` to `.env` if needed.
2. Set `PORT` for the frontend (default `3000`).
3. Set `REACT_APP_API_BASE_URL` to the backend URL (default `http://localhost:4000`).
4. Install dependencies from the project root with `npm install --prefix web-tier`.

Start the frontend and backend together from the project root with `pm2 start ecosystem.config.js`, or run the VS Code task **Start local application**.

The React development server is available at [http://localhost:3000](http://localhost:3000) by default. To build the frontend for production, run:

```powershell
npm run build --prefix web-tier
```
