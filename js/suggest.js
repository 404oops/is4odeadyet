// Offers a one-line link to the visitor's own language when the site has it. No automatic redirect.
// SUGGEST lists every locale: { match: [browser language prefixes], href, label, lang, current }.
(function () {
  const prefs = (navigator.languages || [navigator.language || ""]).map(l => l.toLowerCase());
  // Longest match wins, so zh-TW picks Traditional over the generic zh -> Simplified.
  const localeFor = pref => {
    let best = null, bestLen = 0;
    for (const o of SUGGEST) for (const m of o.match) {
      if ((pref === m || pref.startsWith(m + "-")) && m.length > bestLen) { best = o; bestLen = m.length; }
    }
    return best;
  };
  for (const pref of prefs) {
    const hit = localeFor(pref);
    if (!hit) continue;           // a language the site doesn't have: try the next preference
    if (hit.current) return;      // already reading in the preferred language
    const box = document.getElementById("suggest");
    box.innerHTML = `<a href="${hit.href}" hreflang="${hit.lang}" lang="${hit.lang}">${hit.label}</a>`;
    box.hidden = false;
    return;
  }
})();
