const $ = (id) => document.getElementById(id);
const frame = $("pageFrame");
const urlInput = $("url");
const newTab = $("newTab");
let seconds = 60;
let remaining = seconds;
let round = 1;
let completed = 0;
let interval = null;

function displayTime(value) {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const secs = (value % 60).toString().padStart(2, "0");
  $("timer").textContent = `${minutes}:${secs}`;
}
function setStatus(text) { $("roundStatus").textContent = text; }
function resetTimer() { seconds = Math.max(5, Math.min(3600, Number($("duration").value) || 60)); remaining = seconds; displayTime(remaining); }
function finishRound() {
  clearInterval(interval); interval = null; completed++; $("completed").textContent = completed; setStatus("Round complete");
  round++; $("roundNumber").textContent = round; resetTimer();
}
$("duration").addEventListener("change", () => { if (!interval) resetTimer(); });
$("startRound").addEventListener("click", () => { if (interval) return; setStatus("Running"); interval = setInterval(() => { remaining--; displayTime(remaining); if (remaining <= 0) finishRound(); }, 1000); });
$("pauseRound").addEventListener("click", () => { if (!interval) return; clearInterval(interval); interval = null; setStatus("Paused"); });
$("resetRound").addEventListener("click", () => { clearInterval(interval); interval = null; round = 1; completed = 0; $("roundNumber").textContent = round; $("completed").textContent = completed; setStatus("Ready"); resetTimer(); });

function normalise(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[^\s./]+\.[^\s./]+/.test(trimmed)) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}
$("openForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const url = normalise(urlInput.value);
  if (!url) return;
  frame.src = url;
  newTab.href = `/go?url=${encodeURIComponent(url)}`;
  newTab.hidden = false;
  $("message").textContent = "Loading. If the site blocks embedding, open it in a new tab.";
});
resetTimer();
const initial = new URLSearchParams(location.search).get("route");
if (initial) { urlInput.value = initial; $("openForm").requestSubmit(); }
