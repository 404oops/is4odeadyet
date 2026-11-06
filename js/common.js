// Date helpers shared by the page scripts. PAGE.lang is the page's date locale.
const utcMs = iso => Date.parse(iso + "T00:00:00Z");
const todayIso = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso, opts) => new Date(utcMs(iso)).toLocaleDateString(PAGE.lang, { timeZone: "UTC", ...opts });
