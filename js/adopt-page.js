/* =========================================================
   Paws & Purpose Animal Rescue — adopt-page.js (services.html)
   Uses jQuery (vendor/jquery) for the interactive components:

     1. Dynamic animal listing rendered from animals-data.js
     2. Search + filter + sort (state is mirrored in the URL so a
        filtered view can be shared or bookmarked)
     3. Animal profile modal (native <dialog>, so focus trapping and
        Escape-to-close are handled by the browser)
     4. Accordion (FAQ)
     5. Tabs (Volunteer / Foster / Sponsor)
   ========================================================= */

(function ($) {
  "use strict";

  if (!$ || !window.PP || !PP.data) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var speed = reduceMotion ? 0 : 220;

  /* ======================================================
     1 + 2. LISTING, SEARCH, FILTER, SORT
     ====================================================== */
  var $grid = $("#animal-grid");
  var $count = $("#result-count");
  var $empty = $("#no-results");
  var $q = $("#animal-search");
  var $type = $("#animal-type");
  var $sort = $("#animal-sort");
  var animals = PP.data.animals.slice();

  var sorters = {
    "name-asc": function (a, b) { return a.name.localeCompare(b.name); },
    "age-asc": function (a, b) { return a.ageMonths - b.ageMonths || a.name.localeCompare(b.name); },
    "age-desc": function (a, b) { return b.ageMonths - a.ageMonths || a.name.localeCompare(b.name); },
    "fee-asc": function (a, b) { return a.fee - b.fee || a.name.localeCompare(b.name); }
  };

  function matches(animal, query, type) {
    if (type !== "all" && animal.type !== type) return false;
    if (!query) return true;
    var haystack = [
      animal.name, animal.type, animal.breed, animal.sex, animal.age,
      animal.traits.join(" "), animal.bio, animal.status
    ].join(" ").toLowerCase();
    // every word the visitor typed must appear somewhere ("senior lab" works)
    return query.toLowerCase().split(/\s+/).filter(Boolean).every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  }

  function render() {
    var query = $.trim($q.val());
    var type = $type.val();
    var sortKey = $sort.val();

    var results = animals
      .filter(function (a) { return matches(a, query, type); })
      .sort(sorters[sortKey] || sorters["name-asc"]);

    $grid.empty();
    results.forEach(function (animal) {
      var node = PP.ui.card(animal);
      $grid.append(node);
      if (PP.observeReveal) PP.observeReveal(node);
    });

    // Announce the result count to screen readers (aria-live region).
    var noun = results.length === 1 ? "animal" : "animals";
    $count.text("Showing " + results.length + " of " + animals.length + " " + noun);
    $empty.prop("hidden", results.length !== 0);
    $grid.prop("hidden", results.length === 0);

    syncUrl(query, type, sortKey);
  }

  // Mirror the controls in the address bar (?q=&type=&sort=).
  function syncUrl(query, type, sortKey) {
    if (!window.history || !history.replaceState) return;
    var params = new URLSearchParams(window.location.search);
    function set(key, value, fallback) {
      if (value && value !== fallback) params.set(key, value); else params.delete(key);
    }
    set("q", query, "");
    set("type", type, "all");
    set("sort", sortKey, "name-asc");
    var qs = params.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) $q.val(params.get("q").slice(0, 60));
    if (["all", "dog", "cat"].indexOf(params.get("type")) !== -1) $type.val(params.get("type"));
    if (sorters[params.get("sort")]) $sort.val(params.get("sort"));
  }

  var debounce;
  $q.on("input", function () {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(render, 150);
  });
  $type.add($sort).on("change", render);

  $("#reset-filters, #reset-filters-empty").on("click", function () {
    $q.val("");
    $type.val("all");
    $sort.val("name-asc");
    render();
    $q.trigger("focus");
  });

  // The search box is inside a <form role="search"> — never reload the page.
  $("#animal-controls").on("submit", function (e) { e.preventDefault(); render(); });

  /* ======================================================
     3. ANIMAL PROFILE MODAL
     ====================================================== */
  var dialog = document.getElementById("animal-dialog");
  var $dialog = $(dialog);
  var lastTrigger = null;

  function shareUrl(animal) {
    return new URL("services.html?animal=" + encodeURIComponent(animal.id), window.location.href).href;
  }

  function openProfile(id, trigger) {
    var animal = PP.ui.findAnimal(id);
    if (!animal || !dialog) return;
    lastTrigger = trigger || null;

    var $body = $dialog.find(".dialog-body").empty();

    var $photo = $("<div>", { "class": "dialog-photo animal-photo bg-" + animal.art.bg }).append(PP.ui.avatar(animal));
    var $info = $("<div>", { "class": "dialog-info" });

    $info.append(
      $("<p>", { "class": "eyebrow" }).text((animal.type === "dog" ? "Dog" : "Cat") + " · " + animal.sex),
      $("<h2>", { id: "dialog-title" }).text(animal.name),
      $("<p>", { "class": "animal-meta" }).text(animal.breed + " · " + animal.age),
      $("<p>").text(animal.bio)
    );

    var $traits = $("<ul>", { "class": "trait-list", "aria-label": animal.name + "'s traits" });
    animal.traits.forEach(function (t) { $traits.append($("<li>").append($("<span>", { "class": "tag" }).text(t))); });
    $info.append($traits);

    var $facts = $("<dl>", { "class": "fact-list" }).append(
      $("<div>").append($("<dt>").text("Status"),
        $("<dd>").append($("<span>", { "class": "status-badge status-badge--inline status-badge--" + animal.status }).text(PP.ui.statusLabel(animal)))),
      $("<div>").append($("<dt>").text("Adoption fee"),
        $("<dd>").text(PP.ui.formatRand(animal.fee) + " (sterilised, vaccinated, microchipped)"))
    );
    $info.append($facts);

    var enquireUrl = "enquiry.html?type=adopt&animal=" + encodeURIComponent(animal.id);
    var enquireLabel = animal.status === "available"
      ? "Enquire about " + animal.name
      : "Join " + animal.name + "’s waiting list";

    var text = "Meet " + animal.name + ", a " + animal.age + " old " + animal.breed.toLowerCase() +
      " looking for a home at Paws & Purpose in Johannesburg South.";
    var url = shareUrl(animal);

    var $actions = $("<div>", { "class": "dialog-actions" }).append(
      $("<a>", { "class": "btn btn-primary", href: enquireUrl }).text(enquireLabel),
      $("<a>", {
        "class": "btn btn-secondary",
        href: "https://wa.me/?text=" + encodeURIComponent(text + " " + url),
        target: "_blank", rel: "noopener noreferrer"
      }).text("Share on WhatsApp"),
      $("<a>", {
        "class": "btn btn-secondary",
        href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
        target: "_blank", rel: "noopener noreferrer"
      }).text("Share on Facebook")
    );
    $info.append($actions);

    $body.append($photo, $info);
    dialog.setAttribute("aria-labelledby", "dialog-title");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      // Very old browsers without <dialog>: send people to the enquiry form instead.
      window.location.href = enquireUrl;
    }
  }

  // Event delegation: works for cards created by JavaScript after page load.
  $grid.on("click", ".js-meet", function () {
    openProfile($(this).attr("data-animal-id"), this);
  });

  $dialog.on("click", ".dialog-close", function () { dialog.close(); });

  // Clicking the dimmed backdrop (the <dialog> element itself) closes the modal.
  $dialog.on("click", function (e) { if (e.target === dialog) dialog.close(); });

  $dialog.on("close", function () {
    $dialog.removeClass("is-closing");
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  });

  /* ======================================================
     4. ACCORDION (FAQ)
     ====================================================== */
  var $items = $(".accordion .faq-item");
  $items.each(function () {
    var $item = $(this);
    $item.find(".accordion-panel").hide();
    $item.find(".accordion-trigger").attr("aria-expanded", "false");
  });

  $(".accordion").on("click", ".accordion-trigger", function () {
    var $btn = $(this);
    var $panel = $("#" + $btn.attr("aria-controls"));
    var willOpen = $btn.attr("aria-expanded") === "false";
    $btn.attr("aria-expanded", willOpen ? "true" : "false");
    $btn.closest(".faq-item").toggleClass("is-open", willOpen);
    if (willOpen) $panel.stop(true, true).slideDown(speed); else $panel.stop(true, true).slideUp(speed);
  });

  /* ======================================================
     5. TABS (Volunteer / Foster / Sponsor)
     ====================================================== */
  var $tabs = $(".tabs");
  $tabs.each(function () {
    var $root = $(this);
    var $buttons = $root.find('[role="tab"]');
    var $panels = $root.find('[role="tabpanel"]');

    function select($btn, moveFocus) {
      $buttons.attr({ "aria-selected": "false", tabindex: "-1" }).removeClass("is-active");
      $btn.attr({ "aria-selected": "true", tabindex: "0" }).addClass("is-active");
      $panels.hide();
      var $target = $("#" + $btn.attr("aria-controls"));
      if (reduceMotion) $target.show(); else $target.stop(true, true).fadeIn(speed);
      if (moveFocus) $btn.trigger("focus");
    }

    // Start on the tab named in the URL hash (#sponsor), otherwise the first tab.
    var $start = $buttons.first();
    var hash = window.location.hash.replace("#", "");
    $buttons.each(function () { if ($(this).attr("data-tab") === hash) $start = $(this); });
    select($start, false);

    $buttons.on("click", function () { select($(this), false); });

    // Arrow keys / Home / End move between tabs (WAI-ARIA tabs pattern).
    $buttons.on("keydown", function (e) {
      var i = $buttons.index(this);
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % $buttons.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + $buttons.length) % $buttons.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = $buttons.length - 1;
      if (next !== null) { e.preventDefault(); select($buttons.eq(next), true); }
    });

    // Links elsewhere on the page that point at a tab (e.g. "#sponsor") switch to it.
    $(window).on("hashchange", function () {
      var h = window.location.hash.replace("#", "");
      $buttons.each(function () { if ($(this).attr("data-tab") === h) select($(this), false); });
    });
  });

  /* ======================================================
     Boot
     ====================================================== */
  readUrl();
  render();

  // /services.html?animal=buddy opens Buddy's profile straight away
  // (used by the "Meet Buddy" links on the homepage and by shared links).
  var deepLink = new URLSearchParams(window.location.search).get("animal");
  if (deepLink && PP.ui.findAnimal(deepLink)) openProfile(deepLink, null);

})(window.jQuery);
