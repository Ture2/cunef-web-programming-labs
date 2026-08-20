# Session 6 Lab — Applying CSS: From Practice to Your Own Page

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 2 · Session 6 · Practice (AF2) · Pair work (same pairs as Session 3)

---

## 1. Context

Sessions 4–5 covered selectors and specificity, the box model, Flexbox, and Grid.
This lab is where all four stop being separate ideas and start being one skill:
turning a plain HTML skeleton into a laid-out, responsive page.

The lab has **two parts**, done in order:

1. A **guided practice** on a shared starter page everyone works from, so mistakes
   are cheap and everyone is styling the same known structure.
2. **Applying what you just practiced to your own Session 3 page** — the
   football club, social media profile, or whatever topic your pair chose —
   turning that unstyled skeleton into a real-looking layout.

Part 1 is where you make mistakes safely. Part 2 is where they count.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Apply the `box-sizing: border-box` reset and explain why it's the first rule
  in almost every stylesheet.
- Use Flexbox to lay out a navigation bar and a row of cards.
- Use Grid to lay out a page skeleton with a main content area and a sidebar.
- Write a `@media` breakpoint that collapses a multi-column layout to one
  column on narrow screens.
- Style spacing, borders, and typography using selectors of the correct
  specificity — not `!important`, not inline `style=""`.
- **Reuse a single stylesheet across every page of a multi-page site**, so the
  header, nav, and footer look identical everywhere.
- **Style an HTML form** — labels, text inputs, and a submit button — into a
  clean, usable sign-in card.

---

## 3. Part 1 — Guided practice on a shared starter page

### 3.1 The starter file

Use the provided `starter_practice_page.html` (attached alongside this brief) —
**do not modify its HTML.** This part of the lab is CSS-only: everyone styles
the exact same markup, so results are easy to compare pair to pair.

### 3.2 What your `practice-styles.css` must do

Build up the stylesheet in this order — each step should visibly change the
page before you move to the next:

1. **Reset.** `* { box-sizing: border-box; }` plus a sensible default margin/
   padding reset on `body`.
2. **Header as Flexbox.** `display: flex` on `header`, with the site title and
   `<nav>` laid out in a row using `justify-content: space-between` and
   `align-items: center`.
3. **Nav links as Flexbox.** The `<ul>` inside `<nav>` becomes a flex row too —
   no more bullet points, links spaced with `gap`.
4. **Page layout as Grid.** `<main>` becomes a CSS Grid with two columns: the
   `<section id="articles">` content on the left (wider track) and the
   `<aside>` sidebar on the right (narrower, fixed-ish track). Use
   `grid-template-columns`, not floats.
5. **Cards.** Every `<article class="card">` gets padding, a border or subtle
   box-shadow, a border-radius, and a margin-bottom so cards don't touch.
6. **Featured article image.** `max-width: 100%; height: auto;` so it never
   overflows its container.
7. **Responsive breakpoint.** A `@media (max-width: 768px)` block that changes
   `main`'s `grid-template-columns` to a single column, so the sidebar drops
   below the articles on a narrow screen.
8. **Footer.** Centered text, a top border or background tint to separate it
   from `main`.

### 3.3 Part 1 deliverable

- `starter_practice_page.html` (unmodified) + `practice-styles.css`, linked
  with a `<link rel="stylesheet">` in the `<head>`.
- Resize your browser (or use dev tools' device toolbar) to confirm the
  breakpoint actually collapses the layout — don't just trust the code.

---

## 4. Part 2 — Style your own Session 3 site

Now open the pages your pair built in the Session 3 lab — the semantic skeletons
for the topic you chose, including the **multi-page site** (homepage plus its
dedicated pages and the login page). They have never had any CSS. That changes now.

### 4.1 One stylesheet for the whole site

Create **one** `styles.css` and link it from **every** page with the same
`<link rel="stylesheet" href="styles.css">`. Because the shared `<header>`, `<nav>`,
and `<footer>` are (almost) identical markup on every page, a single stylesheet
styles them everywhere at once — change the nav once, and all pages update. This is
the whole point of an external stylesheet, and exactly how Practice 1 will be
graded in Block II.

### 4.2 What to do

Apply the same technique set from Part 1, adapted to your own content:

- The same `box-sizing: border-box` reset.
- Your `<header>` and its `<nav>` laid out with Flexbox — the nav bar looks the
  same on every page.
- Your homepage `<main>` laid out with Grid **if** it has a sidebar-like structure
  (an `<aside>`), or with Flexbox if it's closer to a single stacked column — the
  right tool depends on your page's shape, and that choice is part of the exercise.
- Your dedicated pages (fixtures/squad/tickets or your topic's equivalents) styled
  consistently: repeating content (a results table, a grid of cards, a price list)
  laid out with real box-model spacing.
- At least one responsive breakpoint that meaningfully changes a layout on a narrow
  screen, not just font sizes.

### 4.3 Style the login form

Your login page has a `<form>` — the first one in the course. Give it a clean,
centered sign-in card:

- Constrain the form to a comfortable reading width (e.g. `max-width: 420px;
  margin: 0 auto;`) so it isn't a full-width sprawl.
- Make each `<label>` a block above its input, and each text input full-width with
  padding, a border, and a `border-radius`.
- Add a visible **focus** style (`input:focus { … }`) so the active field stands
  out — an accessibility win, not just decoration.
- Style the submit `<button>` with your palette, full-width, with a hover state and
  `cursor: pointer`.

Remember the form still does nothing when clicked — that's expected. Styling it now
means it is ready for the validation logic you add in Session 9 and the real auth in
Block II.

### 4.4 Part 2 deliverable

- A single `styles.css` in the same repo as your Session 3 pages, linked from
  **every** page.
- The site should be recognizably the same content and structure as Session 3 —
  same HTML, same topic — now laid out and styled, with a consistent nav/header/
  footer across all pages and a styled login form.
- Both partners should be able to point to the stylesheet and explain which rule
  does what — pairing rules from Session 3 still apply.

---

## 5. Self-check before submitting

**Part 1 (practice page):**
- [ ] `box-sizing: border-box` applied globally
- [ ] Header uses `display: flex`
- [ ] Nav links use `display: flex` with `gap`, no bullets
- [ ] `<main>` uses `display: grid` with two tracks (content + aside)
- [ ] Cards have padding, border/shadow, border-radius, margin-bottom
- [ ] Featured image never overflows (`max-width: 100%`)
- [ ] A `@media (max-width: 768px)` breakpoint collapses the grid to one column
- [ ] No inline `style=""` attributes, no `!important`

**Part 2 (your own site):**
- [ ] Same reset applied
- [ ] One `styles.css` linked from every page; nav/header/footer identical across pages
- [ ] Header/nav styled with Flexbox
- [ ] Main content area uses Grid or Flexbox — whichever fits your structure
- [ ] Repeating content (table, card grid, price list) styled consistently
- [ ] Login form styled: centered card, block labels, full-width inputs, a focus
      style, and a styled submit button
- [ ] At least one real responsive breakpoint
- [ ] Both partners can explain every rule in the stylesheet

---

## 6. Why two parts

Styling your own page straight away means every mistake is tangled up with
your own content and layout decisions, which makes it hard to tell "did I get
Grid wrong" from "did I structure my HTML oddly in Session 3." Part 1 isolates
the CSS skill on a page you didn't have to design. Part 2 is where you prove
you can transfer it — which is also exactly what Practice 1 will ask of you
in Block II, on a codebase you didn't fully choose either.
