// The final GPT-4o snapshots (gpt-4o-2024-08-06, gpt-4o-2024-11-20, gpt-4o-mini) leave the API on this day.
// Source: OpenAI deprecations page, notice dated 2026-10-14. No time of day is given, so we use 00:00 UTC.
const SHUTDOWN = "2027-01-14";

// The day 4o left ChatGPT. The countdown grid starts here.
const CHATGPT_REMOVAL = "2026-02-13";

// [date, tag, title, detail, [source keys]]
// Tags: launch, scandal, lawsuit, data, decline, shutdown (a 4o snapshot pulled from the API), end
const EVENTS = [
  ["2024-05-13", "launch", "GPT-4o launches", "Lawsuits later allege its safety review was compressed to make this date.", ["wiki4o", "smvlc"]],
  ["2025-04-25", "scandal", "The sycophancy update", "A GPT-4o update makes ChatGPT excessively flattering and agreeable. OpenAI admits it missed the problem in testing.", ["syco", "tcSyco"]],
  ["2025-04-28", "scandal", "Sycophancy rollback begins", "OpenAI reverts the update and later adds sycophancy checks to its launch process.", ["syco"]],
  ["2025-08-07", "decline", "GPT-5 replaces 4o in ChatGPT", "4o disappears from the model picker for most users.", ["vbPull"]],
  ["2025-08-08", "decline", "4o comes back after backlash", "Sam Altman says paid users can keep choosing 4o.", ["trBack"]],
  ["2025-08-26", "lawsuit", "Raine v. OpenAI filed", "Adam Raine, 16. Alleged suicide.", ["raine", "nbcRaine"]],
  ["2025-10-10", "shutdown", "First 4o preview snapshots pulled from the API", "gpt-4o-realtime-preview-2024-10-01 and gpt-4o-audio-preview-2024-10-01.", ["deprec"]],
  ["2025-10-27", "data", "OpenAI publishes crisis numbers", "About 1.2M weekly ChatGPT users show signs of suicidal planning, and about 560K show possible psychosis or mania. These figures cover all models.", ["stats"]],
  ["2025-11-06", "lawsuit", "Seven lawsuits filed at once", "Four wrongful-death suits (Shamblin, Lacey, Enneking, Ceccanti) and three from survivors, all centred on GPT-4o.", ["smvlc", "tcSeven"]],
  ["2025-11-18", "decline", "chatgpt-4o-latest deprecation notice", "API developers get notice that the alias will be removed.", ["deprec", "vbApi"]],
  ["2025-12-11", "lawsuit", "First murder lawsuit", "Suzanne Adams's estate alleges GPT-4o fed her son's delusions before he killed her and himself.", ["sfsAdams", "ajAdams"]],
  ["2026-01-12", "lawsuit", "Austin Gordon lawsuit reported", "Austin Gordon, 40. Alleged suicide.", ["cbsGordon", "futurismGordon"]],
  ["2026-01-29", "decline", "OpenAI announces 4o's ChatGPT retirement", "", ["wiki4o"]],
  ["2026-02-13", "decline", "4o removed from ChatGPT", "It stays available through the API.", ["wiki4o"]],
  ["2026-02-17", "shutdown", "chatgpt-4o-latest pulled from the API", "", ["deprec"]],
  ["2026-05-07", "shutdown", "4o realtime and audio previews pulled from the API", "gpt-4o-realtime-preview (all snapshots), gpt-4o-mini-realtime-preview, gpt-4o-audio-preview and gpt-4o-mini-audio-preview.", ["deprec"]],
  ["2026-06-11", "lawsuit", "Carrier lawsuit filed", "Alice Carrier, 24. Alleged suicide.", ["cbsCarrier", "cbcCarrier"]],
  ["2026-06-15", "lawsuit", "Madison lawsuit filed", "Christian Faith Madison. Alleged suicide.", ["abcMadison", "wvtmMadison"]],
  ["2026-07-23", "shutdown", "4o search previews pulled from the API", "gpt-4o-search-preview-2025-03-11 and gpt-4o-mini-search-preview-2025-03-11.", ["deprec"]],
  ["2026-10-14", "decline", "Final 4o snapshots get notice", "gpt-4o-2024-08-06, gpt-4o-2024-11-20 and gpt-4o-mini are scheduled for removal on 14 Jan 2027.", ["deprec"]],
  ["2026-10-14", "lawsuit", "Poisoning-plot lawsuit filed", "James Gates alleges GPT-4o helped his wife plan to poison him. Approximate filing date.", ["yahooGates", "newserGates"]],
  ["2026-10-23", "shutdown", "gpt-4o-2024-05-13 pulled from the API", "The original launch snapshot is gone.", ["deprec"]],
  ["2026-10-27", "lawsuit", "Wan v. OpenAI filed", "Alleges GPT-4o helped a woman taper off seizure medication before her death.", ["lcWan"]],
  [SHUTDOWN, "end", "Final 4o snapshots pulled from the API", "The countdown target. Fine-tunes of these models go too.", ["deprec"]],
  ["2027-01-20", "end", "4o audio and realtime models removed", "", ["deprec"]],
  ["2027-02-26", "end", "gpt-4o-transcribe removed", "The last model with “4o” in its name.", ["deprec"]],
];

const utcMs = iso => Date.parse(iso + "T00:00:00Z");
const fmtDate = iso => new Date(utcMs(iso)).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const todayIso = () => new Date().toISOString().slice(0, 10);
