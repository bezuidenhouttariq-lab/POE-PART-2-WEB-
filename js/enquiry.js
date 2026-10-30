/* =========================================================
   Paws & Purpose Animal Rescue — enquiry.js (enquiry.html)

   The enquiry form lets a visitor ask about ADOPTING, VOLUNTEERING,
   SPONSORING or send a GENERAL question. It differs from the contact
   form in purpose: once the input is valid it is PROCESSED and the
   visitor gets an instant, personalised answer about cost,
   availability or next steps — calculated from the animals dataset
   (animals-data.js) and today's date.

   Flow: choose type -> relevant fields appear -> validate -> AJAX
   submit -> show the processed response.
   ========================================================= */

(function () {
  "use strict";

  var form = document.getElementById("enquiry-form");
  if (!form || !window.PP || !PP.forms || !PP.data) return;

  var F = PP.forms, R = F.rules, h = F.h, data = PP.data;
  var result = document.getElementById("enquiry-result");

  /* ---------- Conditional field groups ---------- */
  var groups = form.querySelectorAll("[data-for]");

  function currentType() {
    var checked = form.querySelector('input[name="enquiry-type"]:checked');
    return checked ? checked.value : "adopt";
  }

  function applyType() {
    var type = currentType();
    groups.forEach(function (g) {
      var show = g.getAttribute("data-for").split(" ").indexOf(type) !== -1;
      g.hidden = !show;
      // Disabled fields are skipped by validation and not submitted.
      g.querySelectorAll("input, select, textarea").forEach(function (f) { f.disabled = !show; });
    });
    var label = document.getElementById("message-label");
    var area = document.getElementById("message");
    var hint = {
      adopt: "Tell us about your home, garden and any current pets.",
      volunteer: "Tell us about your experience and when you're free.",
      sponsor: "Anything you'd like us to know about your sponsorship?",
      general: "How can we help?"
    };
    if (label) label.textContent = type === "general" ? "Your question" : "Tell us a bit more";
    if (area) area.placeholder = hint[type];
  }
  form.querySelectorAll('input[name="enquiry-type"]').forEach(function (r) {
    r.addEventListener("change", applyType);
  });

  /* ---------- Pre-fill from the URL (?type=adopt&animal=buddy&tier=silver) ---------- */
  (function prefill() {
    var params = new URLSearchParams(window.location.search);
    var type = params.get("type");
    if (["adopt", "volunteer", "sponsor", "general"].indexOf(type) !== -1) {
      form.querySelector('input[name="enquiry-type"][value="' + type + '"]').checked = true;
    }
    var animal = params.get("animal");
    if (animal && PP.ui.findAnimal(animal)) {
      var sel = form.elements["animal"];
      if (sel) sel.value = animal;
      var sel2 = form.elements["sponsor-animal"];
      if (sel2) sel2.value = animal;
    }
    var role = params.get("role");
    if (role && form.elements["volunteer-role"] &&
        data.volunteerRoles.some(function (r) { return r.id === role; })) {
      form.elements["volunteer-role"].value = role;
    }
    var tier = params.get("tier");
    if (tier && form.elements["tier"]) {
      var ok = data.tiers.some(function (t) { return t.id === tier; });
      if (ok) form.elements["tier"].value = tier;
    }
  })();

  applyType();

  // Date picker: only offer today -> +60 days.
  var dateInput = form.elements["meet-date"];
  if (dateInput) { dateInput.min = F.isoToday(0); dateInput.max = F.isoToday(60); }

  /* ---------- Validation rules ---------- */
  var specs = {
    "full-name": R.name,
    "email": R.email,
    "phone": R.phone(true), // optional, but must be a valid SA number if given
    "animal": R.select("an animal, or “Not sure yet”"),
    "meet-date": R.futureDate(60),
    "volunteer-role": R.select("a volunteer role"),
    "availability": R.select("when you are available"),
    "tier": R.select("a sponsorship level"),
    "sponsor-animal": R.select("an animal, or “Wherever needed most”"),
    "message": R.text("a message", 20, 500),
    "consent": R.checked("Please tick the box so we can contact you about this enquiry.")
  };
  var controller = F.init(form, specs, { onValid: handleValid });

  /* ======================================================
     PROCESSING — build the personalised response
     ====================================================== */
  function rand(n) { return PP.ui.formatRand(n); }

  function longDate(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-ZA", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }

  // First Saturday of the month is our open shelter day & volunteer orientation.
  function nextFirstSaturday() {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    for (var m = 0; m < 3; m++) {
      var d = new Date(now.getFullYear(), now.getMonth() + m, 1);
      while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
      if (d >= now) return d;
    }
  }

  function countAvailable() {
    var out = { dogs: 0, cats: 0, total: 0 };
    data.animals.forEach(function (a) {
      if (a.status !== "available") return;
      out.total++;
      if (a.type === "dog") out.dogs++; else out.cats++;
    });
    return out;
  }

  function adoptResponse(d) {
    var lines = [];
    var title, tone = "ok";
    if (d.animal === "unsure") {
      var c = countAvailable();
      var fees = data.animals.map(function (a) { return a.fee; });
      title = "We'll help you find the right match";
      lines.push("Right now we have " + c.total + " animals ready to meet new families (" + c.dogs +
        " dogs and " + c.cats + " cats).");
      lines.push("Adoption fees range from " + rand(Math.min.apply(null, fees)) + " to " +
        rand(Math.max.apply(null, fees)) + " depending on age, and always include sterilisation, vaccinations and a microchip.");
    } else {
      var a = PP.ui.findAnimal(d.animal);
      if (a.status === "available") {
        title = a.name + " is available";
        lines.push(a.name + " (" + a.breed.toLowerCase() + ", " + a.age + ") is ready to meet you.");
      } else {
        title = a.name + " has a meet-and-greet pending";
        tone = "wait";
        lines.push(a.name + " currently has a meet-and-greet pending. We've added you to " + a.name +
          "'s waiting list and will contact you first if it doesn't work out.");
      }
      lines.push("Adoption fee: " + rand(a.fee) + ", which includes sterilisation, vaccinations, deworming and a microchip.");
    }
    if (d["meet-date"]) {
      var dt = longDate(d["meet-date"]);
      var sat = new Date(d["meet-date"] + "T00:00:00").getDay() === 6;
      lines.push("You asked to visit on " + dt + ". We'll confirm that slot by email (" +
        (sat ? "Saturday hours are 09:00–13:00" : "weekday hours are 09:00–17:00") + ").");
    }
    lines.push("Next step: a supervised meet-and-greet, then a friendly home check.");
    return { title: title, lines: lines, tone: tone };
  }

  function volunteerResponse(d) {
    var role = data.volunteerRoles.filter(function (r) { return r.id === d["volunteer-role"]; })[0];
    var orientation = nextFirstSaturday();
    var when = { weekdays: "weekdays", weekends: "weekends", both: "weekdays and weekends" }[d.availability];
    return {
      title: "Thank you for offering to help",
      tone: "ok",
      lines: [
        "Role: " + role.name + ". You told us you're free on " + when + ".",
        "Cost: volunteering is free — training is provided and we cover your starter kit.",
        "Next volunteer orientation: " + longDate(orientation.getFullYear() + "-" +
          ("0" + (orientation.getMonth() + 1)).slice(-2) + "-" + ("0" + orientation.getDate()).slice(-2)) +
          " at 09:00 at the main shelter (our monthly open shelter day).",
        "We ask for a minimum of two hours a week. Our volunteer coordinator will email you with the details."
      ]
    };
  }

  function sponsorResponse(d) {
    var tier = data.tiers.filter(function (t) { return t.id === d.tier; })[0];
    var target = d["sponsor-animal"] === "any" ? null : PP.ui.findAnimal(d["sponsor-animal"]);
    var lines = [
      tier.name + " sponsorship: " + rand(tier.monthly) + " per month (" + rand(tier.monthly * 12) + " a year).",
      "It covers " + tier.covers + ".",
      target
        ? "You'll be sponsoring " + target.name + ". If " + target.name + " is adopted, you can move your sponsorship to another animal."
        : "Your sponsorship will go to whichever animal needs it most right now.",
      "Availability: sponsorships start the month after we receive your first payment. We'll email you secure EFT/debit-order details — please never send banking details through this form."
    ];
    return { title: "Thank you for sponsoring an animal", lines: lines, tone: "ok" };
  }

  function generalResponse() {
    return {
      title: "Thanks — we've got your question",
      tone: "ok",
      lines: [
        "We reply to general questions within two working days.",
        "Our shelter is open Monday to Friday 09:00–17:00 and Saturday 09:00–13:00 if you'd rather pop in.",
        "Meanwhile, the Adopt & Get Involved page answers most common questions."
      ]
    };
  }

  function buildResponse(d) {
    var type = d["enquiry-type"];
    if (type === "adopt") return adoptResponse(d);
    if (type === "volunteer") return volunteerResponse(d);
    if (type === "sponsor") return sponsorResponse(d);
    return generalResponse(d);
  }

  /* ======================================================
     SUBMIT (AJAX) + show result
     ====================================================== */
  function handleValid(d) {
    var button = form.querySelector('button[type="submit"]');
    d.reference = F.reference();
    var refField = form.elements["reference"];
    if (refField) refField.value = d.reference;

    F.setBusy(button, true, "Sending…");

    F.post(form, d).then(function (res) {
      F.setBusy(button, false);
      showResult(d, buildResponse(d), res);
    });
  }

  function showResult(d, response, res) {
    result.textContent = "";
    result.className = "result-panel result-panel--" + response.tone;

    var banner = res.ok
      ? h("p", { "class": "delivery delivery--ok", text: "✓ Your enquiry has been sent. Reference: " + d.reference })
      : h("p", { "class": "delivery delivery--warn",
          text: "We couldn't deliver your enquiry online just now (" +
            (res.error === "timeout" ? "the connection timed out" : "no connection to the server") +
            "). The answer below is still correct — please try again in a moment, or use our contact page. Reference: " + d.reference });

    var list = h("ul", { "class": "result-list" }, response.lines.map(function (l) { return h("li", { text: l }); }));

    var summaryLine = h("p", { "class": "result-for", text: "We'll reply to " + d.email + " within two working days." });

    var actions = h("div", { "class": "result-actions" });
    var again = h("button", { type: "button", "class": "btn btn-secondary", text: "Make another enquiry" });
    again.addEventListener("click", function () {
      controller.reset();
      applyType();
      result.hidden = true;
      form.hidden = false;
      form.querySelector("input, select").focus();
    });
    actions.appendChild(again);
    if (!res.ok) {
      var retry = h("button", { type: "button", "class": "btn btn-primary", text: "Try sending again" });
      retry.addEventListener("click", function () {
        retry.disabled = true;
        F.post(form, d).then(function (r2) { showResult(d, response, r2); });
      });
      actions.appendChild(retry);
    }

    result.appendChild(banner);
    result.appendChild(h("h2", { text: response.title, id: "result-title" }));
    result.appendChild(list);
    result.appendChild(summaryLine);
    result.appendChild(actions);

    form.hidden = true;
    result.hidden = false;
    result.setAttribute("aria-labelledby", "result-title");
    result.focus();
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
