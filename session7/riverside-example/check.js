/*
  check.js — Riverside FC example (Session 27)

  A runnable end-to-end check (no Jest, no Postgres) that drives the app with
  supertest and asserts the auth, pagination and permission behaviour. It uses
  the seeded demo logins from the fake db. Run: node check.js
  A silent run ending in the success line means everything passed.
*/

const assert = require("assert");
const request = require("supertest");
const app = require("./src/app");

async function login(email, password) {
  const res = await request(app).post("/auth/login").send({ email, password });
  assert.strictEqual(res.status, 200, `login ${email} -> 200`);
  return res.body.token;
}

async function main() {
  // ---- no token -> 401 ----
  assert.strictEqual((await request(app).get("/fixtures")).status, 401, "no token -> 401");

  // ---- login as seeded member + admin ----
  const memberToken = await login("ana@example.com", "password1");
  const adminToken = await login("coach@riverside.fc", "adminpass1");

  // ---- bad password -> 401 ----
  const bad = await request(app).post("/auth/login").send({ email: "ana@example.com", password: "wrong" });
  assert.strictEqual(bad.status, 401, "bad password -> 401");

  const authM = (r) => r.set("Authorization", `Bearer ${memberToken}`);
  const authA = (r) => r.set("Authorization", `Bearer ${adminToken}`);

  // ---- pagination on fixtures ----
  const p1 = await authM(request(app).get("/fixtures?limit=2&offset=0"));
  assert.strictEqual(p1.status, 200, "member can read fixtures");
  assert.strictEqual(p1.body.data.length, 2, "page size 2");
  const p2 = await authM(request(app).get("/fixtures?limit=2&offset=2"));
  assert.strictEqual(p2.body.data[0].id, 3, "offset 2 -> id 3");

  // ---- permissions: member cannot create a fixture (403), admin can (201) ----
  const memberCreate = await authM(
    request(app).post("/fixtures").send({ opponent: "Riverton AFC", matchDate: "2026-10-03" })
  );
  assert.strictEqual(memberCreate.status, 403, "member create fixture -> 403");

  const adminCreate = await authA(
    request(app).post("/fixtures").send({ opponent: "Riverton AFC", matchDate: "2026-10-03" })
  );
  assert.strictEqual(adminCreate.status, 201, "admin create fixture -> 201");
  assert.ok(adminCreate.headers.location.startsWith("/fixtures/"), "201 sets Location");

  // ---- validation: bad body -> 400 ----
  const badCreate = await authA(request(app).post("/fixtures").send({ opponent: "" }));
  assert.strictEqual(badCreate.status, 400, "invalid fixture -> 400");

  // ---- tickets ownership ----
  // Member ana (id 1) lists tickets -> only her own (seeded ticket id 1).
  const anaTickets = await authM(request(app).get("/tickets"));
  assert.ok(anaTickets.body.data.every((t) => t.user_id === 1), "member sees only own tickets");

  // Ben's ticket is id 2; ana must not be able to read it -> 403.
  const otherTicket = await authM(request(app).get("/tickets/2"));
  assert.strictEqual(otherTicket.status, 403, "member reading another's ticket -> 403");

  // Ana buys a ticket for herself -> 201, and it is owned by her (not the body).
  const buy = await authM(request(app).post("/tickets").send({ fixtureId: 1, type: "family" }));
  assert.strictEqual(buy.status, 201, "member buys ticket -> 201");
  assert.strictEqual(buy.body.user_id, 1, "ticket owned by the caller");
  assert.strictEqual(buy.body.price, 60, "family price = 60");

  // Admin can read any ticket.
  const adminReadsBen = await authA(request(app).get("/tickets/2"));
  assert.strictEqual(adminReadsBen.status, 200, "admin reads any ticket -> 200");

  // ---- register a new member, then log in as them ----
  const reg = await request(app).post("/auth/register").send({ email: "new@fan.com", password: "supersecret" });
  assert.strictEqual(reg.status, 201, "register -> 201");
  assert.strictEqual(reg.body.role, "member", "new user is a member");
  assert.ok(reg.body.password_hash === undefined, "response never leaks password_hash");
  await login("new@fan.com", "supersecret");

  console.log("All API checks passed (silent === pass).");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
