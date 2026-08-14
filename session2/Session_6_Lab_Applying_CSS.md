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

## 4. Part 2 — Style your own Session 3 page

Now open the `index.html` your pair built in the Session 3 lab — the semantic
skeleton for the topic you chose. It has never had any CSS. That changes now.

### 4.1 What to do

Apply the same technique set from Part 1, adapted to your own content:

- The same `box-sizing: border-box` reset.
- Your `<header>` and its `<nav>` laid out with Flexbox.
- Your `<main>` region laid out with Grid **if** it has a sidebar-like
  structure (an `<aside>`), or with Flexbox if it's closer to a single
  stacked column of sections — the right tool depends on your own page's
  shape, and that choice is part of the exercise.
- Any repeating content (news items, squad list, product cards, posts —
  whatever your topic produced in Session 3) styled consistently as cards or
  list rows, using real box-model spacing.
- At least one responsive breakpoint that meaningfully changes the layout
  on a narrow screen, not just font sizes.

### 4.2 Part 2 deliverable

- A new `styles.css` in the same repo as your Session 3 `index.html`, linked
  from it.
- The page should be recognizably the same content as Session 3 — same
  HTML, same topic — now laid out and styled instead of a plain unstyled
  document.
- Both partners should be able to point to the stylesheet and explain which
  rule does what — pairing rules from Session 3 still apply.

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

**Part 2 (your own page):**
- [ ] Same reset applied
- [ ] Header/nav styled with Flexbox
- [ ] Main content area uses Grid or Flexbox — whichever fits your structure
- [ ] Repeating content styled consistently
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
