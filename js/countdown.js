// Drives the YES/NO answer and the weeks/days/hours/minutes/seconds countdown on the homepage.
(function () {
  const deadline = utcMs(PAGE.shutdown);
  const $ = id => document.getElementById(id);

  function tick() {
    const left = Math.max(0, deadline - Date.now());
    const dead = left === 0;
    $("answer").textContent = dead ? PAGE.answer.yes : PAGE.answer.no;
    $("answer").style.setProperty("--len", dead ? PAGE.answerLen.yes : PAGE.answerLen.no);
    $("answer").classList.toggle("yes", dead);
    // Once it's dead the hero shows only YES on a plain white page (see body.dead in style.css).
    document.body.classList.toggle("dead", dead);
    $("status").textContent = dead ? PAGE.status.dead : PAGE.status.alive;

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
