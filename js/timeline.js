// The timeline is rendered at build time; this fades events that haven't happened yet
// and inserts the "Today" marker, since both depend on the visitor's date.
(function () {
  const today = todayIso();
  const items = [...document.querySelectorAll(".tl-item")];
  items.forEach(li => li.classList.toggle("future", li.dataset.date > today));

  const next = items.find(li => li.dataset.date > today);
  if (!next) return;
  const now = document.createElement("li");
  now.className = "tl-now";
  now.innerHTML = `<span>${PAGE.today}</span><b>${fmtDate(today, { day: "numeric", month: "short" })}</b>`;
  // Put it above the next event, or above that event's year marker if it starts a new year.
  const prev = next.previousElementSibling;
  next.parentNode.insertBefore(now, prev && prev.classList.contains("tl-year") ? prev : next);
})();
