(function () {
  var intro = document.getElementById("site-intro");
  if (!intro) return;

  var fallbackTimer;

  function removeIntro() {
    if (intro.parentNode) {
      intro.parentNode.removeChild(intro);
    }
    window.clearTimeout(fallbackTimer);
  }

  intro.addEventListener("animationend", removeIntro, { once: true });
  fallbackTimer = window.setTimeout(removeIntro, 2400);
})();
