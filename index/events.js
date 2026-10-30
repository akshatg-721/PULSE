/**
 * events.js — Fetches all events from the API and renders them on the page.
 *
 * Wrapped in an IIFE so nothing leaks into the global scope except what is
 * explicitly intended (allEvents is kept module-local here; expose it on
 * window if other scripts ever need it).
 */
(function () {

  /* ------------------------------------------------------------------ */
  /* allEvents
   * The master list of events returned by the server.
   * Declared at the top of the IIFE so renderEvents (and future filter /
   * search / sort code) can all read from the same array.
   * ------------------------------------------------------------------ */
  var allEvents = [];

  /* ------------------------------------------------------------------ */
  /* formatDate
   * Turns a YYYY-MM-DD string (e.g. "2026-08-28") into a human-friendly
   * string (e.g. "28 Aug 2026") so the card looks nicer than a raw ISO date.
   * ------------------------------------------------------------------ */
  function formatDate(isoDate) {
    var months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
    var parts = isoDate.split("-");
    var year  = parts[0];
    var month = months[Number(parts[1]) - 1];
    var day   = Number(parts[2]);
    return day + " " + month + " " + year;
  }

  /* ------------------------------------------------------------------ */
  /* renderEvents
   * Receives a list of event objects and draws one card for each one
   * inside the #events-grid container.
   * If the list is empty it shows the #empty "no results" message instead.
   * Each card contains: title, category badge, date, time, venue, club name,
   * and a "Register" link that pre-fills the event title in the query string.
   * ------------------------------------------------------------------ */
  function renderEvents(list) {
    var grid  = document.getElementById("events-grid");
    var empty = document.getElementById("empty");

    if (!grid) return;

    // Clear whatever was rendered before.
    grid.innerHTML = "";

    if (list.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    list.forEach(function (event) {
      var registerHref = "/index/register.html?event=" + encodeURIComponent(event.title);

      var card = document.createElement("article");
      card.className = "event-card";
      card.innerHTML =
        '<div class="event-card-thumb"></div>'
        + '<div class="event-card-body">'
        +   '<span class="event-category event-category--' + event.category.toLowerCase() + '">'
        +     event.category
        +   '</span>'
        +   '<h2 class="event-card-title">' + event.title + '</h2>'
        +   '<p class="event-card-meta">'
        +     '<span class="event-meta-date">\uD83D\uDCC5 ' + formatDate(event.date) + ' &middot; ' + event.time + '</span>'
        +   '</p>'
        +   '<p class="event-card-meta">'
        +     '<span class="event-meta-venue">\uD83D\uDCCD ' + event.venue + '</span>'
        +   '</p>'
        +   '<p class="event-card-club">' + event.club + '</p>'
        +   '<a class="event-register-btn" href="' + registerHref + '">Register &rarr;</a>'
        + '</div>';

      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ */
  /* loadEvents
   * Calls GET /api/events, stores the returned array in allEvents, then
   * passes it to renderEvents so the page displays immediately.
   * Shows a brief loading state while the request is in flight and logs
   * any network or JSON errors to the console without crashing the page.
   * ------------------------------------------------------------------ */
  function loadEvents() {
    var grid = document.getElementById("events-grid");
    if (grid) {
      grid.innerHTML = '<p class="events-loading">Loading events\u2026</p>';
    }

    fetch("/api/events")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Server returned " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        allEvents = Array.isArray(data) ? data : [];
        renderEvents(allEvents);
      })
      .catch(function (err) {
        console.error("Could not load events:", err);
        allEvents = [];
        renderEvents([]);
      });
  }

  /* ------------------------------------------------------------------ */
  /* TODO — Filtering, searching and sorting
   * ================================================================
   * The functions below are intentionally left empty so the developer
   * can implement them independently.
   *
   * Suggested approach:
   *
   *   function getFilteredList() {
   *     var query    = document.getElementById("search").value.toLowerCase();
   *     var category = activeCategory;          // track with a variable
   *     var sort     = document.getElementById("sort").value;
   *
   *     var result = allEvents.filter(function (e) {
   *       var matchesCategory = category === "All" || e.category === category;
   *       var matchesSearch   = e.title.toLowerCase().includes(query)
   *                          || e.club.toLowerCase().includes(query)
   *                          || e.venue.toLowerCase().includes(query);
   *       return matchesCategory && matchesSearch;
   *     });
   *
   *     if (sort === "name") {
   *       result.sort(function (a, b) { return a.title.localeCompare(b.title); });
   *     } else {
   *       result.sort(function (a, b) { return a.date.localeCompare(b.date); });
   *     }
   *
   *     return result;
   *   }
   *
   *   Wire up listeners on #search (input event), .filter-btn (click),
   *   and #sort (change), each calling:
   *     renderEvents(getFilteredList());
   * ================================================================
   * END TODO
   * ------------------------------------------------------------------ */

  // Kick everything off once the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadEvents);
  } else {
    loadEvents();
  }

}());
