# REFERENCE ONLY — do not copy for your own submission.

This worked example keeps the Block I Riverside FC look and fetches fixtures and squad data from the REST API using `useEffect` + `fetch`. The `backend/` folder is bundled here so everything runs from this single directory.

## Start the backend first

```powershell
cd backend
npm install
npm start     # http://localhost:3000
```

## Then start the frontend

```powershell
# from session9/riverside-example/
npm install
npm run dev   # http://localhost:5173
```

Vite proxies `/api/*` → `http://localhost:3000/*` so no CORS issues in development.
