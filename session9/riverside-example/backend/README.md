# Riverside FC – Backend API

This is the Block II Express REST API bundled with this lab so you don't need to navigate to a previous session.

## Quick start

```powershell
npm install
npm start   # starts on http://localhost:3000
```

## Seeded demo logins

| Email | Password | Role |
| --- | --- | --- |
| ana@example.com | password1 | member |
| coach@riverside.fc | adminpass1 | admin |

## Key endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | /health | public |
| GET | /fixtures | public |
| GET | /squad | public |
| POST | /auth/login | public |
| POST | /auth/register | public |
| GET | /tickets | member token |
| POST | /tickets | member token |

Writes (POST/PUT/DELETE /fixtures, /squad) require an admin token.

No database setup needed — the in-memory fake database (`src/db/fakeDb.js`) is loaded automatically when `DATABASE_URL` is not set.

## Verify with

```powershell
node check.js
```
