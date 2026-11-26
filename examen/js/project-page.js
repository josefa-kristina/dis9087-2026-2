/* Subpágina de proyecto: se arma con los datos de js/projects.js */
(function () {
  "use strict";

  var el = Site.el, asset = Site.asset;
  var projects = window.PROJECTS || [];
  var labels = window.PROJECT_CATEGORIES || {};
  var root = document.getElementById("project");
  var id = document.body.getAttribute("data-project");
  var index = -1;
  projects.forEach(function (p, i) { if (p.id === id) index = i; });
  if (!root || index === -1) return;
  var p = projects[index];

  function row(label, content) {
    return el("div", { class: "info__row" }, [el("dt", { text: label }), el("dd", {}, [content])]);
  }
  function text(t) { return document.createTextNode(t); }

  /* Encabezado */
  var head = el("header", { class: "page-head" }, [
    el("a", { class: "back-link", href: "../index.html#proyectos", text: "← Todos los proyectos" }),
    el("p", { class: "page-head__eyebrow", text: p.meta }),
    el("h1", { class: "page-head__title", "data-text-effect": "", "data-per": "char", "data-preset": "fade-in-blur", text: p.title }),
    el("p", { class: "page-head__lead", text: p.summary })
  ]);

  /* Descripción + ficha */
  var desc = el("div", { class: "project-desc" });
  p.description.forEach(function (t) { desc.appendChild(el("p", { text: t })); });

  var info = el("dl", { class: "info" });
  info.appendChild(row("Contexto", text(p.course || "")));
  info.appendChild(row("Área", text(labels[p.category] || "")));
  if (p.team) info.appendChild(row("Equipo", text(p.team)));
  if (p.tools && p.tools.length) {
    var tags = el("ul", { class: "tags tags--small" });
    p.tools.forEach(function (t) { tags.appendChild(el("li", { text: t })); });
    info.appendChild(row("Herramientas", tags));
  }

  var actions = el("div", { class: "btn-group" });
  if (p.pages) actions.appendChild(el("a", { class: "btn", href: p.pages, target: "_blank", rel: "noopener", text: "Abrir experiencia ↗" }));
  if (p.repo) actions.appendChild(el("a", { class: "btn btn--ghost", href: p.repo, target: "_blank", rel: "noopener", text: "Repositorio ↗" }));
  (p.links || []).forEach(function (l) {
    actions.appendChild(el("a", { class: "btn btn--ghost", href: asset(l.href), target: "_blank", rel: "noopener", text: l.label }));
  });

  var aside = el("aside", { class: "card info-card" }, [info]);
  if (actions.children.length) aside.appendChild(actions);
  if (!p.pages) {
    aside.appendChild(el("p", { class: "info-card__note", text: "Proyecto físico: el video y las imágenes muestran el resultado." }));
  }

  var body = el("section", { class: "project-body" }, [desc, aside]);

  /* Video */
  var media = null;
  if ("youtube" in p) {
    media = el("section", { class: "project-media", "aria-label": "Video" }, [
      Site.videoBlock(p.youtube, (p.videoTitle || "Video") + " · " + p.title, p.videoPoster)
    ]);
  }

  /* Galería */
  var gallery = null;
  if (p.gallery && p.gallery.length) {
    gallery = el("section", { class: "project-gallery", "aria-label": "Galería" });
    p.gallery.forEach(function (img, i) {
      var b = el("button", { type: "button", "aria-label": "Ampliar imagen " + (i + 1) }, [
        el("img", { src: asset(img.thumb), alt: p.title + " — imagen " + (i + 1), loading: "lazy" })
      ]);
      var ratio = img.ratio || p.galleryRatio;
      if (ratio) b.style.setProperty("--ratio", ratio);
      if (img.wide) b.classList.add("is-wide");
      b.addEventListener("click", function () { Site.openLightbox(p.gallery, i); });
      gallery.appendChild(b);
    });
  }

  /* Anterior / siguiente */
  var prev = projects[(index - 1 + projects.length) % projects.length];
  var next = projects[(index + 1) % projects.length];
  var nav = el("nav", { class: "project-nav", "aria-label": "Otros proyectos" }, [
    el("a", { class: "project-nav__link", href: prev.id + ".html" }, [
      el("span", { text: "← Anterior" }), el("strong", { text: prev.title })
    ]),
    el("a", { class: "project-nav__link project-nav__link--next", href: next.id + ".html" }, [
      el("span", { text: "Siguiente →" }), el("strong", { text: next.title })
    ])
  ]);

  root.innerHTML = "";
  [head, body, media, gallery, nav].forEach(function (n) { if (n) root.appendChild(n); });
  document.title = p.title + " — Josefa Araya";
  Components.init(root);
})();
