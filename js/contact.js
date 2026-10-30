/* =========================================================
   Paws & Purpose Animal Rescue — contact.js (contact.html)

   The contact form is for a GENERAL MESSAGE to the organisation
   (use the enquiry form for adopting, volunteering or sponsoring).
   It collects basic contact details, the type of message and a full
   message. Once validated, the information is compiled into an email
   and the visitor can send it to the recipient set below using their
   own email app (mailto:), or copy it. The message is also sent in the
   background with AJAX so the team has a copy.
   ========================================================= */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     RECIPIENT — the address the compiled email is sent to.
     Change this one line to the organisation's real inbox.
     (.example is a reserved domain, so this placeholder can never
     deliver to a stranger.)
     ------------------------------------------------------------------ */
  var RECIPIENT = "info@pawsandpurpose.example";

  var form = document.getElementById("contact-form");
  if (!form || !window.PP || !PP.forms) return;

  var F = PP.forms, R = F.rules, h = F.h;
  var result = document.getElementById("contact-result");

  var TYPES = {
    general: "General question",
    feedback: "Feedback about the shelter or website",
    media: "Media or partnership request",
    donation: "Donating food, blankets or supplies",
    stray: "Reporting a stray or an animal in need",
    other: "Something else"
  };

  var controller = F.init(form, {
    "c-name": R.name,
    "c-email": R.email,
    "c-phone": R.phone(true),
    "c-type": R.select("a message type"),
    "c-subject": R.text("a subject", 5, 80),
    "c-message": R.text("a message", 20, 800),
    "c-consent": R.checked("Please tick the box so we can reply to you.")
  }, { onValid: handleValid });

  function compileEmail(d) {
    var typeLabel = TYPES[d["message-type"]] || d["message-type"];
    var subject = "[Website] " + typeLabel + ": " + d.subject;
    var lines = [
      "Hello Paws & Purpose team,",
      "",
      d.message,
      "",
      "———",
      "Message type: " + typeLabel,
      "Name: " + d.name,
      "Email: " + d.email,
      "Phone: " + (d.phone || "not provided"),
      "",
      "Sent via the contact form at " + window.location.hostname
    ];
    var body = lines.join("\n");
    return {
      to: RECIPIENT,
      subject: subject,
      body: body,
      // encodeURIComponent keeps user text from breaking out of the URL; CRLF is the mailto line-break standard
      href: "mailto:" + RECIPIENT + "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body).replace(/%0A/g, "%0D%0A")
    };
  }

  function handleValid(d) {
    var button = form.querySelector('button[type="submit"]');
    F.setBusy(button, true, "Preparing…");
    var email = compileEmail(d);

    F.post(form, d).then(function (res) {
      F.setBusy(button, false);
      showResult(d, email, res);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.className = "visually-hidden";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  function showResult(d, email, res) {
    result.textContent = "";

    var banner = res.ok
      ? h("p", { "class": "delivery delivery--ok", text: "✓ Thank you, " + d.name.split(" ")[0] + " — we've received your message." })
      : h("p", { "class": "delivery delivery--warn", text: "We couldn't send your message through the website just now, so please use the email below instead." });

    var preview = h("dl", { "class": "email-preview" }, [
      h("div", {}, [h("dt", { text: "To" }), h("dd", { text: email.to })]),
      h("div", {}, [h("dt", { text: "Subject" }), h("dd", { text: email.subject })]),
      h("div", {}, [h("dt", { text: "Message" }), h("dd", { "class": "email-body", text: email.body })])
    ]);

    var send = h("a", { "class": "btn btn-primary", href: email.href, text: "Send email from my email app" });
    var copy = h("button", { type: "button", "class": "btn btn-secondary", text: "Copy email text" });
    copy.addEventListener("click", function () {
      copyText("To: " + email.to + "\nSubject: " + email.subject + "\n\n" + email.body).then(
        function () { PP.toast("Email copied to your clipboard."); },
        function () { PP.toast("Couldn't copy — please select the text and copy it manually.", "warn"); }
      );
    });
    var back = h("button", { type: "button", "class": "btn btn-link", text: "Edit my message" });
    back.addEventListener("click", function () {
      result.hidden = true; form.hidden = false;
      form.elements["c-message"].focus();
    });
    var again = h("button", { type: "button", "class": "btn btn-link", text: "Write a new message" });
    again.addEventListener("click", function () {
      controller.reset(); result.hidden = true; form.hidden = false; form.elements["c-name"].focus();
    });

    result.appendChild(banner);
    result.appendChild(h("h3", { id: "contact-result-title", text: "Your email is ready to send" }));
    result.appendChild(h("p", { text: "We've put your message together as an email to " + email.to +
      ". Open it in your email app to send it, or copy the text." }));
    result.appendChild(preview);
    result.appendChild(h("div", { "class": "result-actions" }, [send, copy, back, again]));

    form.hidden = true;
    result.hidden = false;
    result.setAttribute("aria-labelledby", "contact-result-title");
    result.focus();
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
