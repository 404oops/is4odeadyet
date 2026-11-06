// Renders EVENTS into the timeline list on timeline.html.
(function () {
  const today = todayIso();
  document.getElementById("timeline").innerHTML = EVENTS.map(([date, tag, title, detail, srcs]) => `
    <li class="${date > today ? "future" : ""}">
      <time datetime="${date}">${fmtDate(date)}</time><span class="tag">${tag}</span>
      <div>${title}</div>
      ${detail ? `<p>${detail}</p>` : ""}
      <p class="src">Sources: ${sourceLinks(srcs)}</p>
    </li>`).join("");
})();
