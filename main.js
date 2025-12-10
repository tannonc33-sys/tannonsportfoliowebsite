// main.js
document.addEventListener("DOMContentLoaded", () => {
  // Order of your pages in the scroll sequence
  const pages = [
    "index.html",
    "about.html",
    "portfolio.html",
    "resume.html",
    "contact.html",
  ];

  function getCurrentPage() {
    const path = window.location.pathname;
    const last = path.split("/").filter(Boolean).pop() || "index.html";
    return last;
  }

  const currentPage = getCurrentPage();
  const currentIndex = pages.indexOf(currentPage);

  if (currentIndex === -1) return;

  let isTransitioning = false;

  function goTo(index) {
    if (index < 0 || index >= pages.length) return;
    isTransitioning = true;
    window.location.href = pages[index];
  }

  // --- Scroll wheel → change pages ---
  function onWheel(e) {
    if (isTransitioning) return;

    const threshold = 25;
    if (Math.abs(e.deltaY) < threshold) return;

    e.preventDefault();

    if (e.deltaY > 0 && currentIndex < pages.length - 1) {
      goTo(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });

  // --- Touch swipe support (basic) ---
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

  // --- Custom cursor: dot + ring ---
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (dot && ring) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    // Track mouse position
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    // Smooth ring follow
    const render = () => {
      const speed = 0.18; // lower = smoother/slower
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;

      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";

      requestAnimationFrame(render);
    };
    render();

    // Enlarge ring on interactive elements
    const hoverTargets = document.querySelectorAll("a, button, [data-cursor='hover']");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("cursor-ring-hover");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("cursor-ring-hover");
      });
    });
  }

  // --- Scroll hint logic ---
  const hint = document.getElementById("scroll-hint");
  if (!hint) return; // if there's no hint element, we're done

  let hintShown = false;
  let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  let showTimer = null;
  let hideTimer = null;

  // Keep track of mouse for placing the hint
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

    // Keep it visible for 30 seconds
    hideTimer = setTimeout(() => {
      hint.classList.remove("visible");
    }, 30000); // 30 seconds
  };

  // Show after 15 seconds of no interaction
  showTimer = setTimeout(showHint, 15000);

  const dismiss = () => {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);

    if (hintShown) {
      hint.classList.remove("visible");
    }

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
