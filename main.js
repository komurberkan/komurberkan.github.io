/* =========================================================================
   Portfolio behaviour. No dependencies.
   Scroll work uses IntersectionObserver only, never a scroll listener.
   ========================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------------
     1. Theme. Stored choice wins, otherwise follow the operating system.
     --------------------------------------------------------------------- */
  var STORE_KEY = "portfolio-theme";
  var toggle = document.getElementById("theme-toggle");
  var icon = document.querySelector("[data-theme-icon]");

  function systemIsDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentIsDark() {
    var set = root.getAttribute("data-theme");
    if (set === "dark") return true;
    if (set === "light") return false;
    return systemIsDark();
  }

  function paintIcon() {
    if (!icon) return;
    var dark = currentIsDark();
    icon.className = dark ? "ph ph-moon" : "ph ph-sun";
    if (toggle) {
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  try {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {
    /* private mode or storage disabled: fall back to the system preference */
  }

  paintIcon();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentIsDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* ignore */ }
      paintIcon();
    });
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (!root.hasAttribute("data-theme") || root.getAttribute("data-theme") === "auto") paintIcon();
  });

  /* ---------------------------------------------------------------------
     2. Image empty states. If a placeholder file has not been added yet,
        the frame shows a labelled slot instead of a broken image icon.
     --------------------------------------------------------------------- */
  function markEmpty(img) {
    var frame = img.closest("[data-frame]");
    if (!frame) return;
    frame.classList.add("is-empty");
    img.style.display = "none";
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-frame] img"),
    function (img) {
      img.addEventListener("error", function () { markEmpty(img); });
      // The error may already have fired before this script ran.
      if (img.complete && img.naturalWidth === 0) markEmpty(img);
    }
  );

  /* ---------------------------------------------------------------------
     3. Scroll reveal. Reveals on entry so the eye lands on one block at a
        time instead of the whole page arriving at once.
     --------------------------------------------------------------------- */
  var revealables = document.querySelectorAll("[data-reveal]");

  if (reduced.matches || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     4. Marquee. The track animates to translateX(-50%), so its first half
        has to be at least a viewport wide or a gap opens up at the loop
        point. One row is usually narrower than that, so the row is repeated
        until the half fills the screen, then the whole half is duplicated.
     --------------------------------------------------------------------- */
  var originalRow = document.querySelector("[data-marquee-row]");
  var track = originalRow && originalRow.parentNode;

  function buildMarquee() {
    if (!track) return;

    // Reset to a single row before measuring.
    while (track.children.length > 1) track.removeChild(track.lastChild);
    track.style.animationDuration = "";

    if (reduced.matches) return;

    var rowWidth = originalRow.getBoundingClientRect().width;
    if (!rowWidth) return;

    var perHalf = Math.max(2, Math.ceil(window.innerWidth / rowWidth) + 1);

    function addCopy() {
      var copy = originalRow.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.removeAttribute("data-marquee-row");
      Array.prototype.forEach.call(copy.querySelectorAll("img"), function (img) {
        img.setAttribute("alt", "");
      });
      track.appendChild(copy);
    }

    for (var i = 1; i < perHalf * 2; i++) addCopy();

    // Keep the pixels-per-second rate steady however many copies were needed.
    track.style.animationDuration = Math.round((perHalf * rowWidth) / 45) + "s";
  }

  buildMarquee();

  // Logos are lazy loaded, so remeasure once they have real dimensions.
  window.addEventListener("load", buildMarquee);

  var rebuildTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(buildMarquee, 200);
  });

  /* ---------------------------------------------------------------------
     5. Copy email. Confirms the action, then returns to the resting label.
     --------------------------------------------------------------------- */
  var copyBtn = document.getElementById("copy-mail");

  if (copyBtn) {
    var label = copyBtn.querySelector("[data-copy-label]");
    var copyIcon = copyBtn.querySelector("[data-copy-icon]");
    var resting = label ? label.textContent : "";
    var timer = null;

    function flash(text, iconClass) {
      if (label) label.textContent = text;
      if (copyIcon) copyIcon.className = "ph " + iconClass;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (label) label.textContent = resting;
        if (copyIcon) copyIcon.className = "ph ph-copy";
      }, 2000);
    }

    copyBtn.addEventListener("click", function () {
      var address = copyBtn.getAttribute("data-mail") || "";

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(
          function () { flash("Copied", "ph-check"); },
          function () { flash(address, "ph-warning"); }
        );
        return;
      }

      // file:// and other non-secure contexts have no clipboard API.
      flash(address, "ph-warning");
    });
  }

  /* ---------------------------------------------------------------------
     6. CV button. It stays hidden until assets/cv.pdf actually exists, so
        the page never offers a download that 404s.
     --------------------------------------------------------------------- */
  var cvLink = document.getElementById("cv-link");

  if (cvLink && window.fetch && location.protocol !== "file:") {
    fetch(cvLink.getAttribute("href"), { method: "HEAD" })
      .then(function (res) {
        if (res.ok) cvLink.hidden = false;
      })
      .catch(function () {
        /* no CV yet, leave the button hidden */
      });
  }
})();
