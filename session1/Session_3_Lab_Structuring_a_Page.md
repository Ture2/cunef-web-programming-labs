# Session 3 Lab — Structuring a Page

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 1 · Session 3 · Practice (AF2) · Pair work

---

## 1. Context

Sessions 1–2 covered how the web works, why semantic HTML matters, the anatomy of
elements and attributes, and the landmark tags (`<header>`, `<nav>`, `<main>`,
`<section>`, `<article>`, `<aside>`, `<footer>`). This lab is where that vocabulary
turns into a real file for the first time.

There is **no CSS and no JavaScript in this lab.** The point is to prove you can
express a page's structure correctly using nothing but HTML — block elements,
inline elements, semantic landmarks, and attributes. Styling starts in Session 4;
interactivity starts in Session 7. A page that looks like a plain, unstyled
document but is *structurally* correct is a full-credit submission today.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Choose the correct semantic landmark for a given piece of content.
- Distinguish block-level elements from inline elements and use each appropriately.
- Write valid attributes (`href`, `src`, `alt`, `width`/`height`, `lang`, `title`)
  by hand, without copying a template.
- Produce an HTML document that passes the W3C Markup Validator with zero errors.

---

## 3. The target

Working with **one partner**, choose a web application topic and build the HTML
**skeleton** of its homepage — structure only, no visual design.

Pick any topic that genuinely interests your pair. Some starting ideas:

- A **football club** homepage (fixtures, latest news, squad, ticket info)
- A **social media** profile page (posts feed, profile info, friends/followers list)
- A **marketing / landing page** for a product or event
- A **recipe or food blog** (recipe list, featured recipe, about the author)
- A **portfolio** page for a photographer, designer, or musician
- A **local business** page (restaurant, gym, bookshop) with hours, menu/services, location
- An **online course** or bootcamp landing page

The topic itself is not graded — the *structure* is. A football page and a social
media page built to the same rubric earn the same grade.

---

## 4. Working in pairs

- Sit with one classmate and agree on a topic together before writing any code.
- **Both of you must be able to explain every tag in the final file** — pairing
  means working through the structure together, not splitting the file in half.
- A useful pattern: one person types while the other reads the spec and catches
  mistakes, then swap roles halfway through the session.
- Submit **one file per pair**, with both names in a comment at the top of the
  document.

---

## 5. What the skeleton must contain

Your `index.html` must include, at minimum:

1. **Document setup**
   - `<!DOCTYPE html>`, `<html lang="en">` (or `"es"` — match your content),
     `<head>` with `<meta charset="UTF-8">` and a descriptive `<title>`.
2. **Landmark structure**
   - `<header>` with a site name/logo placeholder and a `<nav>` containing at
     least 3 links (`<a href="...">`).
   - `<main>` containing **at least two** `<section>` elements relevant to your
     topic (e.g. "Latest News" and "Upcoming Fixtures" for a football page).
   - At least one `<article>` inside a section — content that would make sense
     on its own if shared elsewhere (a news post, a single product, a single recipe).
   - Optionally, an `<aside>` for tangential content (a sidebar stat, a related
     link, an ad placeholder).
   - `<footer>` with copyright text and at least one link.
3. **Block-level elements**
   - Headings used in order (one `<h1>`, then `<h2>`s for section titles, `<h3>`s
     if you nest further — never skip a level).
   - At least one `<p>`, one `<ul>` or `<ol>` list, and one `<img>` with correct
     `alt`, `width`, and `height` attributes.
4. **Inline elements**
   - At least one `<a>` link inside a paragraph (not just in the nav).
   - At least one `<strong>` or `<em>` used for genuine emphasis (not decoration).
   - At least one `<span>` wrapping a piece of text for a reason you can explain.
5. **Attributes**
   - Every `<img>` has `alt`, `width`, and `height`.
   - Every `<a>` has a valid `href` (an external URL, or `#section-id` for an
     on-page link).
   - The `<html>` tag has `lang`.
   - At least one element uses `title` for supplementary tooltip text.

---

## 6. Steps

