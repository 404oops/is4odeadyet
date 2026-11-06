// Builds the static site into dist/: one copy of every page per language.
// English lives at the root, other languages under /<dir>/ (e.g. /ja/).
// Usage: node build.js   (no dependencies)
const fs = require("fs");
const path = require("path");

const SOURCES = require("./data/sources.js");
const { SHUTDOWN, CHATGPT_REMOVAL, EVENTS } = require("./data/events.js");
const { CASES, DEATHS } = require("./data/cases.js");

const OUT = path.join(__dirname, "dist");

// Display order of languages. A locale is built only if its file exists.
const LOCALE_FILES = ["en", "ja", "zh-hans", "zh-hant", "ko", "es", "pt-br", "fr", "de"];
const LOCALES = LOCALE_FILES
  .filter(code => fs.existsSync(path.join(__dirname, "locales", code + ".js")))
  .map(code => ({ code, ...require("./locales/" + code + ".js") }));

// Bodoni Moda has no CJK glyphs, so those languages also load a matching Noto Serif.
const CJK_FONTS = { ja: "Noto Serif JP", "zh-hans": "Noto Serif SC", "zh-hant": "Noto Serif TC", ko: "Noto Serif KR" };

// Which browser languages should be offered which locale (first match wins).
const BROWSER_MATCH = {
  ja: ["ja"], "zh-hant": ["zh-tw", "zh-hk", "zh-mo", "zh-hant"], "zh-hans": ["zh"], ko: ["ko"],
  es: ["es"], "pt-br": ["pt"], fr: ["fr"], de: ["de"], en: ["en"],
};

// Short Latin names used in "See:" links on the homepage.
const CASE_SHORT = {
  "tumbler-ridge": "Tumbler Ridge", adams: "Adams", raine: "Raine", lacey: "Lacey", shamblin: "Shamblin",
  enneking: "Enneking", ceccanti: "Ceccanti", gordon: "Gordon", carrier: "Carrier", madison: "Madison",
};

// Order of the "Why it matters" points, and what each one cites.
const WHY = [
  ["flattery", { src: ["syco", "tcSyco"] }],
  ["delusions", { see: ["adams", "madison", "ceccanti"] }],
  ["methods", { see: ["raine", "lacey", "enneking", "carrier", "tumbler-ridge"] }],
  ["voice", { see: ["shamblin", "ceccanti", "gordon"] }],
  ["reach", { src: ["stats"] }],
  ["notGone", { src: ["deprec"] }],
];

const PAGES = { index: "index.html", timeline: "timeline.html", cases: "cases.html", kill: "kill-count.html" };

// ---------- helpers ----------

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const utc = iso => new Date(iso.length === 7 ? iso + "-01T00:00:00Z" : iso + "T00:00:00Z");

function fmt(L, iso, opts) {
  return new Intl.DateTimeFormat(L.dateLocale, { timeZone: "UTC", ...opts }).format(utc(iso));
}
const fmtDay = (L, iso) => fmt(L, iso, { day: "numeric", month: "short" });
const fmtFull = (L, iso) => iso.length === 7
  ? fmt(L, iso, { month: "short", year: "numeric" })
  : fmt(L, iso, { day: "numeric", month: "short", year: "numeric" });

const sourceLinks = keys => keys.map(k => {
  if (!SOURCES[k]) throw new Error("Unknown source: " + k);
  return `<a href="${esc(SOURCES[k][1])}" target="_blank" rel="noopener">${esc(SOURCES[k][0])}</a>`;
}).join(", ");

// Relative URL from a page in locale `from` to a page in locale `to`.
function href(from, to, page, hash = "") {
  const up = from.dir ? "../" : "";
  const into = to.dir ? to.dir + "/" : "";
  return up + into + PAGES[page] + hash;
}

