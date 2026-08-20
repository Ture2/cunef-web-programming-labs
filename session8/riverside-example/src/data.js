// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  data.js — Riverside FC example (Session 32 · Static React Components)

  Hard-coded domain data drawn from the Block I football-club example.
  In Session 9 this is replaced by live fetch calls to the Block II API.
*/

export const FIXTURES = [
  { id: 1, opponent: "Millbrook United",  match_date: "2026-09-12", venue: "Home", kickoff: "15:00" },
  { id: 2, opponent: "Oakfield Rovers",   match_date: "2026-09-19", venue: "Away", kickoff: "15:00" },
  { id: 3, opponent: "Crestwood City",    match_date: "2026-09-26", venue: "Home", kickoff: "14:30" },
  { id: 4, opponent: "Hartwell FC",       match_date: "2026-10-03", venue: "Away", kickoff: "15:00" },
  { id: 5, opponent: "Stonefield Ath",    match_date: "2026-10-10", venue: "Home", kickoff: "15:00" },
];

export const SQUAD = [
  { id: 1,  number: 1,  name: "Elena Ruiz",    position: "Goalkeeper" },
  { id: 2,  number: 13, name: "Priya Nandal",  position: "Goalkeeper" },
  { id: 3,  number: 2,  name: "Marcus Webb",   position: "Defender" },
  { id: 4,  number: 4,  name: "Lena Fischer",  position: "Defender" },
  { id: 5,  number: 5,  name: "Diego Alvarez", position: "Defender" },
  { id: 6,  number: 8,  name: "Aisha Kone",    position: "Midfielder" },
  { id: 7,  number: 10, name: "Sofia Marsh",   position: "Midfielder" },
  { id: 8,  number: 9,  name: "Tomás Ibarra",  position: "Forward" },
  { id: 9,  number: 11, name: "Noah Bennett",  position: "Forward" },
];