1. **Agree on a topic and sketch it on paper first** — five boxes for header, nav,
   main sections, aside, footer is enough. Do this before opening a code editor.
2. Create `index.html` with the document setup from §5.1.
3. Build the `<header>` and `<nav>`.
4. Build `<main>` section by section, filling in real (if placeholder) content —
   not "Lorem ipsum." Write actual headlines, actual list items, for your topic.
5. Add an `<aside>` if your topic supports one.
6. Build the `<footer>`.
7. Re-read the whole file together and check every item in the checklist below.
8. Validate at <https://validator.w3.org/#validate_by_input> by pasting your HTML.
   Fix every error (warnings are fine to leave, but discuss them with your partner
   first).

---

## 7. Deliverable

- **One file:** `index.html`, containing both partners' names in an HTML comment
  at the top.
- Pushed to a shared GitHub repo (either partner's account, both added as
  collaborators), or submitted as instructed in class.
- No CSS file, no `<style>` block, no JavaScript. If you're tempted to add color
  or layout, save that instinct for Session 6.

---

## 8. Self-check before submitting

- [ ] `<!DOCTYPE html>` and `<html lang="...">` present
- [ ] One `<h1>`, heading levels never skip (no `<h1>` straight to `<h3>`)
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` all present
- [ ] At least two `<section>`s and one `<article>` inside `<main>`
- [ ] Every `<img>` has `alt`, `width`, `height`
- [ ] Every `<a>` has a working `href`
- [ ] At least one `<ul>` or `<ol>`
- [ ] At least one inline `<a>`, one `<strong>` or `<em>`, and one `<span>` inside
      running text (not just in the nav)
- [ ] Zero errors on the W3C Markup Validator
- [ ] No CSS, no JavaScript, no inline `style=""` attributes
- [ ] Both partners can explain every section of the file out loud

---

## 9. Reference example

An example skeleton for a **local football club homepage** is provided alongside
this brief (`example_football_club.html`). It satisfies every item in the
checklist above and is deliberately unstyled — open it in a browser to see what a
full-credit *structure-only* submission looks like before you start your own.

That homepage is the hub of a small **multi-page site** used in Part 2 below. The
sibling pages live in the same folder and are all reachable from the shared `<nav>`:

- `example_football_club_fixtures.html` — a Fixtures & Results page
- `example_football_club_squad.html` — a First Team Squad page
- `example_football_club_tickets.html` — a Tickets page
- `example_football_club_login.html` — a **Member Login** page with a real HTML
  `<form>` (the starting point for authentication in Block II)

Open the homepage and click through the nav to see how `href` turns a folder of
separate `.html` files into one navigable site.

Do not copy them directly — your pair must choose your own topic. Use them only to
see the expected shape and depth of a passing submission.

---

## 10. Part 2 — Building a small multi-page site

In Part 1 you built **one** page and used `href` in two ways: for on-page jumps
(`href="#fixtures"`) and as placeholders for links you had not built yet
(`href="/contact"`). A real website is more than one page, and the thing that turns
a folder of HTML files into a *site* is the `href` attribute connecting them. Part 2
is where you turn your single page into a small **multi-page site** with a shared
navigation bar — including a **login page**, your first real HTML form.

### 10.1 Learning objectives

By the end of Part 2 you will be able to:

- Split content across several HTML pages in one folder and link them together.
- Build a **shared `<nav>`** that appears on every page, so any page can reach any
  other (relative URLs like `href="squad.html"`).
- Choose the right kind of `href` value for the job:
  - a **relative URL** (`squad.html`) to another page in your own site,
  - a **relative URL + fragment** (`fixtures.html#results`) to jump to a section
    of another page,
  - an **absolute URL** (`https://…`) to an external site.
- Build a **login page** with a semantic HTML `<form>`: `<label>`s bound to typed
  `<input>`s, and a submit `<button>`.

### 10.2 What to build

Grow the single page from Part 1 into a site of **at least four pages** that share
one navigation bar. For a football club that is Home + Fixtures + Squad + Tickets +
Login; for a recipe blog it might be Home + Recipes + a single Recipe + About +
Login; for a portfolio, Home + Projects + Contact + Login. Choose pages your own
topic naturally needs — but **one of them must be a Login page** (see §10.3).

