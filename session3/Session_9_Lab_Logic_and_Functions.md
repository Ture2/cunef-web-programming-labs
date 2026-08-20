# Session 9 Lab — Logic & Functions Exercises

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 3 · Session 9 · Practice (AF2) · Pair work (same pairs as Sessions 3 and 6)

---

## 1. Context

Sessions 7–8 covered variables and data types, control structures, and
functions — three ways to write a function, parameters vs arguments,
default parameters, and the return statement. This lab is where those ideas
stop being slides and start being code: small, self-contained problems that
force you to combine control flow and functions by hand.

The lab has **two parts**, done in order:

1. A **guided practice** on a shared starter file everyone completes — the
   same four tiny functions written in all three syntaxes, so mistakes are
   cheap and every pair ends up with the same known code.
2. **Applying what you just practiced to your own Session 3 page** —
   creating `exercises.js` in your repo, linking it into your `index.html`,
   and running the four exercise functions in the browser console on data
   from your own page.

This lab is **console-only**: your functions print to the browser's dev
tools console; they don't change the page. Making JavaScript *change* your
page is what Sessions 10–11 (the DOM) are for.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Write the same function in all three syntaxes — function declaration,
  function expression, and arrow function — and explain what differs.
- Use default parameters and the `return` statement correctly.
- Combine `for` loops and `if/else` to solve a small problem (FizzBuzz).
- Find the maximum of an array by hand, without `Math.max`.
- Normalize a string and check whether it is a palindrome.
- Verify your own code with `console.assert` and read the console output.
- Load your own JavaScript from your own page and run it in the browser
  dev tools console.
- Write pure **form-validation** functions (a well-formed email, a strong-enough
  password) and combine them — the console-only bridge to authentication in
  Block II.

---

## 3. Part 1 — Guided practice on a shared starter file

### 3.1 The starter file

Use the provided `starter_functions.js` (attached alongside this brief).
**Do not rename its functions and do not change their signatures** — the
tests at the bottom call them by name. You only write the bodies.

### 3.2 Read this first

Before opening the editor, read the six-concept comment block at the top
of `starter_functions.js` — parameter vs argument, function declaration,
function expression, arrow function, default parameters, and the return
statement. It is a condensed recap of Session 8.

Then skim the reference material:

- GeeksforGeeks — *Functions in JavaScript*:
  <https://www.geeksforgeeks.org/javascript/functions-in-javascript/>

You only need the core concepts: parameters vs arguments, named functions,
function expressions, arrow functions, default parameters, and the return
statement. Ignore the rest for now — IIFEs, recursion, constructors, async
functions, generators, and higher-order functions are beyond this lab.

### 3.3 What your `starter_functions.js` must do

Build up the file in this order — run the tests after each warm-up and
watch the red "Assertion failed" messages shrink before moving on:

1. **Warm-up 1 — `greet`.** Same behavior three times: `greet("Ana")`
   returns `"Hello, Ana!"`, and `greet()` returns `"Hello, friend!"` via a
   default parameter. Write it once as a declaration (`greetDeclaration`),
   once as an expression (`greetExpression`), once as an arrow
   (`greetArrow`).
2. **Warm-up 2 — `square`.** `square(5)` → `25`. Same three syntaxes:
   `squareDeclaration`, `squareExpression`, `squareArrow`.
3. **Warm-up 3 — `sumArray`.** `sumArray([1, 2, 3, 4])` → `10`; an empty
   array returns `0`. This one needs a loop with a running total —
   Session 8 control flow again. Same three syntaxes.
4. **Warm-up 4 — `celsiusToFahrenheit`.** `(celsius * 9 / 5) + 32`:
   `0` → `32`, `100` → `212`, `-40` → `-40`. Same three syntaxes.
5. **Run the tests.** A silent console means every assertion passed.

The three versions of each warm-up must be *the same function written three
ways* — the point is comparing syntaxes, not writing three different
algorithms. The name suffix (Declaration / Expression / Arrow) only exists
so the three versions can live in one file without colliding.

