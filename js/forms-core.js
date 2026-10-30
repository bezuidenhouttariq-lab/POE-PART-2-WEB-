/* =========================================================
   Paws & Purpose Animal Rescue — forms-core.js
   Shared form engine used by enquiry.html and contact.html.

   What it does
   - Client-side validation with a rule library (names, email,
     South African phone numbers, dates, text length, selects,
     consent checkboxes).
   - Error handling: inline messages under each field, red/ticked
     field states, an error summary at the top of the form that
     receives focus, aria-invalid / aria-describedby for screen readers.
   - Live character counters on textareas.
   - AJAX submission with fetch() — no page reload — including a
     timeout, a "sending" state and clear failure handling.
   - A honeypot field to catch simple spam bots.

   Security notes
   - User input is only ever written back into the page with
     textContent (never innerHTML) and into URLs with
     encodeURIComponent, so it can't inject markup or script.
   - No payment or banking details are collected anywhere.
   ========================================================= */

window.PP = window.PP || {};

(function () {
  "use strict";

  /* ======================================================
     Rule library — each rule returns "" (valid) or a message.
     ====================================================== */
  var rules = {};

  rules.required = function (label) {
    return function (v) { return v === "" ? "Please enter your " + label + "." : ""; };
  };

  rules.name = function (v) {
    if (v === "") return "Please enter your full name.";
    if (v.length < 2) return "Your name needs at least 2 characters.";
    if (v.length > 60) return "Your name can be at most 60 characters.";
    // letters (including accented), spaces, apostrophes, hyphens and full stops only
    if (!/^[\p{L}][\p{L}\s'’.\-]*$/u.test(v)) {
      return "Names can only contain letters, spaces, apostrophes, hyphens and full stops.";
    }
    return "";
  };

  rules.email = function (v) {
    if (v === "") return "Please enter your email address.";
    if (v.length > 254) return "That email address is too long.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(v) || /\.\./.test(v)) {
      return "Enter a valid email address, like name@example.com.";
    }
    return "";
  };

  // South African numbers: 0821234567, 082 123 4567, +27 82 123 4567, 011 123 4567
  rules.phone = function (optional) {
    return function (v) {
      if (v === "") return optional ? "" : "Please enter your phone number.";
      var digits = v.replace(/[\s\-()]/g, "");
      if (!/^(\+27|0027|0)[1-9]\d{8}$/.test(digits)) {
        return "Enter a South African number, like 082 123 4567 or +27 82 123 4567.";
      }
      return "";
    };
  };

  rules.text = function (label, min, max) {
    return function (v) {
      if (v === "") return "Please enter " + label + ".";
      if (v.length < min) return "Please write at least " + min + " characters (you have " + v.length + ").";
      if (v.length > max) return "Please keep this under " + max + " characters (you have " + v.length + ").";
      return "";
    };
  };

  rules.select = function (label) {
    return function (v) { return v === "" ? "Please choose " + label + "." : ""; };
  };

  rules.checked = function (message) {
    return function (v, el) { return el.checked ? "" : message; };
  };

  // Date input (yyyy-mm-dd): must be a real date, today or later, within `days`, and not a Sunday.
  rules.futureDate = function (days) {
    return function (v) {
      if (v === "") return "Please choose a date.";
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      if (!m) return "Enter the date as day/month/year.";
      var y = +m[1], mo = +m[2], d = +m[3];
      var date = new Date(y, mo - 1, d);
      if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
        return "That date doesn't exist. Please check it.";
      }
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var latest = new Date(today); latest.setDate(latest.getDate() + days);
      if (date < today) return "Please choose today or a future date.";
      if (date > latest) return "Please choose a date within the next " + days + " days.";
      if (date.getDay() === 0) return "The shelter is closed on Sundays. Please pick another day.";
      return "";
    };
  };

  /* ======================================================
     Helpers
     ====================================================== */
  function clean(value) {
    // trim, strip control characters, collapse runs of spaces/tabs (keep line breaks in textareas)
    return String(value == null ? "" : value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/[ \t]+/g, " ")
      .trim();
  }

  function fieldValue(el) {
    if (el.type === "checkbox" || el.type === "radio") return el.checked ? "checked" : "";
    return clean(el.value);
  }

  function isoToday(offsetDays) {
    var d = new Date(); d.setDate(d.getDate() + (offsetDays || 0));
    var m = ("0" + (d.getMonth() + 1)).slice(-2), day = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ======================================================
     Form controller
       specs: { fieldName: ruleFunction, ... }
       opts:  { onValid(data, helpers), summaryTitle }
     Fields that are disabled (e.g. inside a hidden conditional
     group) are skipped.
     ====================================================== */
  function init(form, specs, opts) {
    opts = opts || {};
    form.setAttribute("novalidate", "novalidate"); // we show our own, friendlier messages
    var touched = {};

    var summary = document.createElement("div");
    summary.className = "error-summary";
    summary.setAttribute("role", "alert");
    summary.setAttribute("tabindex", "-1");
    summary.hidden = true;
    form.insertBefore(summary, form.firstChild);

    function el(name) { return form.elements[name]; }

    function errorNodeFor(input) {
      var id = input.id + "-error";
      var node = document.getElementById(id);
      if (!node) {
        node = document.createElement("p");
        node.className = "field-error";
        node.id = id;
        node.hidden = true;
        var anchor = input.closest(".form-row") || input.parentNode;
        anchor.appendChild(node);
        var describedBy = (input.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
        if (describedBy.indexOf(id) === -1) describedBy.push(id);
        input.setAttribute("aria-describedby", describedBy.join(" "));
      }
      return node;
    }

    function validateField(name, showMessage) {
      var input = el(name);
      if (!input || input.disabled) return "";
      var message = specs[name](fieldValue(input), input) || "";
      var row = input.closest(".form-row");
      var node = errorNodeFor(input);
      if (showMessage) {
        node.textContent = message;
        node.hidden = !message;
        input.setAttribute("aria-invalid", message ? "true" : "false");
        if (row) {
          row.classList.toggle("has-error", !!message);
          row.classList.toggle("is-valid", !message && fieldValue(input) !== "");
        }
      }
      return message;
    }

    Object.keys(specs).forEach(function (name) {
      var input = el(name);
      if (!input) return;
      input.addEventListener("blur", function () { touched[name] = true; validateField(name, true); });
      var evt = (input.tagName === "SELECT" || input.type === "checkbox" || input.type === "date") ? "change" : "input";
      input.addEventListener(evt, function () { if (touched[name]) validateField(name, true); });
    });

    // Live character counters: <textarea data-counter="counter-id" maxlength="500">
    form.querySelectorAll("textarea[data-counter]").forEach(function (ta) {
      var out = document.getElementById(ta.getAttribute("data-counter"));
      if (!out) return;
      var max = ta.getAttribute("data-max");
      function update() {
        var n = clean(ta.value).length;
        out.textContent = n + " / " + max + " characters";
        out.classList.toggle("is-over", n > +max);
      }
      ta.addEventListener("input", update);
      update();
      ta.addEventListener("pp:reset", update);
    });

    function showSummary(problems) {
      summary.textContent = "";
      var title = document.createElement("p");
      title.className = "error-summary-title";
      title.textContent = problems.length === 1
        ? "There is 1 problem with your form:"
        : "There are " + problems.length + " problems with your form:";
      var list = document.createElement("ul");
      problems.forEach(function (p) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + p.id;
        a.textContent = p.message;
        a.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById(p.id); if (t) t.focus(); });
        li.appendChild(a);
        list.appendChild(li);
      });
      summary.appendChild(title);
      summary.appendChild(list);
      summary.hidden = false;
    }

    function collect() {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (f) {
        if (!f.name || f.disabled) return;
        if ((f.type === "radio" || f.type === "checkbox") && !f.checked) return;
        data[f.name] = clean(f.value);
      });
      return data;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: real people never see or fill this field.
      var trap = el("bot-field");
      if (trap && trap.value !== "") return;

      var problems = [];
      Object.keys(specs).forEach(function (name) {
        touched[name] = true;
        var msg = validateField(name, true);
        if (msg) problems.push({ id: el(name).id, message: msg });
      });

      if (problems.length) {
        showSummary(problems);
        summary.focus();
        return;
      }
      summary.hidden = true;
      if (opts.onValid) opts.onValid(collect(), { form: form });
    });

    return {
      reset: function () {
        form.reset();
        touched = {};
        summary.hidden = true;
        form.querySelectorAll(".field-error").forEach(function (n) { n.hidden = true; n.textContent = ""; });
        form.querySelectorAll(".has-error, .is-valid").forEach(function (r) { r.classList.remove("has-error", "is-valid"); });
        form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
        form.querySelectorAll("textarea[data-counter]").forEach(function (t) { t.dispatchEvent(new Event("pp:reset")); });
      }
    };
  }

  /* ======================================================
     AJAX submission (fetch). Resolves { ok, status, error }.
     Posts url-encoded data to the same path — Netlify Forms
     picks this up when the site is hosted on Netlify.
     ====================================================== */
  function post(form, data) {
    var body = new URLSearchParams();
    body.append("form-name", form.getAttribute("name"));
    Object.keys(data).forEach(function (k) { if (k !== "form-name") body.append(k, data[k]); });

    var controller = ("AbortController" in window) ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 10000) : null;

    return fetch(window.location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) window.clearTimeout(timer);
      return { ok: res.ok, status: res.status };
    }).catch(function (err) {
      if (timer) window.clearTimeout(timer);
      return { ok: false, status: 0, error: err && err.name === "AbortError" ? "timeout" : "network" };
    });
  }

  function setBusy(button, busy, busyText) {
    if (busy) {
      button.setAttribute("data-label", button.textContent);
      button.textContent = busyText || "Sending…";
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      button.textContent = button.getAttribute("data-label") || button.textContent;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }

  // Small DOM builder used by the result panels.
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k]; else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function reference() {
    var d = new Date();
    var stamp = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", out = "";
    var buf = new Uint8Array(4);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < buf.length; i++) out += chars[buf[i] % chars.length];
    return "PP-" + stamp + "-" + out;
  }

  PP.forms = {
    rules: rules, init: init, post: post, setBusy: setBusy, h: h,
    clean: clean, reference: reference, isoToday: isoToday
  };
})();
