// Renders EVENTS as a vertical timeline on timeline.html, with year markers and a "today" marker.
(function () {
  const today = todayIso();
  const rows = [];
  let year = null;
  let nowPlaced = false;

  const dayMonth = iso => new Date(utcMs(iso)).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });

  EVENTS.forEach(([date, tag, title, detail, srcs]) => {
    if (!nowPlaced && date > today) {
      rows.push(`<li class="tl-now"><span>Today</span><b>${dayMonth(today)}</b></li>`);
      nowPlaced = true;
    }
    const y = date.slice(0, 4);
    if (y !== year) {
      rows.push(`<li class="tl-year"><span>${y}</span></li>`);
      year = y;
    }
    rows.push(`
      <li class="tl-item tag-${tag}${date > today ? " future" : ""}">
        <time datetime="${date}">${dayMonth(date)}</time>
        <div class="tl-card">
          <span class="tag">${tag}</span>
          <h3>${title}</h3>
          ${detail ? `<p>${detail}</p>` : ""}
          <p class="src">${sourceLinks(srcs)}</p>
        </div>
      </li>`);
  });

  document.getElementById("timeline").innerHTML = rows.join("");
})();