### 3.4 How to run the tests

**Browser (recommended).** Create a throwaway `runner.html` in the same
folder as your starter file, containing exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JS Practice Runner</title>
</head>
<body>
  <script src="starter_functions.js"></script>
</body>
</html>
```

Open `runner.html`, press `F12` (dev tools) and click **Console**. A
silent console means all assertions passed; red "Assertion failed" lines
name the body that still needs work. This tiny file is also a preview of
the `<script>` tag you'll add to your own page in Part 2.

**Node (optional).** If you have Node installed you can instead run
`node starter_functions.js` in the same folder.

### 3.5 Part 1 deliverable

- `starter_functions.js` with all twelve bodies completed (4 warm-ups × 3
  syntaxes), signature-compatible with the shipped file.
- A console with **zero** "Assertion failed" messages.
- Both partners can explain, out loud, the difference between a function
  declaration, a function expression, and an arrow function.

---

## 4. Part 2 — Apply it to your own Session 3 page

Open the `index.html` your pair built in the Session 3 lab and styled in
Session 6. This lab adds the third layer: behavior. Your page's HTML and
CSS stay exactly as they are — the only change is one `<script>` tag.

### 4.1 What to do

1. In the **same repo** as your Session 3 `index.html` (and your Session 6
   `styles.css`), create a new file `exercises.js`.
2. Implement the four exercise functions below, with the bodies written
   from scratch.
3. Add **exactly one line** to `index.html` — a `<script>` tag loading
   your new file:

   ```html
   <script src="exercises.js" defer></script>
   ```

   Put it in the `<head>` or just before `</body>`. This is the **only**
   HTML change allowed in this lab.
4. Open the page, press `F12`, and look at the **Console**. Your functions
   are now running on your own page.
5. **Adapt at least one function to your own content.** Pull a real array
   out of your Session 3 page — ticket prices, follower counts, match
   scores, post lengths, squad numbers, cook times, whatever your topic
   has — and run `findMax` (or one of the others) on it. Type the values
   into an array literal by hand; don't try to read them from the page —
   that's Session 10. The output should mean something for your page, not
   just for a made-up array.

### 4.2 The four functions (signatures only — you write the bodies)

```javascript
// FizzBuzz — print 1..n. Multiples of 3 become "Fizz",
// multiples of 5 become "Buzz", multiples of both become "FizzBuzz".
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    // your logic here
  }
}

// findMax — return the largest value in the array. No Math.max:
// a plain loop only. Return undefined for an empty array
// (be ready to explain that decision).
function findMax(numbers) {
  // your logic here
}

// isPalindrome — return true if str reads the same backwards,
// ignoring case, spaces, and punctuation.
function isPalindrome(str) {
  // your logic here
}

// Refactor at least ONE of the three functions above into an arrow
// function — same behavior, different syntax (e.g. isPalindromeArrow).
```

### 4.3 Verifying your work

Copy this test block into `exercises.js`, below your functions:

```javascript
// FizzBuzz prints, so verify by eye: fizzBuzz(15) must produce
// 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
fizzBuzz(15);

console.assert(findMax([3, 7, 2, 9, 1]) === 9, "findMax basic");
console.assert(findMax([-5, -2, -9]) === -2, "findMax negatives");
console.assert(findMax([]) === undefined, "findMax empty");

console.assert(isPalindrome("racecar") === true, "isPalindrome basic");
console.assert(isPalindrome("A man, a plan, a canal: Panama") === true, "isPalindrome punctuation");
console.assert(isPalindrome("hello") === false, "isPalindrome false case");
```

`console.assert` prints nothing when a check passes and an "Assertion
failed" message when it doesn't — so a correct `exercises.js` shows only
the `fizzBuzz(15)` output, nothing else.

### 4.4 Login form validation — the bridge to Block II

Your Session 3 site has a **login page** with an email field and a password
field. You can't read those fields from JavaScript yet — that's the DOM, in
Session 10 — but you *can* write and test the **validation logic** a real login
needs. These are pure functions: strings in, `true`/`false` (or a small result
object) out. No page, no DOM.

Implement three validators in `exercises.js`:

```javascript
// validateEmail — a basic shape check: no spaces, one "@" with text before it,
// and a "." after the "@" with text on both sides. Return true/false.
function validateEmail(email) {
  // your logic here
}

