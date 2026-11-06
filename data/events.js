// Timeline events. The wording for each id lives in locales/<lang>.js under timeline.events.

// The final GPT-4o snapshots (gpt-4o-2024-08-06, gpt-4o-2024-11-20, gpt-4o-mini) leave the API on this day.
// Source: OpenAI deprecations page, notice dated 2026-10-14. No time of day is given, so we use 00:00 UTC.
const SHUTDOWN = "2027-01-14";

// The day 4o left ChatGPT. The countdown grid starts here.
const CHATGPT_REMOVAL = "2026-02-13";

// [id, date, tag, [source keys]]
// Tags: launch, scandal, lawsuit, data, decline, shutdown (a 4o snapshot pulled from the API), end
const EVENTS = [
  ["launch", "2024-05-13", "launch", ["wiki4o", "wcRushed", "smvlc"]],
  ["sky", "2024-05-20", "scandal", ["axiosSky"]],
  ["ghibli", "2025-03-25", "scandal", ["designboomGhibli"]],
  ["syco", "2025-04-25", "scandal", ["syco", "tcSyco"]],
  ["sycoRollback", "2025-04-28", "scandal", ["syco"]],
  ["gpt5", "2025-08-07", "decline", ["vbPull"]],
  ["comeback", "2025-08-08", "decline", ["trBack"]],
  ["raine", "2025-08-26", "lawsuit", ["raine", "nbcRaine"]],
  ["previews1", "2025-10-10", "shutdown", ["deprec"]],
  ["crisisNumbers", "2025-10-27", "data", ["stats"]],
  ["sevenSuits", "2025-11-06", "lawsuit", ["smvlc", "tcSeven"]],
  ["latestNotice", "2025-11-18", "decline", ["deprec", "vbApi"]],
  ["adams", "2025-12-11", "lawsuit", ["sfsAdams", "ajAdams"]],
  ["gordon", "2026-01-12", "lawsuit", ["cbsGordon", "futurismGordon"]],
  ["retireAnnounced", "2026-01-29", "decline", ["wiki4o"]],
  ["tumblerRidge", "2026-02-10", "scandal", ["wikiTumbler", "globalTumbler"]],
  ["wsj", "2026-02-12", "scandal", ["wsj4o", "decoder4o"]],
  ["chatgptRemoval", CHATGPT_REMOVAL, "decline", ["wiki4o"]],
  ["latestPulled", "2026-02-17", "shutdown", ["deprec"]],
  ["tumblerSuits", "2026-04-29", "lawsuit", ["nprTumbler", "opbTumbler"]],
  ["previews2", "2026-05-07", "shutdown", ["deprec"]],
  ["carrier", "2026-06-11", "lawsuit", ["cbsCarrier", "cbcCarrier"]],
  ["madison", "2026-06-15", "lawsuit", ["abcMadison", "wvtmMadison"]],
  ["search", "2026-07-23", "shutdown", ["deprec"]],
  ["finalNotice", "2026-10-14", "decline", ["deprec"]],
  ["gates", "2026-10-14", "lawsuit", ["yahooGates", "newserGates"]],
  ["launchSnapshot", "2026-10-23", "shutdown", ["deprec"]],
  ["wan", "2026-10-27", "lawsuit", ["tcWan", "kiroWan"]],
  ["final", SHUTDOWN, "end", ["deprec"]],
  ["audio", "2027-01-20", "end", ["deprec"]],
  ["transcribe", "2027-02-26", "end", ["deprec"]],
];

module.exports = { SHUTDOWN, CHATGPT_REMOVAL, EVENTS };
