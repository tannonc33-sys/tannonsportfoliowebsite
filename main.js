// main.js
document.addEventListener("DOMContentLoaded", () => {
  // Order of your pages in the scroll sequence
  const pages = [
    "index.html",
    "about.html",
    "work.html",
    "resume.html",
    "contact.html",
  ];

  function getCurrentPage() {
    const path = window.location.pathname;
    // get last part of URL, or default to index.html
    const last = path.split("/").filter(Boolean).pop() || "index.html";
    return last;
  }

  const currentPage = getCurrentPage();
  const currentIndex = pages.indexOf(currentPage);

  // If this page isn't in the list, don't do anything
  if (currentIndex === -1) return;

  let isTransitioning = false;

  function goTo(index) {
    if (index < 0 || index >= pages.length) return;
    isTransitioning = true;
    window.location.href = pages[index];
  }

  // --- Scroll to change pages ---
  function onWheel(e) {
    if (isTransitioning) return;

    // Ignore tiny touchpad movements
    const threshold = 25;
    if (Math.abs(e.deltaY) < threshold) return;

    // Prevent normal scroll, we are "page switching"
    e.preventDefault();

    if (e.deltaY > 0 && currentIndex < pages.length - 1) {
      // Scroll down → next page
      goTo(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      // Scroll up → previous page
      goTo(currentIndex - 1);
    }
  }

  // important: passive: false so we can preventDefault
  window.addEventListener("wheel", onWheel, { passive: false });

  // --- Touch swipe support (optional, simple version) ---
  let touchStartY = null;

  window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", (e) => {
    if (touchStartY === null || isTransitioning) return;

    const dist = e.changedTouches[0].clientY - touchStartY;
    const threshold = 40;
    if (Math.abs(dist) < threshold) return;

    if (dist < 0 && currentIndex < pages.length - 1) {
      goTo(currentIndex + 1);
    } else if (dist > 0 && currentIndex > 0) {
      goTo(currentIndex - 1);
    }

    touchStartY = null;
  });

  // --- Scroll hint near cursor after 15s ---
  const hint = document.getElementById("scroll-hint");
  if (!hint) return;

  let hintShown = false;
  let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Track cursor so we can pop the hint near it
  window.addEventListener("mousemove", (e) => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;

    if (hintShown) {
      hint.style.left = `${lastMouse.x + 14}px`;
      hint.style.top = `${lastMouse.y + 14}px`;
    }
  });

  const showHint = () => {
    if (hintShown) return;
    hintShown = true;
    hint.style.left = `${lastMouse.x + 14}px`;
    hint.style.top = `${lastMouse.y + 14}px`;
    hint.classList.add("visible");
  };

  // 15 second timer (15000 ms) – adjust this number if you want
  const timer = setTimeout(showHint, 15000);

  // Any interaction hides the hint and cancels timer
  const dismiss = () => {
    clearTimeout(timer);
    if (!hintShown) return;
    hint.classList.remove("visible");

    window.removeEventListener("scroll", dismiss);
    window.removeEventListener("wheel", dismiss);
    window.removeEventListener("touchstart", dismiss);
    window.removeEventListener("click", dismiss);
    window.removeEventListener("mousemove", dismiss);
  };

  window.addEventListener("scroll", dismiss);
  window.addEventListener("wheel", dismiss);
  window.addEventListener("touchstart", dismiss);
  window.addEventListener("click", dismiss);
});
