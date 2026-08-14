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

Do not copy it directly — your pair must choose your own topic. Use it only to
see the expected shape and depth of a passing submission.
