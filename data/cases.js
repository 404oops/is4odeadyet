// Lawsuits on the cases page, in display order. The wording for each id lives in locales/<lang>.js under cases.items.
// section: murder | suicide | related
const CASES = [
  { id: "tumbler-ridge", section: "murder", src: ["wikiTumbler", "nprTumbler", "opbTumbler", "cbcTumbler", "globalTumbler", "cbcAccount", "mjTumbler", "nbcTumbler"] },
  { id: "adams", section: "murder", src: ["sfsAdams", "engadgetAdams", "gfpAdams", "wikiAdams", "hbSoelberg"] },
  { id: "raine", section: "suicide", src: ["raine", "abcRaine", "nbcRaine"] },
  { id: "lacey", section: "suicide", src: ["smvlc", "tcSeven"] },
  { id: "shamblin", section: "suicide", src: ["cnnShamblin", "smvlc"] },
  { id: "enneking", section: "suicide", src: ["sfsEnneking", "smvlc"] },
  { id: "ceccanti", section: "suicide", src: ["foxComplaint", "smvlc", "chtSeven"] },
  { id: "gordon", section: "suicide", src: ["cbsGordon", "futurismGordon"] },
  { id: "carrier", section: "suicide", src: ["cbsCarrier", "cbcCarrier", "ajCarrier"] },
  { id: "madison", section: "suicide", src: ["yahooMadison", "abcMadison", "wvtmMadison"] },
  { id: "gates", section: "related", src: ["yahooGates", "newserGates"] },
  { id: "wan", section: "related", src: ["tcWan", "kiroWan", "complaintWan", "lcWan"] },
];

// Every death counted on the kill count page, in date order. 18 in total.
// who: a public name, or a key into kill.who in the locale for people not named here.
// date: YYYY-MM-DD, or YYYY-MM when only the month is reported.
// place and how are keys into kill.places and kill.how in the locale.
const DEATHS = [
  { case: "raine", name: "Adam Raine", age: 16, place: "california", date: "2025-04-11", how: "suicide" },
  { case: "lacey", name: "Amaurie Lacey", age: 17, place: "georgia", date: "2025-06", how: "suicide" },
  { case: "madison", name: "Christian Faith Madison", age: 29, place: "alabama", date: "2025-06", how: "suicide" },
  { case: "shamblin", name: "Zane Shamblin", age: 23, place: "texas", date: "2025-07", how: "suicide" },
  { case: "carrier", name: "Alice Carrier", age: 24, place: "montreal", date: "2025-07", how: "suicide" },
  { case: "adams", name: "Suzanne Adams", age: 83, place: "greenwich", date: "2025-08", how: "killedBySon" },
  { case: "adams", name: "Stein-Erik Soelberg", age: 56, place: "greenwich", date: "2025-08", how: "murderSuicide" },
  { case: "enneking", name: "Joshua Enneking", age: 26, place: "florida", date: "2025-08", how: "suicide" },
  { case: "ceccanti", name: "Joe Ceccanti", age: 48, place: "oregon", date: "2025-08-07", how: "suicide" },
  { case: "gordon", name: "Austin Gordon", age: 40, place: "colorado", date: "2025-11-02", how: "suicide" },
  { case: "tumbler-ridge", name: "Jennifer Strang", age: 39, place: "tumbler", date: "2026-02-10", how: "shootingHome" },
  { case: "tumbler-ridge", who: "brother", age: 11, place: "tumbler", date: "2026-02-10", how: "shootingHome" },
  { case: "tumbler-ridge", who: "student", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
  { case: "tumbler-ridge", who: "student", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
  { case: "tumbler-ridge", who: "student", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
  { case: "tumbler-ridge", who: "student", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
  { case: "tumbler-ridge", who: "student", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
  { case: "tumbler-ridge", who: "teacher", place: "tumbler", date: "2026-02-10", how: "shootingSchool" },
];

module.exports = { CASES, DEATHS };
