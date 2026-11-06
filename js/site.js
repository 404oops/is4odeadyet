// Renders every page in the visitor's language. Each HTML page is a shell that loads the data files
// and this script with data-page="index|timeline|cases|kill"; the text comes from locales/<code>.js.
(function () {
  const PAGE_NAME = document.currentScript.dataset.page;

  // Languages, in the order the footer lists them. match: browser language prefixes.
  const LANGS = [
    { code: "en", name: "English", match: ["en"] },
    { code: "ja", name: "日本語", match: ["ja"] },
    { code: "zh-hans", name: "简体中文", match: ["zh"] },
    { code: "zh-hant", name: "繁體中文", match: ["zh-tw", "zh-hk", "zh-mo", "zh-hant"] },
    { code: "ko", name: "한국어", match: ["ko"] },
    { code: "es", name: "Español", match: ["es"] },
    { code: "pt-br", name: "Português (Brasil)", match: ["pt"] },
    { code: "fr", name: "Français", match: ["fr"] },
    { code: "de", name: "Deutsch", match: ["de"] },
  ];

  // Bodoni Moda has no CJK glyphs, so those languages also load a matching Noto Serif.
  const CJK_FONTS = { ja: "Noto Serif JP", "zh-hans": "Noto Serif SC", "zh-hant": "Noto Serif TC", ko: "Noto Serif KR" };

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

  const FILES = { index: "index.html", timeline: "timeline.html", cases: "cases.html", kill: "kill-count.html" };

  // ---------- choosing the language ----------

  // ?lang= in the URL wins, then the visitor's last choice, then their browser's languages.
  function pickLanguage() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (LANGS.some(l => l.code === fromUrl)) { remember(fromUrl); return fromUrl; }
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    if (LANGS.some(l => l.code === saved)) return saved;
    for (const pref of (navigator.languages || [navigator.language || "en"]).map(p => p.toLowerCase())) {
      // Longest match wins, so zh-TW picks Traditional over the generic zh -> Simplified.
      let best = null, bestLen = 0;
      for (const l of LANGS) for (const m of l.match) {
        if ((pref === m || pref.startsWith(m + "-")) && m.length > bestLen) { best = l.code; bestLen = m.length; }
      }
      if (best) return best;
    }
    return "en";
  }
  function remember(code) { try { localStorage.setItem("lang", code); } catch (e) {} }

  const code = pickLanguage();

  // ---------- helpers ----------

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const utc = iso => new Date(iso.length === 7 ? iso + "-01T00:00:00Z" : iso + "T00:00:00Z");
  const link = (page, hash = "") => FILES[page] + (code === "en" ? "" : "?lang=" + code) + hash;

  const sourceLinks = keys => keys.map(k =>
    `<a href="${esc(SOURCES[k][1])}" target="_blank" rel="noopener">${esc(SOURCES[k][0])}</a>`).join(", ");

  // Visual width of the hero answer in ems, so long or CJK answers still fit the screen.
  function answerWidth(word) {
    let w = 0;
    for (const ch of word) w += /[　-鿿가-힯]/.test(ch) ? 1 : 0.75;
    return Math.max(2, w).toFixed(2);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  // ---------- page parts ----------

  function frame(L, { hero = "", main }) {
    const navItem = (p, label) => `<a href="${link(p)}"${p === PAGE_NAME ? ' aria-current="page"' : ""}>${label}</a>`;
    const langs = LANGS.map(l => l.code === code
      ? `<span aria-current="true">${l.name}</span>`
      : `<a href="${FILES[PAGE_NAME]}?lang=${l.code}" lang="${l.code}" data-lang="${l.code}">${l.name}</a>`).join(" · ");
    return `${hero}
<nav>
  ${navItem("index", L.nav.countdown)}
  ${navItem("timeline", L.nav.timeline)}
  ${navItem("cases", L.nav.cases)}
  ${navItem("kill", L.nav.kill)}
</nav>
<main>
${main}
</main>
<footer>
  <p>${fill(L.footer.madeBy, { link: '<a href="https://404oops.com">404oops</a>' })}</p>
  <p class="langs">${langs}</p>
</footer>`;
  }

  const helpline = L => fill(L.helpline, { link: '<a href="https://findahelpline.com">findahelpline.com</a>' });

  const pages = {
    index(L) {
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
          : `${L.labels.see} ${ref.see.map(id => `<a href="${link("cases", "#" + id)}">${CASE_SHORT[id]}</a>`).join(", ")}`;
        return `<li><h3>${pt.h}</h3><p>${pt.p}</p><p class="src">${cite}</p></li>`;
      }).join("\n");
      const main = `<h1>${L.why.h1}</h1>
<p class="lede">${L.why.lede}</p>
<ol class="dangers">${points}</ol>
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
      return {
        title: L.meta.indexTitle, description: L.meta.indexDescription, html: frame(L, { hero, main }),
        page: {
          shutdown: SHUTDOWN, start: CHATGPT_REMOVAL,
          answer: L.answer, answerLen: { no: answerWidth(L.answer.no), yes: answerWidth(L.answer.yes) },
          status: { alive: L.hero.alive, dead: L.hero.dead }, daysLeft: L.grid.daysLeft,
          events: EVENTS.map(([id, date, tag]) => [date, tag, L.timeline.events[id].t]),
        },
        scripts: ["js/countdown.js", "js/daygrid.js"],
      };
    },

    timeline(L) {
      const T = L.timeline;
      let year = null;
      const rows = [];
      for (const [id, date, tag, src] of EVENTS) {
        const y = date.slice(0, 4);
        if (y !== year) { rows.push(`<li class="tl-year"><span>${y}</span></li>`); year = y; }
        const e = T.events[id];
        const day = utc(date).toLocaleDateString(L.dateLocale, { timeZone: "UTC", day: "numeric", month: "short" });
        rows.push(`<li class="tl-item tag-${tag}" data-date="${date}">
  <time datetime="${date}">${day}</time>
  <div class="tl-card">
    <span class="tag">${T.tags[tag]}</span>
    <h3>${e.t}</h3>
    ${e.d ? `<p>${e.d}</p>` : ""}
    <p class="src">${sourceLinks(src)}</p>
  </div>
</li>`);
      }
      const main = `<h1>${T.h1}</h1>
<p class="note">${fill(T.note, { link: `<a href="${link("cases")}">${L.nav.cases}</a>` })}</p>
<div class="tl-legend">
  <span class="tag-lawsuit"><i></i>${T.legend.lawsuit}</span>
  <span class="tag-shutdown"><i></i>${T.legend.shutdown}</span>
  <span class="tag-scandal"><i></i>${T.legend.scandal}</span>
  <span><i></i>${T.legend.other}</span>
</div>
<ol class="tl" id="timeline">${rows.join("\n")}</ol>`;
      return {
        title: L.meta.timelineTitle, description: L.meta.timelineDescription, html: frame(L, { main }),
        page: { today: T.today }, scripts: ["js/timeline.js"],
      };
    },

    cases(L) {
      const C = L.cases;
      const item = c => {
        const t = C.items[c.id];
        const linkLabel = c.id === "tumbler-ridge" ? L.labels.linkDeaths : L.labels.linkDeath;
        const parts = [`<p class="meta">${t.meta}</p>`];
        if (t.chain) parts.push(`<ul class="chain">${t.chain.map(x => `<li>${x}</li>`).join("")}</ul>`);
        if (t.body) parts.push(`<p>${t.body}</p>`);
        if (t.link) parts.push(`<p><strong>${linkLabel}</strong> ${t.link}</p>`);
        if (t.openai) parts.push(`<p><strong>${L.labels.openaiSays}</strong> ${t.openai}</p>`);
        if (t.note) parts.push(`<p class="note">${t.note}</p>`);
        parts.push(`<p class="src">${L.labels.sources} ${sourceLinks(c.src)}</p>`);
        return `<li class="case" id="${c.id}"><details>
  <summary><span class="who">${t.who}</span><span class="hook">${t.hook}</span></summary>
  ${parts.join("\n  ")}
</details></li>`;
      };
      const section = s => `<h2>${C.sections[s]}</h2>
<ol class="list">${CASES.filter(c => c.section === s).map(item).join("\n")}</ol>`;
      const main = `<h1>${C.h1}</h1>
<p class="note">${C.intro}</p>
<p class="note">${C.intro2}</p>
${["murder", "suicide", "related"].map(section).join("\n")}
<h2>${C.scaleH}</h2>
<p class="note">${C.scale} ${L.labels.source} ${sourceLinks(["stats"])}</p>
<p class="note">${helpline(L)}</p>
<p class="note">${C.updated}</p>`;
      return { title: L.meta.casesTitle, description: L.meta.casesDescription, html: frame(L, { main }) };
    },

    kill(L) {
      const K = L.kill;
      const died = iso => utc(iso).toLocaleDateString(L.dateLocale, iso.length === 7
        ? { timeZone: "UTC", month: "short", year: "numeric" }
        : { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
      const rows = DEATHS.map(d => `<tr>
  <th scope="row"><a href="${link("cases", "#" + d.case)}">${d.name || K.who[d.who]}</a></th>
  <td class="age">${d.age ?? K.unknownAge}</td>
  <td>${K.places[d.place]}</td>
  <td class="died">${died(d.date)}</td>
  <td>${K.how[d.how]}</td>
</tr>`).join("\n");
      const main = `<div class="kill-head">
  <p class="kill-number">${DEATHS.length}</p>
  <h1>${K.h1}</h1>
  <p class="kill-caption">${K.caption}</p>
</div>
<p class="note">${K.intro}</p>
<table class="kill-table">
  <thead><tr><th scope="col">${K.cols.who}</th><th scope="col">${K.cols.age}</th><th scope="col">${K.cols.where}</th><th scope="col">${K.cols.died}</th><th scope="col">${K.cols.how}</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<p class="note">${K.notCounted}</p>
<p class="note">${K.namesNote}</p>
<p class="note">${L.allegations} ${helpline(L)}</p>`;
      return { title: L.meta.killTitle, description: L.meta.killDescription, html: frame(L, { main }) };
    },
  };

  // ---------- render ----------

  async function render() {
    await loadScript("locales/" + code + ".js");
    const L = LOCALE;
    const out = pages[PAGE_NAME](L);

    document.documentElement.lang = L.htmlLang;
    document.title = out.title;
    document.querySelector('meta[name="description"]').content = out.description;
    if (CJK_FONTS[code]) {
      const f = document.createElement("link");
      f.rel = "stylesheet";
      f.href = "https://fonts.googleapis.com/css2?family=" + CJK_FONTS[code].replace(/ /g, "+") + ":wght@400;700;900&display=swap";
      document.head.appendChild(f);
    }
    document.getElementById("app").innerHTML = out.html;

    // Picking a language in the footer makes it stick for the rest of the visit.
    document.querySelectorAll("[data-lang]").forEach(a => a.addEventListener("click", () => remember(a.dataset.lang)));

    // Content is rendered after load, so open and scroll to the case named in the URL ourselves.
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) {
      const d = target.querySelector("details");
      if (d) d.open = true;
      target.scrollIntoView();
    }

    window.PAGE = { lang: L.dateLocale, ...out.page };
    for (const src of ["js/common.js", ...(out.scripts || [])]) await loadScript(src);
  }

  render();
})();
