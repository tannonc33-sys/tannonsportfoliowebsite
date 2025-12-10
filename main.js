// main.js
document.addEventListener("DOMContentLoaded", () => {
  const hint = document.getElementById("scroll-hint");
  if (!hint) return;

  let hintShown = false;

  const showHint = () => {
    if (hintShown) return;
    hintShown = true;
    hint.classList.add("visible");
  };

  const hideHint = () => {
    if (!hintShown) return;
    hint.classList.remove("visible");
  };

  // Show after 15 seconds (15000 ms)
  const timer = setTimeout(showHint, 15000);

  // Any user interaction = hide + stop timer
  const dismiss = () => {
    clearTimeout(timer);
    hideHint();
    window.removeEventListener("scroll", dismiss);
    window.removeEventListener("click", dismiss);
    window.removeEventListener("mousemove", dismiss);
  };

  window.addEventListener("scroll", dismiss);
  window.addEventListener("click", dismiss);
  window.addEventListener("mousemove", dismiss);
});
