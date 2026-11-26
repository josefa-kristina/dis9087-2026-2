/*
 * Funciones compartidas por todas las páginas:
 * menú desplegable, año del footer, visor de imágenes y bloque de video de YouTube.
 */
(function () {
  "use strict";

  // Las subpáginas (proyectos/...) declaran data-base="../" para encontrar los archivos
  var BASE = document.body.getAttribute("data-base") || "";

  function asset(path) {
    if (!path || /^(https?:|mailto:|#)/.test(path)) return path;
    return BASE + path;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  /* ---------------- Año ---------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------- Menú desplegable ---------------- */
  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mainMenu");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };
    toggle.addEventListener("click", function (e) { e.stopPropagation(); setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------------- Visor de imágenes (lightbox) ---------------- */
  var lb = document.getElementById("lightbox");
  var lbList = [], lbIndex = 0;

  function showLb() {
    var img = document.getElementById("lbImg");
    img.src = asset(lbList[lbIndex].src);
    img.alt = "Imagen " + (lbIndex + 1) + " de " + lbList.length;
    document.getElementById("lbCount").textContent = (lbIndex + 1) + " / " + lbList.length;
    var multi = lbList.length > 1;
    document.getElementById("lbPrev").hidden = !multi;
    document.getElementById("lbNext").hidden = !multi;
  }
  function step(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); }
  function openLightbox(list, i) {
    if (!lb) return;
    lbList = list; lbIndex = i; showLb();
    lb.showModal();
    document.getElementById("lbClose").focus();
  }
  if (lb) {
    document.getElementById("lbClose").addEventListener("click", function () { lb.close(); });
    document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
    document.getElementById("lbNext").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
    lb.addEventListener("close", function () { document.getElementById("lbImg").removeAttribute("src"); });
  }

  /* ---------------- Video de YouTube ---------------- */
  function youtubeId(url) {
    var m = (url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  // Portada con botón de play: el reproductor de YouTube se carga al hacer clic.
  // Abierto como archivo local (file://) YouTube no permite insertar videos,
  // así que en ese caso se abre en una pestaña nueva.
  function videoBlock(url, label, poster) {
    var id = youtubeId(url);
    var wrap = el("div", { class: "video" });
    if (!id) {
      var pending = el("div", { class: "video-frame video-frame--pending" });
      pending.appendChild(el("div", {}, [el("strong", { text: label }), el("span", { text: "Video próximamente" })]));
      wrap.appendChild(pending);
      return wrap;
    }
    var watchUrl = "https://www.youtube.com/watch?v=" + id;
    var frame = el("div", { class: "video-frame" });
    var facade = el("button", { class: "video-facade", type: "button", "aria-label": "Reproducir " + label }, [
      el("img", { src: poster ? asset(poster) : "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: "" }),
      el("span", { class: "video-facade__play", "aria-hidden": "true" }),
      el("span", { class: "video-facade__label", text: label })
    ]);
    facade.addEventListener("click", function () {
      if (location.protocol === "file:") { window.open(watchUrl, "_blank", "noopener"); return; }
      frame.innerHTML = "";
      frame.appendChild(el("iframe", {
        src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0",
        title: label,
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        referrerpolicy: "strict-origin-when-cross-origin",
        allowfullscreen: ""
      }));
    });
    frame.appendChild(facade);
    wrap.appendChild(frame);
    wrap.appendChild(el("a", { class: "video-link", href: watchUrl, target: "_blank", rel: "noopener", text: "Ver en YouTube ↗" }));
    return wrap;
  }

  window.Site = { el: el, asset: asset, openLightbox: openLightbox, videoBlock: videoBlock };

  if (window.Components) window.Components.init();
})();
