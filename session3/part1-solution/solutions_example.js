/*
  Reference solutions for Session 9 Lab — Logic & Functions
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own logic — and be able to explain every line of it.

  Run with: node solutions_example.js   (or paste into the browser console)
  Expected output: only the FizzBuzz sequence, no "Assertion failed" lines.
*/

// ---- Part 1 warm-ups (completed) ----

// greet — three syntaxes, one behavior
function greetDeclaration(name = "friend") {
  return `Hello, ${name}!`;
}

const greetExpression = function (name = "friend") {
  return `Hello, ${name}!`;
};

const greetArrow = (name = "friend") => {
  return `Hello, ${name}!`;
};

// square
function squareDeclaration(n) {
  return n * n;
}

const squareExpression = function (n) {
  return n * n;
};

const squareArrow = (n) => {
  return n * n;
};

// sumArray — note the loop style differs per version on purpose:
// the same result can be written several ways.
function sumArrayDeclaration(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

const sumArrayExpression = function (numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
};

const sumArrayArrow = (numbers) => {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
};

// celsiusToFahrenheit
function celsiusToFahrenheitDeclaration(celsius) {
  return (celsius * 9) / 5 + 32;
}

const celsiusToFahrenheitExpression = function (celsius) {
  return (celsius * 9) / 5 + 32;
};

const celsiusToFahrenheitArrow = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

// ---- Part 2 — the four exercise functions ----

// FizzBuzz: prints 1..n, "Fizz" for multiples of 3, "Buzz" for multiples
// of 5, "FizzBuzz" for multiples of both. Checking % 15 first covers the
// "both" case before the two single cases.
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

// findMax: largest value in the array, no Math.max — a plain loop only.
// Returns undefined for an empty array: a deliberate decision you should
// be able to justify out loud (there is no largest value of nothing).
function findMax(numbers) {
  if (numbers.length === 0) {
    return undefined;
  }
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

// isPalindrome: true if the string reads the same backwards. Normalize
// first — lowercase, keep only letters and digits (drops spaces and
// punctuation) — then compare with the reversed version.
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// The arrow refactor — the brief asks you to convert at least one of the
// three functions above into an arrow function. Example:
const isPalindromeArrow = (str) => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
};

// ---- Tests (the same block students copy into exercises.js) ----

// Warm-up verification (Part 1)
console.assert(greetDeclaration() === "Hello, friend!", "greet declaration default");
console.assert(greetArrow("Ana") === "Hello, Ana!", "greet arrow arg");
console.assert(squareExpression(-3) === 9, "square expression");
console.assert(sumArrayDeclaration([1, 2, 3, 4]) === 10, "sumArray declaration");
console.assert(sumArrayArrow([]) === 0, "sumArray arrow empty");
console.assert(celsiusToFahrenheitExpression(100) === 212, "celsius expression");

// FizzBuzz prints, so verify by eye: fizzBuzz(15) must produce
// 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
fizzBuzz(15);

console.assert(findMax([3, 7, 2, 9, 1]) === 9, "findMax basic");
console.assert(findMax([-5, -2, -9]) === -2, "findMax negatives");
console.assert(findMax([]) === undefined, "findMax empty");

console.assert(isPalindrome("racecar") === true, "isPalindrome basic");
console.assert(isPalindrome("A man, a plan, a canal: Panama") === true, "isPalindrome punctuation");
console.assert(isPalindrome("hello") === false, "isPalindrome false case");

// arrow refactor behaves identically
console.assert(isPalindromeArrow("level") === true, "isPalindromeArrow");
