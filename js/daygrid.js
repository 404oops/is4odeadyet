// Month-by-month grid of every day from 4o's ChatGPT removal to the final API shutdown.
// Past days are struck through; each remaining day shows how many days are left.
(function () {
  const DAY = 86400000;
  const start = utcMs(CHATGPT_REMOVAL);
  const end = utcMs(SHUTDOWN);
  const today = utcMs(todayIso());

  const byDate = {};
  EVENTS.forEach(e => (byDate[e[0]] ||= []).push(e));

  const months = [];
  for (let t = start; t <= end; t += DAY) {
    const d = new Date(t);
    const key = d.getUTCFullYear() + "-" + d.getUTCMonth();
    if (!months.length || months[months.length - 1].key !== key) {
      months.push({ key, date: d, cells: [] });
    }
    const iso = d.toISOString().slice(0, 10);
    const left = Math.round((end - t) / DAY);
    const evs = byDate[iso] || [];
    const cls = ["day"];
    if (t < today) cls.push("past");
    if (t === today) cls.push("today");
    if (evs.length) cls.push("ev");
    if (evs.some(e => e[1] === "shutdown")) cls.push("pulled");
    if (t === end) cls.push("end");

    const label = t === end ? "✕" : t < today ? d.getUTCDate() : left;
    const title = [fmtDate(iso), t >= today && t < end ? `${left} days left` : "", ...evs.map(e => e[2])].filter(Boolean).join(" · ");
    months[months.length - 1].cells.push(`<div class="${cls.join(" ")}" title="${title}">${label}</div>`);
  }

  document.getElementById("daygrid").innerHTML = months.map(m => {
    // Pad the first week so days line up under Mon..Sun.
    const offset = (m.date.getUTCDay() + 6) % 7;
    const pad = "<div></div>".repeat(offset);
    const name = m.date.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
    return `<section class="month"><h3>${name}</h3><div class="days">${pad}${m.cells.join("")}</div></section>`;
  }).join("");

  const daysLeft = Math.max(0, Math.round((end - today) / DAY));
  document.getElementById("days-left").textContent = daysLeft;
})();
