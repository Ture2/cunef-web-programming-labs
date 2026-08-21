# REFERENCE ONLY — do not copy for your own submission.

This is the full homogenized Riverside FC SPA: Block I visuals, Block II data, React Router v6, real JWT login, and a protected tickets page. The `backend/` folder is bundled here so everything runs from this single directory.

## Demo logins

| Email | Password | Role |
| --- | --- | --- |
| ana@example.com | password1 | member |
| coach@riverside.fc | adminpass1 | admin |

## Start the backend first

```powershell
cd backend
npm install
npm start     # http://localhost:3000
```

## Then start the frontend

```powershell
# from session10/riverside-example/
npm install
npm run dev   # http://localhost:5173
```

Vite proxies `/api/*` → `http://localhost:3000/*` so no CORS issues in development.

Routes: `/`, `/fixtures`, `/squad`, `/tickets` (protected — log in first), `/login`.
