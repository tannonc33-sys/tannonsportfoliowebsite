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
    const segments = path.split("/").filter(Boolean);
    const last = segments.pop();

    // If there's no last segment (root) or it doesn't look like an .html file,
    // treat it as index.html so GitHub Pages root works.
    if (!last || !last.includes(".html")) {
      return "index.html";
    }

    return last;
  }

  const currentPage = getCurrentPage();
  const currentIndex = pages.indexOf(currentPage);

  let isTransitioning = false;

  function goTo(index) {
    if (index < 0 || index >= pages.length) return;
    isTransitioning = true;
    window.location.href = pages[index];
  }

  // --- Scroll wheel → change pages ---
  if (currentIndex !== -1) {
    function onWheel(e) {
      if (window.__CASE_MODAL_OPEN__) return;
      
      if (isTransitioning) return;

      // If the wheel event happened inside a scrollable container, allow it
      const scrollArea = e.target.closest(".portfolio-viewer-body");
      if (scrollArea) {
        const canScroll = scrollArea.scrollHeight > scrollArea.clientHeight;
        if (canScroll) return; // let the box scroll normally
      }

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
  }

  // --- Custom cursor: dot + ring ---
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (dot && ring) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    const render = () => {
      const speed = 0.18;
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;

      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";

      requestAnimationFrame(render);
    };
    render();

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
  if (!hint) return;

  let hintShown = false;
  let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  let showTimer = null;
  let hideTimer = null;

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

    hideTimer = setTimeout(() => {
      hint.classList.remove("visible");
    }, 30000); // 30 seconds visible
  };

  showTimer = setTimeout(showHint, 15000); // show after 15 seconds

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

(() => {
  const modal = document.getElementById("caseModal");
  const titleEl = document.getElementById("caseTitle");
  const subtitleEl = document.getElementById("caseSubtitle");
  const bodyEl = document.getElementById("caseBody");

  // Add your cases here (start simple)
  const CASES = {
    andrea: {
      title: "Website Portfolio",
      subtitle: "Brand + website portfolio focused on clarity and consistency.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/andreawebsiteportfolio.jpg" alt="home page of andreas portfolio website" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea1: {
      title: "2 Posters",
      subtitle: "2 posters that were created for their event.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/icafposter.jpg" img src="assets/images/portfolio/minimalisticposter.jpg" alt="2 posters showcasing different skill styles" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea2: {
      title: "Basketball Brochure",
      subtitle: "Informational Brochure for the timeline of basketball.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/basketballinside.jpg" img src="assets/images/portfolio/basketballoutside.jpg" alt="Informational brochure for the timeline of basketball" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea3: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea4: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea5: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea6: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea7: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea8: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    },
    andrea9: {
      title: "Andrea — Art Portfolio",
      subtitle: "Brand + web portfolio site focused on clarity and calm browsing.",
      bodyHtml: `
        <div style="display:grid; gap:0.75rem;">
          <img src="assets/images/portfolio/portview-thumb-a.jpg" alt="" style="width:100%; border-radius:12px; border:1px solid rgba(51,36,69,.8);" />
          <p style="margin:0; opacity:.9;">
            Add your case study content here: goals, role, tools, outcomes, links, screenshots.
          </p>
        </div>
      `
    }
  };

  function openCase(caseKey) {
    const data = CASES[caseKey];
    if (!data) return;

    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    bodyEl.innerHTML = data.bodyHtml;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // IMPORTANT: if you have page-scroll-to-switch-pages, pause it while modal is open
    window.__CASE_MODAL_OPEN__ = true;
  }

  function closeCase() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    bodyEl.innerHTML = "";

    window.__CASE_MODAL_OPEN__ = false;
  }

  // Open on card click
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".portfolio-card[data-case]");
    if (!card) return;

    e.preventDefault();
    openCase(card.dataset.case);
  });

  // Close on backdrop or close button
  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeCase();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeCase();
  });
})();
