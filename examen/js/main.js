(function () {
  "use strict";

  var projects = window.PROJECTS || [];
  var $ = function (sel) { return document.querySelector(sel); };

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Menú desplegable ---------------- */
  var toggle = $("#menuToggle");
  var menu = $("#mainMenu");

  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
  });

  /* ---------------- Tarjetas de proyectos ---------------- */
  var cardsEl = $("#cards");

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

  function coverFor(p) {
    var btn = el("button", { class: "card__image", "aria-label": "Ver proyecto " + p.title });
    if (p.cover) {
      btn.appendChild(el("img", { src: p.cover, alt: "", loading: "lazy" }));
    } else if (p.coverVideo) {
      var v = el("video", { src: p.coverVideo + "#t=1", muted: "", loop: "", playsinline: "", preload: "metadata" });
      v.muted = true;
      btn.appendChild(v);
      btn.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
      btn.addEventListener("mouseleave", function () { v.pause(); });
    } else {
      btn.classList.add("card__image--generated");
      btn.appendChild(el("span", { text: p.generatedCover || p.title }));
    }
    btn.addEventListener("click", function () { openProject(p); });
    return btn;
  }

  var CATEGORY_LABELS = { moda: "Moda", industrial: "Diseño industrial", digital: "Interacción digital" };

  projects.forEach(function (p) {
    var viewBtn = el("button", { class: "btn", type: "button", text: "Ver proyecto" });
    viewBtn.addEventListener("click", function () { openProject(p); });

    var buttons = [viewBtn];
    (p.links || []).forEach(function (l) {
      if (!l.external) return;
      buttons.push(el("a", { class: "btn btn--ghost", href: l.href, target: "_blank", rel: "noopener", text: "Visitar sitio" }));
    });

    var card = el("article", { class: "card card--project", "data-category": p.category }, [
      coverFor(p),
      el("div", { class: "card__body" }, [
        el("div", { class: "card__text-wrap" }, [
          el("p", { class: "card__eyebrow", text: CATEGORY_LABELS[p.category] || "" }),
          el("h3", { class: "card__title", text: p.title }),
          el("p", { class: "card__text", text: p.summary })
        ]),
        el("div", { class: "btn-group" }, buttons)
      ])
    ]);
    cardsEl.appendChild(card);
  });

  /* Filtros */
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      var f = chip.getAttribute("data-filter");
      cardsEl.querySelectorAll(".card").forEach(function (card) {
        card.hidden = f !== "todos" && card.getAttribute("data-category") !== f;
      });
    });
  });

  /* ---------------- Detalle de proyecto ---------------- */
  var dialog = $("#projectDialog");

  function youtubeId(url) {
    var m = (url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  function openProject(p) {
    $("#projectMeta").textContent = p.meta;
    $("#projectTitle").textContent = p.title;

    var desc = $("#projectDesc");
    desc.innerHTML = "";
    p.description.forEach(function (t) { desc.appendChild(el("p", { text: t })); });

    var links = $("#projectLinks");
    links.innerHTML = "";
    (p.links || []).forEach(function (l) {
      var attrs = { class: "btn", href: l.href, text: l.label };
      attrs.target = "_blank"; attrs.rel = "noopener";
      links.appendChild(el("a", attrs));
    });

    var media = $("#projectMedia");
    media.innerHTML = "";
    if ("youtube" in p) {
      var id = youtubeId(p.youtube);
      if (id) {
        // Portada con botón de play: el reproductor de YouTube se carga al hacer clic.
        // Abierto como archivo local (file://) YouTube no permite insertar el video,
        // así que en ese caso se abre en una pestaña nueva.
        var watchUrl = "https://www.youtube.com/watch?v=" + id;
        var label = (p.videoTitle || "Video") + " · " + p.title;
        var frame = el("div", { class: "video-frame" });
        var facade = el("button", { class: "video-facade", type: "button", "aria-label": "Reproducir " + label }, [
          el("img", { src: p.videoPoster || "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: "" }),
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
        media.appendChild(frame);
        media.appendChild(el("a", { class: "video-link", href: watchUrl, target: "_blank", rel: "noopener", text: "Ver en YouTube ↗" }));
      } else {
        var pending = el("div", { class: "video-frame video-frame--pending" });
        pending.innerHTML = "<div><strong>" + (p.videoTitle || "Video") + "</strong>Próximamente en YouTube</div>";
        media.appendChild(pending);
      }
    } else if (p.video) {
      media.appendChild(el("div", { class: "video-frame" }, [
        el("video", { src: p.video, controls: "", preload: "metadata", playsinline: "" })
      ]));
    }

    var gallery = $("#projectGallery");
    gallery.innerHTML = "";
    (p.gallery || []).forEach(function (img, i) {
      var b = el("button", { type: "button", "aria-label": "Ampliar imagen " + (i + 1) }, [
        el("img", { src: img.thumb, alt: p.title + " — imagen " + (i + 1), loading: "lazy" })
      ]);
      var ratio = img.ratio || p.galleryRatio;
      if (ratio) b.style.setProperty("--ratio", ratio);
      if (img.wide) b.classList.add("is-wide");
      b.addEventListener("click", function () { openLightbox(p.gallery, i); });
      gallery.appendChild(b);
    });

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.scrollTop = 0;
    document.body.style.overflow = "hidden";
    // Enlace compartible: index.html#proyecto-<id>
    if (history.replaceState) history.replaceState(null, "", "#proyecto-" + p.id);
  }

  function closeProject() {
    dialog.querySelectorAll("video").forEach(function (v) { v.pause(); });
    var iframe = dialog.querySelector("iframe");
    if (iframe) iframe.remove(); // detiene YouTube
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
    $("#projectMedia").innerHTML = "";
    if (history.replaceState) history.replaceState(null, "", "#proyectos");
  });
  $("#projectClose").addEventListener("click", closeProject);
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeProject(); // clic en el fondo
  });

  /* ---------------- Lightbox ---------------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
  var lbList = [], lbIndex = 0;

  function showLb() {
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = "Imagen " + (lbIndex + 1) + " de " + lbList.length;
    lbCount.textContent = (lbIndex + 1) + " / " + lbList.length;
    var multi = lbList.length > 1;
    $("#lbPrev").hidden = !multi;
    $("#lbNext").hidden = !multi;
  }
  // El visor es un <dialog> modal para quedar por encima del detalle del proyecto
  function openLightbox(list, i) { lbList = list; lbIndex = i; showLb(); lb.showModal(); $("#lbClose").focus(); }
  function closeLightbox() { if (lb.open) lb.close(); }
  function step(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); }

  lb.addEventListener("close", function () { lbImg.removeAttribute("src"); });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", function () { step(-1); });
  $("#lbNext").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });

  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  /* Abrir proyecto desde la URL (#proyecto-<id>) */
  var m = location.hash.match(/^#proyecto-(.+)$/);
  if (m) {
    var target = projects.filter(function (p) { return p.id === m[1]; })[0];
    if (target) openProject(target);
  }
})();
