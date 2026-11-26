/*
 * Componentes adaptados de Motion Primitives — https://motion-primitives.com
 *   · TextEffect   (components/core/text-effect.tsx)
 *   · TextShimmer  (components/core/text-shimmer.tsx)
 * Copyright (c) 2024 ibelick — MIT License (ver licenses/motion-primitives-MIT.txt)
 *
 * Adaptación: el original usa React + Motion. Aquí se reescribe en JavaScript sin
 * framework y las animaciones pasan a CSS (ver "Componentes" en css/styles.css),
 * manteniendo sus presets, tiempos de escalonado (stagger) y duración por segmento,
 * con los colores del portafolio.
 *
 * Uso en HTML:
 *   <h1 data-text-effect data-per="char" data-preset="fade-in-blur" data-delay="0.2">Texto</h1>
 *   <p data-text-shimmer data-duration="3" data-spread="3">Texto</p>
 */
(function () {
  "use strict";

  // Igual que en el original: tiempo entre segmentos según cómo se divide el texto
  var STAGGER = { char: 0.03, word: 0.05, line: 0.1 };
  var PRESETS = ["blur", "fade-in-blur", "scale", "fade", "slide"];

  function splitText(text, per) {
    if (per === "line") return text.split("\n");
    return text.split(/(\s+)/);
  }

  function span(className, text) {
    var s = document.createElement("span");
    s.className = className;
    if (text != null) s.textContent = text;
    return s;
  }

  /* ---------- TextEffect ---------- */
  function textEffect(el) {
    var text = el.textContent.trim();
    var per = el.getAttribute("data-per") || "word";
    var preset = el.getAttribute("data-preset") || "fade";
    if (PRESETS.indexOf(preset) === -1) preset = "fade";
    var delay = parseFloat(el.getAttribute("data-delay") || "0");
    var speedReveal = parseFloat(el.getAttribute("data-speed-reveal") || "1");
    var speedSegment = parseFloat(el.getAttribute("data-speed-segment") || "1");

    var stagger = STAGGER[per] / speedReveal;
    var duration = 0.3 / speedSegment;

    el.textContent = "";
    el.classList.add("te", "te--" + preset);
    el.style.setProperty("--te-duration", duration + "s");

    // Texto accesible para lectores de pantalla (como el sr-only del original)
    if (per !== "line") el.appendChild(span("sr-only", text));

    var index = 0;
    function item(content, extra) {
      var s = span("te__item" + (extra ? " " + extra : ""), content);
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--te-delay", (delay + index * stagger).toFixed(3) + "s");
      index++;
      return s;
    }

    splitText(text, per).forEach(function (segment) {
      if (per === "line") {
        el.appendChild(item(segment, "te__item--line"));
      } else if (per === "word") {
        el.appendChild(item(segment));
      } else {
        var word = span("te__word");
        word.setAttribute("aria-hidden", "true");
        segment.split("").forEach(function (ch) { word.appendChild(item(ch)); });
        el.appendChild(word);
      }
    });

    // Se activa al entrar en pantalla (equivale a trigger=true)
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  }

  /* ---------- TextShimmer ---------- */
  function textShimmer(el) {
    var duration = parseFloat(el.getAttribute("data-duration") || "2");
    var spread = parseFloat(el.getAttribute("data-spread") || "2");
    // Igual que el original: el ancho del brillo depende del largo del texto
    el.style.setProperty("--spread", el.textContent.trim().length * spread + "px");
    el.style.setProperty("--shimmer-duration", duration + "s");
    el.classList.add("text-shimmer");
  }

  function init(root) {
    (root || document).querySelectorAll("[data-text-effect]").forEach(textEffect);
    (root || document).querySelectorAll("[data-text-shimmer]").forEach(textShimmer);
  }

  window.Components = { init: init, textEffect: textEffect, textShimmer: textShimmer };
})();
