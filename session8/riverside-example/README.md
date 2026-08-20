# Riverside FC — Session 32 worked example (Static React Components)

> **REFERENCE ONLY** — this folder is a read-only worked example.
> Do not copy it for your own submission.

Demonstrates the Session 32 teaching goals using the Riverside FC
through-line: a static React app that renders hard-coded fixtures and
squad data.

## What this example shows

| File | Teaching point |
| --- | --- |
| `src/data.js` | Hard-coded domain data (no network) |
| `src/SiteHeader.jsx` | Stateless presentational component |
| `src/FixtureCard.jsx` | Pure function of props |
| `src/FixtureList.jsx` | `useState` for the Home/Away/All filter |
| `src/PlayerCard.jsx` | Pure function of props |
| `src/SquadList.jsx` | `.map()` + `key` prop |
| `src/App.jsx` | Props flow top-down; component decomposition |

## Running locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.  No backend required — all data is
hard-coded in `src/data.js`.

## Next step

Session 34 (`session9/riverside-example`) replaces `data.js` with
`useEffect + fetch` calls against the Block II Riverside API.
