// Drives the YES/NO answer and the weeks/days/hours/minutes/seconds countdown on index.html.
(function () {
  const deadline = utcMs(SHUTDOWN);
  const $ = id => document.getElementById(id);

  function tick() {
    const left = Math.max(0, deadline - Date.now());
    const dead = left === 0;
    $("answer").textContent = dead ? "YES." : "NO";
    $("answer").classList.toggle("yes", dead);
    // Once it's dead the hero shows only YES on a plain white page (see body.dead in style.css).
    document.body.classList.toggle("dead", dead);
    $("status").textContent = dead
      ? "The final GPT-4o snapshots are gone from ChatGPT and the API."
      : "Gone from ChatGPT since 13 Feb 2026. The final snapshots are still in the API.";

    const s = Math.floor(left / 1000);
    $("w").textContent = Math.floor(s / 604800);
    $("d").textContent = Math.floor(s / 86400) % 7;
    $("h").textContent = Math.floor(s / 3600) % 24;
    $("m").textContent = Math.floor(s / 60) % 60;
    $("s").textContent = s % 60;
  }

  tick();
  setInterval(tick, 1000);
})();
