/* =========================================================
   Paws & Purpose Animal Rescue — animals-ui.js
   Shared helpers for turning the animals dataset (animals-data.js)
   into DOM: the illustrated avatar and the animal card.
   Used by the Adopt page (listing + modal) and the enquiry form.
   Everything is built with createElement/textContent — never
   innerHTML with data — so content can't inject markup.
   ========================================================= */

window.PP = window.PP || {};

(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  /* Illustrated placeholder avatar (dog or cat) drawn from the animal's
     colour settings. Same artwork as the Part 2 static cards. */
  function avatar(animal) {
    var a = animal.art;
    var svg = svgEl("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
    var eye = a.eye;
    var mouth = a.mouth || "#332e2a";

    if (animal.type === "dog") {
      var body = { cx: 50, cy: 55, r: animal.id === "nala" ? 28 : 30, fill: a.body };
      if (a.stroke) { body.stroke = a.stroke; body["stroke-width"] = 2; }
      svg.appendChild(svgEl("circle", body));
      var earAttrs = { fill: a.ear };
      if (a.earOpacity) { earAttrs.opacity = a.earOpacity; earAttrs.fill = "#332e2a"; }
      svg.appendChild(svgEl("path", Object.assign({ d: "M26 40 Q18 15 38 25 Q40 42 34 48 Z" }, earAttrs)));
      svg.appendChild(svgEl("path", Object.assign({ d: "M74 40 Q82 15 62 25 Q60 42 66 48 Z" }, earAttrs)));
      svg.appendChild(svgEl("circle", { cx: 40, cy: 52, r: 3.2, fill: eye }));
      svg.appendChild(svgEl("circle", { cx: 60, cy: 52, r: 3.2, fill: eye }));
      svg.appendChild(svgEl("ellipse", { cx: 50, cy: 64, rx: 6, ry: 4, fill: mouth }));
    } else {
      var cat = { cx: 50, cy: 56, r: 26, fill: a.body };
      if (a.stroke) { cat.stroke = a.stroke; cat["stroke-width"] = 2; }
      svg.appendChild(svgEl("circle", cat));
      svg.appendChild(svgEl("path", { d: "M32 38 L26 18 L42 34 Z", fill: a.ear }));
      svg.appendChild(svgEl("path", { d: "M68 38 L74 18 L58 34 Z", fill: a.ear }));
      svg.appendChild(svgEl("circle", { cx: 42, cy: 54, r: 3, fill: eye }));
      svg.appendChild(svgEl("circle", { cx: 58, cy: 54, r: 3, fill: eye }));
      svg.appendChild(svgEl("path", {
        d: "M45 62 Q50 66 55 62", stroke: mouth, "stroke-width": 2, fill: "none", "stroke-linecap": "round"
      }));
    }
    return svg;
  }

  function statusLabel(animal) {
    return animal.status === "available" ? "Available" : "Meet & greet pending";
  }

  function formatRand(n) {
    return "R" + n.toLocaleString("en-ZA");
  }

  /* One adoptable-animal card. */
  function card(animal) {
    var article = document.createElement("article");
    article.className = "animal-card";
    article.setAttribute("data-animal-id", animal.id);

    var photo = document.createElement("div");
    photo.className = "animal-photo bg-" + animal.art.bg;
    photo.appendChild(avatar(animal));

    var badge = document.createElement("span");
    badge.className = "status-badge status-badge--" + animal.status;
    badge.textContent = statusLabel(animal);
    photo.appendChild(badge);

    var body = document.createElement("div");
    body.className = "animal-card-body";

    var h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(animal.name + " "));
    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = animal.type === "dog" ? "Dog" : "Cat";
    h3.appendChild(tag);

    var meta = document.createElement("p");
    meta.className = "animal-meta";
    meta.textContent = [animal.breed, animal.age, animal.traits[0]].join(" · ");

    var blurb = document.createElement("p");
    blurb.textContent = animal.blurb;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary btn-small js-meet";
    btn.setAttribute("data-animal-id", animal.id);
    btn.textContent = "Meet " + animal.name;
    btn.setAttribute("aria-haspopup", "dialog");

    body.appendChild(h3);
    body.appendChild(meta);
    body.appendChild(blurb);
    body.appendChild(btn);

    article.appendChild(photo);
    article.appendChild(body);
    return article;
  }

  PP.ui = {
    avatar: avatar,
    card: card,
    formatRand: formatRand,
    statusLabel: statusLabel,
    findAnimal: function (id) {
      var list = (PP.data && PP.data.animals) || [];
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    }
  };
})();
