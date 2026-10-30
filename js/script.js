/* =========================================================
   Paws & Purpose Animal Rescue — script.js (loaded on every page)

   Part 2: mobile navigation toggle.
   Part 3 additions (all progressive enhancements — the site still
   reads fine with JavaScript switched off):
     - scroll-reveal animations (IntersectionObserver)
     - animated impact counters on the homepage
     - "back to top" button created with DOM manipulation
     - a small toast helper other scripts can reuse
     - dynamic footer year
   ========================================================= */

window.PP = window.PP || {};

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation (Part 2) ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Escape closes the menu and returns focus to the toggle button.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });

    // Close the menu automatically if the viewport is widened back
    // past the mobile breakpoint while the menu is open.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 640) closeNav();
    });
  }

  /* ---------- Toast notifications (reusable) ---------- */
  var toastRegion;
  PP.toast = function (message, kind) {
    if (!toastRegion) {
      toastRegion = document.createElement("div");
      toastRegion.className = "toast-region";
      toastRegion.setAttribute("role", "status");
      toastRegion.setAttribute("aria-live", "polite");
      document.body.appendChild(toastRegion);
    }
    var toast = document.createElement("div");
    toast.className = "toast" + (kind ? " toast--" + kind : "");
    toast.textContent = message; // textContent, never innerHTML: safe against injection
    toastRegion.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  };

  /* ---------- Scroll-reveal animation ---------- */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(
      "main .section-head, main .animal-card, main .panel, main .step, " +
      "main .team-member, main .gallery-item, main .faq-item, main .cta-strip .container"
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) {
      // Anything already on screen on first paint is left alone, so there is
      // no flash of hidden content above the fold.
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) return;
      el.classList.add("reveal");
      observer.observe(el);
    });

    // Cards injected later (the dynamic animal grid) ask to be observed too.
    PP.observeReveal = function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    };
  }

  /* ---------- Animated impact counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function format(n, suffix) { return n.toLocaleString("en-ZA") + (suffix || ""); }

    function run(el) {
      var end = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion || isNaN(end)) { el.textContent = format(end, suffix); return; }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = format(Math.round(end * eased), suffix);
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (el) { run(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Back-to-top button (created entirely in JS) ---------- */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        btn.classList.toggle("is-shown", window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var main = document.getElementById("main");
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
    initReveal();
    initCounters();
    initBackToTop();
  });
})();
