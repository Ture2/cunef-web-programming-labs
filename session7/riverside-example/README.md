# Riverside FC — auth, pagination & permissions (worked example, read-only)

**Web Application Programming (G247) · CUNEF EPS · Block II**
Companion to the **Session 27 capstone lab** (`Session_27_Lab_Auth_Pagination_Permissions.md`).

A **complete worked example you only need to read**. It is the Session 18 + 22
Riverside FC API with the Session 27 layer added on top: JWT login, request
validation, pagination, and role + ownership permissions — nothing new to build.

## Run it (optional)

```bash
npm install
npm start          # http://localhost:3000  (uses the in-memory fake db)
node check.js      # end-to-end supertest checks (no database needed)
```

With no `DATABASE_URL`, the app runs on an in-memory fake db seeded with two
logins:

| Email | Password | Role |
| --- | --- | --- |
| `ana@example.com` | `password1` | member |
| `coach@riverside.fc` | `adminpass1` | admin |

## The three ideas

- **Authentication** (`src/middleware/auth.js`): `POST /auth/login` checks the
  password with **bcrypt** and returns a **JWT** carrying `{ sub, role }`. Every
  protected route runs `auth`, which verifies the token and sets `req.user`.
- **Pagination** (`src/lib/pagination.js`): list routes accept `?limit=&offset=`,
  with safe defaults and a hard cap, and return `{ data, limit, offset }`.
- **Permissions**: two layers.
  - *Role* (`src/middleware/requireAdmin.js`): only an **admin** may create,
    update, or delete fixtures and squad players — a member gets **403**.
  - *Ownership* (in `ticketsController.js`): a **member** only ever lists, reads,
    or deletes **their own** tickets (someone else's → **403**), and buys tickets
    for themselves (the owner comes from the token, never the request body). An
    admin may see any ticket.

## Endpoints

| Method & path | Who | Notes |
| --- | --- | --- |
| `POST /auth/register` | anyone | create a member (bcrypt-hashed password) |
| `POST /auth/login` | anyone | returns `{ token }` |
| `GET /fixtures?limit=&offset=` | any member | paginated |
| `GET /fixtures/:id` | any member | |
| `POST/PUT/DELETE /fixtures[/:id]` | **admin only** | 403 for members |
| `GET/POST/PUT/DELETE /squad[/:id]` | read: member · write: **admin** | |
| `GET /tickets?limit=&offset=` | member: own · admin: all | |
| `GET /tickets/:id` | owner or admin | 403 otherwise |
| `POST /tickets` | any member | buys for themselves |
| `DELETE /tickets/:id` | owner or admin | |

## Try it

```bash
# log in and capture a token
TOKEN=$(curl -s -X POST localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"password1"}' | jq -r .token)

curl localhost:3000/fixtures -H "Authorization: Bearer $TOKEN"
```

## Security notes

- `JWT_SECRET` comes from the environment; the committed value is only a **dev
  fallback**. A real deployment sets a strong secret and never commits it.
- The bcrypt hash is never returned in any response.
- Every SQL statement in the models is parameterized (`$1, $2, …`).
