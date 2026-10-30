/* =========================================================
   Paws & Purpose Animal Rescue — gallery.js (about.html)
   Image gallery with a lightbox, written in vanilla JavaScript.

   - Thumbnails are real <button>s, so the gallery works with a
     keyboard and screen reader (Enter/Space opens the lightbox).
   - The lightbox is a native <dialog>: focus is trapped inside it
     and Escape closes it for free.
   - Left/Right arrow keys, on-screen buttons and touch swipes
     move between images.
   ========================================================= */

(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  if (!items.length || typeof HTMLDialogElement === "undefined") return;

  var index = 0;
  var lastTrigger = null;

  /* ----- Build the lightbox once, with DOM methods ----- */
  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Image viewer");

  var figure = document.createElement("figure");
  figure.className = "lightbox-figure";
  var img = document.createElement("img");
  img.alt = "";
  var caption = document.createElement("figcaption");
  caption.className = "lightbox-caption";
  figure.appendChild(img);
  figure.appendChild(caption);

  function button(cls, label, svgPath) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lightbox-btn " + cls;
    b.setAttribute("aria-label", label);
    b.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
      svgPath + '"/></svg>';
    return b;
  }
  var closeBtn = button("lightbox-close", "Close image viewer", "M6 6l12 12M18 6L6 18");
  var prevBtn = button("lightbox-prev", "Previous image", "M15 5l-7 7 7 7");
  var nextBtn = button("lightbox-next", "Next image", "M9 5l7 7-7 7");
  var counter = document.createElement("p");
  counter.className = "lightbox-counter";
  counter.setAttribute("aria-live", "polite");

  dialog.appendChild(closeBtn);
  dialog.appendChild(prevBtn);
  dialog.appendChild(figure);
  dialog.appendChild(nextBtn);
  dialog.appendChild(counter);
  document.body.appendChild(dialog);

  /* ----- Behaviour ----- */
  function show(i) {
    index = (i + items.length) % items.length; // wrap around at both ends
    var thumb = items[index];
    var thumbImg = thumb.querySelector("img");
    img.src = thumb.getAttribute("data-full");
    img.alt = thumbImg ? thumbImg.alt : "";
    caption.textContent = thumb.getAttribute("data-caption") || "";
    counter.textContent = (index + 1) + " / " + items.length;
  }

  function open(i, trigger) {
    lastTrigger = trigger;
    show(i);
    dialog.showModal();
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i, item); });
  });

  closeBtn.addEventListener("click", function () { dialog.close(); });
  prevBtn.addEventListener("click", function () { show(index - 1); });
  nextBtn.addEventListener("click", function () { show(index + 1); });

  // Click on the dark backdrop closes the viewer.
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
  });

  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus(); // return focus to the thumbnail that opened it
  });

  // Touch swipe support for phones and tablets.
  var startX = null;
  dialog.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
