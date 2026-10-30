/* =========================================================
   Paws & Purpose Animal Rescue — script.js
   Part 2 scope: only the mobile navigation toggle, so the
   responsive layout is fully usable on small screens.
   Enquiry/contact form validation is planned for Part 3.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu automatically if the viewport is widened back
  // past the mobile breakpoint while the menu is open.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 640 && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});
