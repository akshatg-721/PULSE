/** PULSE interaction layer: responsive navigation, reveal, pinned horizontal events,
 *  lightweight pointer depth and scroll-linked parallax. No animation dependency. */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var button = document.getElementById("nav-hamburger");
  var menu = document.getElementById("nav-menu");
  var header = document.getElementById("site-nav");

  function setMenu(open) {
    if (!button || !menu) return;
    menu.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (button && menu) {
    button.addEventListener("click", function () { setMenu(button.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) { if (header && !header.contains(e.target)) setMenu(false); });
  }

  var scrollY = window.scrollY;
  var ticking = false;
  var stage = document.querySelector("[data-horizontal-stage]");
  var track = document.querySelector("[data-horizontal-track]");
  var viewport = document.querySelector(".horizontal-viewport");
  var progress = document.querySelector("[data-progress-bar]");
  var maxTravel = 0;
  var stageTop = 0;
  var stageScrollLength = 0;
  var desktopQuery = window.matchMedia("(min-width: 900px)");

  function measure() {
    if (!stage || !track) return;
    if (desktopQuery.matches && !reduceMotion) {
      maxTravel = Math.max(0, track.scrollWidth - stage.clientWidth);
      stage.style.height = (window.innerHeight + maxTravel) + "px";
      stageScrollLength = Math.max(1, stage.offsetHeight - window.innerHeight);
      stageTop = stage.getBoundingClientRect().top + window.scrollY;
    } else {
      maxTravel = 0;
      stage.style.height = "auto";
      track.style.transform = "none";
    }
    updateScroll();
  }

  function updateScroll() {
    scrollY = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 12);
      header.style.setProperty("--nav-progress", Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    }
    if (stage && track && desktopQuery.matches && !reduceMotion && maxTravel > 0) {
      var raw = (scrollY - stageTop) / stageScrollLength;
      var p = Math.max(0, Math.min(1, raw));
      track.style.transform = "translate3d(" + (-maxTravel * p) + "px,0,0)";
      if (progress) progress.style.transform = "scaleX(" + Math.max(0.025, p) + ")";
    } else if (stage && track && progress) {
      var max = Math.max(1, track.scrollWidth - stage.clientWidth);
      var pMobile = Math.max(0, Math.min(1, (viewport ? viewport.scrollLeft : 0) / max));
      progress.style.transform = "scaleX(" + Math.max(0.025, pMobile) + ")";
    }
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      if (reduceMotion) return;
      var speed = Number(el.getAttribute("data-parallax")) || 0.1;
      var rect = el.parentElement.getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = "translate3d(0," + (-offset) + "px,0)";
    });
    ticking = false;
  }
  function requestTick() {
    if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () { window.requestAnimationFrame(measure); }, { passive: true });
  if (viewport) viewport.addEventListener("scroll", requestTick, { passive: true });
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", measure);
  window.addEventListener("load", measure);
  measure();

  // Reveal elements as they enter the viewport; preserve content if JS/IO is unavailable.
  var revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  // Pointer tilt is deliberately subtle and disabled for touch/reduced-motion users.
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--tilt-x", ((0.5 - y) * 3.5) + "deg");
        card.style.setProperty("--tilt-y", ((x - 0.5) * 4) + "deg");
        card.style.setProperty("--spot-x", (x * 100) + "%");
        card.style.setProperty("--spot-y", (y * 100) + "%");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });

    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate3d(" + (dx * 0.10) + "px," + (dy * 0.14) + "px,0)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = "translate3d(0,0,0)"; });
    });
  }

  // The page-load intro remains optional; remove it cleanly when reduced motion is enabled.
  var intro = document.getElementById("intro");
  var root = document.documentElement;
  if (intro) {
    var done = false;
    function endIntro() {
      if (done) return;
      done = true;
      root.classList.remove("intro-playing", "intro-revealing");
      intro.remove();
    }
    function skipIntro() { if (!done) { root.classList.add("intro-revealing"); intro.classList.add("is-skipping"); } }
    intro.addEventListener("animationstart", function (e) {
      if (e.target === intro && e.animationName === "intro-lift") root.classList.add("intro-revealing");
    });
    intro.addEventListener("animationend", function (e) { if (e.target === intro) endIntro(); });
    var skip = document.getElementById("intro-skip");
    if (skip) skip.addEventListener("click", skipIntro);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") skipIntro(); });
    if (!root.classList.contains("intro-playing")) endIntro();
  }
})();