Requirements for the site:

1. **A shared nav.** Every page has the same `<nav>` with the same links, each a
   relative `href` to a sibling file (`index.html`, `fixtures.html`, …). You should
   be able to start on any page and reach every other page by clicking.
2. **Real pages, not fragments.** The dedicated pages are separate files
   (`fixtures.html`), not just `#fixtures` sections of the homepage. Turn the
   homepage's long sections into short **teasers** that link out to the full page.
3. **Each page is complete and valid** on its own: same document-setup rules as
   Part 1 (`<!DOCTYPE html>`, `<html lang="…">`, `<head>` with a `<title>`, and a
   semantic `<header>` / `<main>` / `<footer>`), with at least two `<section>`s of
   real (placeholder) content relevant to that page.
4. **At least one file + fragment link** somewhere (e.g. a homepage teaser linking
   to `fixtures.html#results`), and **at least one external** absolute-URL link.

### 10.3 The login page (your first HTML form)

Add a `login.html` page whose `<main>` contains a semantic sign-in **form**:

- A `<form>` element wrapping the fields.
- An **email** field: `<input type="email">` with a matching
  `<label for="email">` (the label's `for` equals the input's `id`).
- A **password** field: `<input type="password">` with its own `<label>`, and a
  `minlength` attribute.
- A submit **button**: `<button type="submit">Sign in</button>`.
- Use validation attributes where they fit (`required`, `minlength`).

> **This form is front-end only in Block I.** It has no `action`, submits nowhere,
> and logs nobody in — clicking *Sign in* does nothing yet. That is expected.
> Actually checking a password against a server is **authentication**, which you
> build in **Block II**; this page is the structural starting point. Keep it simple
> and correct now, and you will wire it up later.

### 10.4 Steps

1. Save your Part 1 file as `index.html` and keep **all** pages in the same folder
   (relative links assume this).
2. Write the shared `<nav>` once, correctly, then copy it into every page so the
   links are identical everywhere.
3. Create each dedicated page (`fixtures.html`, `squad.html`, …) with its `<head>`
   and semantic skeleton, filling in real placeholder content.
4. Replace the homepage's full sections with short teasers that link out
   (`<a href="fixtures.html">See all fixtures</a>`).
5. Build `login.html` with the form from §10.3.
6. In every page's `<footer>`, add a "Back to homepage" link.
7. Open `index.html` and click through **every** nav link on **every** page. Fix any
   link that 404s or misspells a filename.
8. Validate **every** file with the W3C Markup Validator.

### 10.5 Deliverable

- **At least four HTML files** in one folder, sharing an identical `<nav>`, each
  validated, each with the pair's names in a comment at the top.
- One of them is a **login page** with a semantic `<form>` (labelled email +
  password inputs and a submit button).
- Navigation works by clicking alone — from any page you can reach any other.
- Pushed to the same shared GitHub repo as Part 1.
- Still **no CSS and no JavaScript** — this is about structure, `href`, and forms.
  Styling the site is Session 6; the login form gets validation logic in Session 9.

### 10.6 Self-check before submitting Part 2

- [ ] At least four complete, valid HTML pages in the same folder
- [ ] An identical shared `<nav>` on every page, using relative `href`s
- [ ] From any page you can reach every other page by clicking (no 404s)
- [ ] The homepage uses short teasers that link out to the dedicated pages
- [ ] At least one file + fragment link (e.g. `fixtures.html#results`)
- [ ] At least one external link with a full absolute URL (`https://…`)
- [ ] A `login.html` with a `<form>`: email + password `<input>`s, each with a
      bound `<label>` (`for`/`id`), and a submit `<button>`
- [ ] Every file passes the W3C Markup Validator with zero errors
- [ ] Still no CSS, no JavaScript, no inline `style=""`

> **Reference:** the `example_football_club_*.html` files (homepage + fixtures,
> squad, tickets, and login) together show exactly this shared-nav, multi-page
> pattern, and the login page shows the expected form structure.


