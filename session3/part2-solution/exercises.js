/*
  exercises.js — Session 9 Lab, Part 2 (REFERENCE SOLUTION)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in Session 3 and styles.css in
  Session 6: it shows the expected shape and depth of a passing Part 2.
  Your pair must write your own logic — and be able to explain every line.

  This lab is console-only: the functions print to the console; they do
  NOT touch the DOM (no window/document). Reading values off the page is
  Session 10's job, so the "real data" arrays below are typed by hand.

  Run with: node exercises.js   (or open index.html and press F12)
  Expected output: the fizzBuzz(15) sequence plus the labelled real-data
  lines, and NO "Assertion failed" messages.
*/

// ---- The four exercise functions (§4.2) ----

// FizzBuzz: prints 1..n. Multiples of 3 become "Fizz", multiples of 5
// become "Buzz", multiples of both become "FizzBuzz". Checking % 15 first
// covers the "both" case before the two single cases.
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

// Arrow refactor of isPalindrome — same behavior, arrow syntax.
const isPalindromeArrow = (str) => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
};

// ---- Tests (the exact §4.3 block) ----

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

// ---- Running the functions on REAL data from the Riverside FC page ----

// Goals Riverside scored in their three listed fixtures + recent wins.
// (Match scores are on the page: the 2-1 win over Ashford Town, etc.)
const goalsScored = [2, 1, 2, 3, 1];
console.log("Most goals in a match this run:", findMax(goalsScored));

// Squad shirt numbers from the "First Team Squad" list (4 players => 1..4).
const squadNumbers = [1, 2, 3, 4];
console.log("Highest squad number on the page:", findMax(squadNumbers));

// The club name reads differently backwards, so it is not a palindrome...
console.log('Is "Riverside FC" a palindrome?', isPalindrome("Riverside FC"));
// ...but a level scoreline chant reads the same both ways ("1 00 1").
console.log('Is the "1 00 1" scoreline chant a palindrome?', isPalindromeArrow("1 00 1"));
