/* =========================================================
   Paws & Purpose Animal Rescue — map.js (contact.html)
   Interactive map built with Leaflet (vendor/leaflet) and
   OpenStreetMap tiles. Features:
     - a marker + popup for each location (name, address, hours,
       "Get directions" link)
     - "Show on map" buttons in the contact details that fly to a
       marker and open its popup
     - "Find my nearest location": uses the browser Geolocation API
       (only if the visitor allows it — nothing is stored or sent)
   Location data lives in animals-data.js (PP.data.locations).
   Coordinates are approximate.
   ========================================================= */

(function () {
  "use strict";

  var mapEl = document.getElementById("map");
  if (!mapEl || !window.L || !window.PP || !PP.data) return;

  var locations = PP.data.locations;
  var status = document.getElementById("map-status");
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function say(text) { if (status) status.textContent = text; }

  var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Brand-coloured paw marker (a divIcon, so no extra image files are needed).
  var pawIcon = L.divIcon({
    className: "paw-marker",
    html: '<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true">' +
      '<circle cx="7" cy="7" r="2.4"/><circle cx="12.5" cy="4.6" r="2.4"/><circle cx="18" cy="7" r="2.4"/>' +
      '<path d="M12.5 10.2c-3.6 0-6.4 2.6-6.4 5.4 0 1.6 1.2 2.8 2.9 2.8.9 0 1.6-.3 2.4-.6.7-.3 1.4-.3 2.1 0 .8.3 1.5.6 2.4.6 1.7 0 2.9-1.2 2.9-2.8 0-2.8-2.7-5.4-6.3-5.4z"/></svg>',
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -28]
  });

  function directionsUrl(loc) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + loc.lat + "," + loc.lng;
  }

  function popupFor(loc) {
    var box = document.createElement("div");
    box.className = "map-popup";
    var h = document.createElement("strong");
    h.textContent = loc.name;
    var addr = document.createElement("p");
    addr.textContent = loc.address;
    var hrs = document.createElement("p");
    hrs.textContent = loc.hours;
    var link = document.createElement("a");
    link.href = directionsUrl(loc);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Get directions";
    box.appendChild(h); box.appendChild(addr); box.appendChild(hrs); box.appendChild(link);
    return box;
  }

  var markers = {};
  var bounds = [];
  locations.forEach(function (loc) {
    var marker = L.marker([loc.lat, loc.lng], { icon: pawIcon, title: loc.name, alt: loc.name, keyboard: true })
      .addTo(map)
      .bindPopup(popupFor(loc));
    markers[loc.id] = marker;
    bounds.push([loc.lat, loc.lng]);
  });

  function fitAll() { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: !reduceMotion }); }
  fitAll();
  markers.main.openPopup();

  /* ----- "Show on map" buttons next to each location ----- */
  document.querySelectorAll("[data-location]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var loc = locations.filter(function (l) { return l.id === btn.getAttribute("data-location"); })[0];
      if (!loc) return;
      map.flyTo([loc.lat, loc.lng], 15, { animate: !reduceMotion, duration: 0.8 });
      markers[loc.id].openPopup();
      mapEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      say("Showing " + loc.name + " on the map.");
    });
  });

  var fitBtn = document.getElementById("map-fit");
  if (fitBtn) fitBtn.addEventListener("click", function () { fitAll(); say("Showing both locations."); });

  /* ----- Nearest location (Geolocation API) ----- */
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  var youMarker = null;
  var locateBtn = document.getElementById("map-locate");
  if (locateBtn) {
    if (!("geolocation" in navigator)) {
      locateBtn.hidden = true;
    } else {
      locateBtn.addEventListener("click", function () {
        locateBtn.disabled = true;
        say("Looking for your location…");
        navigator.geolocation.getCurrentPosition(function (pos) {
          locateBtn.disabled = false;
          var lat = pos.coords.latitude, lng = pos.coords.longitude;
          var best = null;
          locations.forEach(function (loc) {
            var d = haversineKm(lat, lng, loc.lat, loc.lng);
            if (!best || d < best.d) best = { loc: loc, d: d };
          });
          if (youMarker) map.removeLayer(youMarker);
          youMarker = L.circleMarker([lat, lng], { radius: 8, color: "#3f6b8a", fillColor: "#3f6b8a", fillOpacity: 0.9 })
            .addTo(map).bindPopup("You are here");
          map.fitBounds([[lat, lng], [best.loc.lat, best.loc.lng]], { padding: [60, 60], animate: !reduceMotion });
          markers[best.loc.id].openPopup();
          say("Your nearest location is the " + best.loc.name + ", about " + best.d.toFixed(1) +
            " km away in a straight line.");
        }, function (err) {
          locateBtn.disabled = false;
          say(err && err.code === 1
            ? "Location permission was denied, so we can't work out the nearest location. You can still use the map."
            : "Sorry, we couldn't find your location. You can still use the map.");
        }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
      });
    }
  }

  // Leaflet needs a nudge if the container size changes (e.g. orientation change).
  window.addEventListener("resize", function () { map.invalidateSize(); });
})();