// Visual width of the hero answer in ems, so long or CJK answers still fit the screen.
function answerWidth(word) {
  let w = 0;
  for (const ch of word) w += /[　-鿿가-힯]/.test(ch) ? 1 : 0.75;
  return Math.max(2, w).toFixed(2);
}

// ---------- layout ----------

function layout(L, page, { title, description, body, scripts = "", extraFonts = "" }) {
  const root = L.dir ? "../" : "";
  const fonts = ["family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900"];
  if (CJK_FONTS[L.code]) fonts.push("family=" + CJK_FONTS[L.code].replace(/ /g, "+") + ":wght@400;700;900");
  if (extraFonts) fonts.push(extraFonts);
  const alternates = LOCALES.map(o =>
    `<link rel="alternate" hreflang="${o.htmlLang}" href="${href(L, o, page)}">`).join("\n");
  const navItem = (p, label) =>
    `<a href="${href(L, L, p)}"${p === page ? ' aria-current="page"' : ""}>${label}</a>`;
  const langLinks = LOCALES.map(o => o.code === L.code
    ? `<span aria-current="true">${o.name}</span>`
    : `<a href="${href(L, o, page)}" hreflang="${o.htmlLang}" lang="${o.htmlLang}">${o.name}</a>`).join(" · ");
  // Offered to visitors whose browser prefers another available language.
  const suggest = LOCALES.map(o => ({
    match: BROWSER_MATCH[o.code], href: href(L, o, page), label: o.suggest, lang: o.htmlLang, current: o.code === L.code,
  }));

  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${href(L, LOCALES[0], page)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap">
<link rel="stylesheet" href="${root}css/style.css">
</head>
<body>
${body.hero || ""}
<p class="suggest" id="suggest" hidden></p>
<nav>
  ${navItem("index", L.nav.countdown)}
  ${navItem("timeline", L.nav.timeline)}
  ${navItem("cases", L.nav.cases)}
  ${navItem("kill", L.nav.kill)}
</nav>

<main>
${body.main}
</main>

<footer>
  <p>${fill(L.footer.madeBy, { link: '<a href="https://404oops.com">404oops</a>' })}</p>
  <p class="langs">${langLinks}</p>
</footer>

<script>const SUGGEST = ${JSON.stringify(suggest)};</script>
<script src="${root}js/suggest.js"></script>
${scripts}
</body>
</html>
`;
}

const helpline = L => fill(L.helpline, { link: '<a href="https://findahelpline.com">findahelpline.com</a>' });

// ---------- pages ----------

function indexPage(L) {
  const root = L.dir ? "../" : "";
  const u = L.hero.units;
  const hero = `<section class="hero">
  <p class="answer" id="answer" style="--len: ${answerWidth(L.answer.no)}">${esc(L.answer.no)}</p>
  <div class="below">
    <div class="under">
      <div class="count" aria-label="${esc(L.nav.countdown)}">
        <div><b id="w">0</b><span>${u.weeks}</span></div>
        <div><b id="d">0</b><span>${u.days}</span></div>
        <div><b id="h">0</b><span>${u.hours}</span></div>
        <div><b id="m">0</b><span>${u.minutes}</span></div>
        <div><b id="s">0</b><span>${u.seconds}</span></div>
      </div>
      <p class="center note">${L.hero.until}</p>
    </div>
    <p class="status" id="status">${L.hero.alive}</p>
  </div>
</section>`;

  const points = WHY.map(([key, ref]) => {
    const pt = L.why.points[key];
    const cite = ref.src
      ? `${ref.src.length > 1 ? L.labels.sources : L.labels.source} ${sourceLinks(ref.src)}`
      : `${L.labels.see} ${ref.see.map(id => `<a href="${href(L, L, "cases", "#" + id)}">${CASE_SHORT[id]}</a>`).join(", ")}`;
    return `    <li>
      <h3>${pt.h}</h3>
      <p>${pt.p}</p>
      <p class="src">${cite}</p>
    </li>`;
  }).join("\n");

  const main = `  <h1>${L.why.h1}</h1>
  <p class="lede">${L.why.lede}</p>
  <ol class="dangers">
${points}
  </ol>
  <p class="note">${L.allegations} ${helpline(L)}</p>

  <h2>${fill(L.grid.heading, { n: '<span id="days-left">0</span>' })}</h2>
  <p class="note">${L.grid.note}</p>
  <div class="months" id="daygrid"></div>
  <div class="legend">
    <span><i></i>${L.grid.legend.left}</span>
    <span><i class="ev"></i>${L.grid.legend.ev}</span>
    <span><i class="pulled"></i>${L.grid.legend.pulled}</span>
    <span><i class="end"></i>${L.grid.legend.end}</span>
  </div>`;

  const config = {
    lang: L.dateLocale, shutdown: SHUTDOWN, start: CHATGPT_REMOVAL,
    answer: L.answer, answerLen: { no: answerWidth(L.answer.no), yes: answerWidth(L.answer.yes) },
    status: { alive: L.hero.alive, dead: L.hero.dead }, daysLeft: L.grid.daysLeft,
    events: EVENTS.map(([id, date, tag]) => [date, tag, L.timeline.events[id].t]),
  };
  const scripts = `<script>const PAGE = ${JSON.stringify(config)};</script>
<script src="${root}js/common.js"></script>
<script src="${root}js/countdown.js"></script>
<script src="${root}js/daygrid.js"></script>`;

  return layout(L, "index", {
    title: L.meta.indexTitle, description: L.meta.indexDescription,
    body: { hero, main }, scripts,
    // Pinyon Script is only used for the post-shutdown YES in Latin-script languages.
    extraFonts: CJK_FONTS[L.code] ? "" : "family=Pinyon+Script",
  });
}

function timelinePage(L) {
  const root = L.dir ? "../" : "";
  const T = L.timeline;
  let year = null;
  const rows = [];
  for (const [id, date, tag, src] of EVENTS) {
    const y = date.slice(0, 4);
    if (y !== year) { rows.push(`  <li class="tl-year"><span>${y}</span></li>`); year = y; }
    const e = T.events[id];
    rows.push(`  <li class="tl-item tag-${tag}" data-date="${date}">
    <time datetime="${date}">${fmtDay(L, date)}</time>
    <div class="tl-card">
      <span class="tag">${T.tags[tag]}</span>
      <h3>${e.t}</h3>
      ${e.d ? `<p>${e.d}</p>` : ""}
      <p class="src">${sourceLinks(src)}</p>
    </div>
  </li>`);
  }
  const main = `  <h1>${T.h1}</h1>
  <p class="note">${fill(T.note, { link: `<a href="${href(L, L, "cases")}">${L.nav.cases}</a>` })}</p>
  <div class="tl-legend">
    <span class="tag-lawsuit"><i></i>${T.legend.lawsuit}</span>
    <span class="tag-shutdown"><i></i>${T.legend.shutdown}</span>
    <span class="tag-scandal"><i></i>${T.legend.scandal}</span>
    <span><i></i>${T.legend.other}</span>
  </div>
  <ol class="tl" id="timeline">
${rows.join("\n")}
  </ol>`;
  const scripts = `<script>const PAGE = ${JSON.stringify({ lang: L.dateLocale, today: T.today })};</script>
<script src="${root}js/common.js"></script>
<script src="${root}js/timeline.js"></script>`;
  return layout(L, "timeline", { title: L.meta.timelineTitle, description: L.meta.timelineDescription, body: { main }, scripts });
}

function casesPage(L) {
  const C = L.cases;
  const item = c => {
    const t = C.items[c.id];
    const linkLabel = c.id === "tumbler-ridge" ? L.labels.linkDeaths : L.labels.linkDeath;
    const parts = [`<p class="meta">${t.meta}</p>`];
    if (t.chain) parts.push(`<ul class="chain">\n${t.chain.map(x => `          <li>${x}</li>`).join("\n")}\n        </ul>`);
    if (t.body) parts.push(`<p>${t.body}</p>`);
    if (t.link) parts.push(`<p><strong>${linkLabel}</strong> ${t.link}</p>`);
    if (t.openai) parts.push(`<p><strong>${L.labels.openaiSays}</strong> ${t.openai}</p>`);
    if (t.note) parts.push(`<p class="note">${t.note}</p>`);
    parts.push(`<p class="src">${L.labels.sources} ${sourceLinks(c.src)}</p>`);
    return `    <li class="case" id="${c.id}">
      <details>
        <summary><span class="who">${t.who}</span><span class="hook">${t.hook}</span></summary>
        ${parts.join("\n        ")}
      </details>
    </li>`;
  };
  const section = s => `  <h2>${C.sections[s]}</h2>
  <ol class="list">
${CASES.filter(c => c.section === s).map(item).join("\n")}
  </ol>`;
  const main = `  <h1>${C.h1}</h1>
  <p class="note">${C.intro}</p>
  <p class="note">${C.intro2}</p>

${["murder", "suicide", "related"].map(section).join("\n\n")}

  <h2>${C.scaleH}</h2>
  <p class="note">${C.scale} ${L.labels.source} ${sourceLinks(["stats"])}</p>

  <p class="note">${helpline(L)}</p>
  <p class="note">${C.updated}</p>`;
  const scripts = `<script>
  // Open the case named in the URL, e.g. cases.html#raine from the homepage.
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) target.querySelector("details").open = true;
</script>`;
  return layout(L, "cases", { title: L.meta.casesTitle, description: L.meta.casesDescription, body: { main }, scripts });
}

function killPage(L) {
  const K = L.kill;
  const rows = DEATHS.map(d => {
    const who = d.name || K.who[d.who];
    return `    <tr>
      <th scope="row"><a href="${href(L, L, "cases", "#" + d.case)}">${who}</a></th>
      <td class="age">${d.age ?? K.unknownAge}</td>
      <td>${K.places[d.place]}</td>
      <td class="died">${fmtFull(L, d.date)}</td>
      <td>${K.how[d.how]}</td>
    </tr>`;
  }).join("\n");
  const main = `  <div class="kill-head">
    <p class="kill-number">${DEATHS.length}</p>
    <h1>${K.h1}</h1>
    <p class="kill-caption">${K.caption}</p>
  </div>
  <p class="note">${K.intro}</p>
  <table class="kill-table">
    <thead><tr><th scope="col">${K.cols.who}</th><th scope="col">${K.cols.age}</th><th scope="col">${K.cols.where}</th><th scope="col">${K.cols.died}</th><th scope="col">${K.cols.how}</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <p class="note">${K.notCounted}</p>
  <p class="note">${K.namesNote}</p>
  <p class="note">${L.allegations} ${helpline(L)}</p>`;
  return layout(L, "kill", { title: L.meta.killTitle, description: L.meta.killDescription, body: { main } });
}

// ---------- write ----------

if (DEATHS.length !== 18) throw new Error("Kill count changed: update the count in every locale (" + DEATHS.length + ")");

fs.rmSync(OUT, { recursive: true, force: true });
for (const L of LOCALES) {
  const dir = path.join(OUT, L.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, PAGES.index), indexPage(L));
  fs.writeFileSync(path.join(dir, PAGES.timeline), timelinePage(L));
  fs.writeFileSync(path.join(dir, PAGES.cases), casesPage(L));
  fs.writeFileSync(path.join(dir, PAGES.kill), killPage(L));
}
for (const asset of ["css", "js"]) fs.cpSync(path.join(__dirname, asset), path.join(OUT, asset), { recursive: true });

console.log("Built " + LOCALES.map(L => L.code).join(", ") + " into dist/");