// validatePassword — at least 8 characters, containing at least one letter
// AND at least one digit. Return true/false.
function validatePassword(password) {
  // your logic here
}

// validateLoginForm — combine the two. Return an object:
//   { valid: true,  errors: [] }                       when both pass, or
//   { valid: false, errors: ["...", "..."] }           listing what failed.
function validateLoginForm(email, password) {
  // your logic here
}
```

Load `exercises.js` from your **login page** too (the same one-line
`<script src="exercises.js" defer></script>` tag), so opening the login page and
pressing F12 runs these checks in the console. Verify with:

```javascript
console.assert(validateEmail("fan@riverside.fc") === true, "email valid");
console.assert(validateEmail("fan@riversidefc") === false, "email needs a dot");
console.assert(validateEmail("fanriverside.fc") === false, "email needs an @");

console.assert(validatePassword("Season2026") === true, "password ok");
console.assert(validatePassword("short1") === false, "password too short");
console.assert(validatePassword("allletters") === false, "password needs a digit");

console.assert(validateLoginForm("fan@riverside.fc", "Season2026").valid === true, "form valid");
console.assert(validateLoginForm("nope", "x").errors.length === 2, "form reports both errors");
```

> **Why this matters:** in Block II you build real authentication. The server has
> the final say on whether a login is valid, but checking the obvious things in
> the browser first — a well-formed email, a long-enough password — is exactly
> this code. You are writing the front-end half of auth now; Block II adds the
> server, and Sessions 10–11 add the wiring that reads these values off the form.

### 4.5 Part 2 deliverable

- `exercises.js` in the same repo as your `index.html`, linked from it (and from
  your `login.html`) with a `<script src="exercises.js" defer></script>` tag.
- The three exercise functions **and** the three login validators implemented,
  with every test block above green (zero assertion failures).
- At least one function run in the console with real data from your own page.
- Both partners can point to any line of `exercises.js` and explain what it does —
  the Session 3 pairing rule still applies.

---

## 5. Self-check before submitting

**Part 1 (starter file):**
- [ ] All four warm-ups complete in all three syntaxes (12 functions)
- [ ] `greet` uses a default parameter (`name = "friend"`)
- [ ] No function names or signatures changed
- [ ] Console shows zero "Assertion failed" messages
- [ ] Every warm-up *returns* its value — none of them just `console.log`s
- [ ] Both partners can explain declaration vs expression vs arrow

**Part 2 (your own site):**
- [ ] `exercises.js` contains `fizzBuzz`, `findMax`, `isPalindrome` + at
      least one arrow refactor
- [ ] `findMax` uses a loop — no `Math.max`
- [ ] `isPalindrome` ignores case, spaces, and punctuation
- [ ] `validateEmail`, `validatePassword`, and `validateLoginForm` implemented
      as pure functions (no DOM)
- [ ] `validateLoginForm` returns `{ valid, errors }` with a message per failure
- [ ] `index.html` changed by exactly one line: the `<script>` tag; `login.html`
      loads the same script
- [ ] Every test block runs with zero assertion failures
- [ ] At least one function run on data from your own page
- [ ] Both partners can explain every line of `exercises.js`

---

## 6. Why two parts

Styling your own page in Session 6 worked because Part 1 isolated the CSS
skill on a page you didn't have to design. The same logic applies here:
writing FizzBuzz on a shared starter file separates "did I get functions
wrong" from "is my Session 3 page oddly structured." Part 2 is where you
prove you can transfer the skill to your own codebase — which is exactly
what Practice 1 will ask of you in Block II, on a codebase you didn't fully
choose either.

---

## 7. Reference

- GeeksforGeeks — *Functions in JavaScript*:
  <https://www.geeksforgeeks.org/javascript/functions-in-javascript/>
