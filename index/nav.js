/**
 * nav.js — Shared navigation and footer for every PULSE page.
 *
 * Drop <header id="site-nav"></header> and <footer id="site-footer"></footer>
 * into any HTML file, include this script, and the navbar + footer appear
 * automatically.
 */

/* ------------------------------------------------------------------ */
/* buildNavHTML
 * Creates the full inner HTML string for the <header>.
 * It loops over the NAV_LINKS list and marks the link whose href matches
 * the current page URL with the "active" class so it lights up.
 * ------------------------------------------------------------------ */
function buildNavHTML() {
  var currentPath = window.location.pathname;

  // Normalise "/" and "/index/main.html" so both show "Home" as active.
  var normPath = currentPath === "/" || currentPath === "/index/main.html"
    ? "/"
    : currentPath;

  var NAV_LINKS = [
    { label: "Home",    href: "/" },
    { label: "Events",  href: "/index/events.html" },
    { label: "Reels",   href: "/index/reels.html" },
    { label: "Clubs",   href: "/index/clubs.html" },
    { label: "About",   href: "/index/about.html" },
    { label: "Team",    href: "/index/team.html" },
    { label: "Contact", href: "/index/contact.html" }
  ];

  var navItems = NAV_LINKS.map(function (link) {
    var isActive = (link.href === "/" ? normPath === "/" : normPath === link.href);
    return '<li>'
      + '<a href="' + link.href + '"'
      + (isActive ? ' class="nav-active" aria-current="page"' : '')
      + '>' + link.label + '</a>'
      + '</li>';
  }).join("\n      ");

  return ''
    + '<div class="nav-inner">'
    +   '<a href="/" class="nav-logo" aria-label="PULSE home"><strong>PULSE</strong></a>'
    +   '<button id="nav-hamburger" class="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu">'
    +     '<span></span><span></span><span></span>'
    +   '</button>'
    +   '<nav id="nav-menu" class="nav-menu" aria-label="Primary">'
    +     '<ul>'
    +       navItems
    +     '</ul>'
    +     '<div class="nav-auth">'
    +       '<a href="/index/signin.html"'
    +       (normPath === "/index/signin.html" ? ' class="nav-active" aria-current="page"' : '')
    +       '>Sign in</a>'
    +       '<a href="/index/signup.html" class="nav-btn'
    +       (normPath === "/index/signup.html" ? ' nav-active' : '')
    +       '"'
    +       (normPath === "/index/signup.html" ? ' aria-current="page"' : '')
    +       '>Sign up</a>'
    +     '</div>'
    +   '</nav>'
    + '</div>';
}

/* ------------------------------------------------------------------ */
/* buildFooterHTML
 * Returns the inner HTML string for the <footer>.
 * ------------------------------------------------------------------ */
function buildFooterHTML() {
  return '<p>\u00a9 2026 PULSE \u00b7 BML Munjal University</p>';
}

/* ------------------------------------------------------------------ */
/* injectNav
 * Finds the element with id="site-nav" and fills it with the navbar HTML.
 * Does nothing if the placeholder element is missing from the page.
 * ------------------------------------------------------------------ */
function injectNav() {
  var headerEl = document.getElementById("site-nav");
  if (!headerEl) return;
  headerEl.innerHTML = buildNavHTML();
}

/* ------------------------------------------------------------------ */
/* injectFooter
 * Finds the element with id="site-footer" and fills it with the footer HTML.
 * Does nothing if the placeholder element is missing from the page.
 * ------------------------------------------------------------------ */
function injectFooter() {
  var footerEl = document.getElementById("site-footer");
  if (!footerEl) return;
  footerEl.innerHTML = buildFooterHTML();
}

/* ------------------------------------------------------------------ */
/* initHamburger
 * Adds a click listener to the hamburger button so it toggles the
 * "nav-open" class on the <nav> and flips aria-expanded for accessibility.
 * ------------------------------------------------------------------ */
function initHamburger() {
  var btn  = document.getElementById("nav-hamburger");
  var menu = document.getElementById("nav-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu when the user clicks a link (helpful on mobile).
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Close the menu when the user clicks outside the navbar.
  document.addEventListener("click", function (e) {
    var headerEl = document.getElementById("site-nav");
    if (headerEl && !headerEl.contains(e.target)) {
      menu.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ------------------------------------------------------------------ */
/* init
 * Entry point — called once the DOM is ready.
 * Runs the three steps in order: inject header, inject footer, wire up
 * the hamburger button.
 * ------------------------------------------------------------------ */
function init() {
  injectNav();
  injectFooter();
  initHamburger();
}

// Run init() as soon as the HTML has been parsed (before images load).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
