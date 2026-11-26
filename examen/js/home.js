/* Landing: tarjetas de proyectos y filtros */
(function () {
  "use strict";

  var el = Site.el, asset = Site.asset;
  var projects = window.PROJECTS || [];
  var labels = window.PROJECT_CATEGORIES || {};
  var cardsEl = document.getElementById("cards");
  if (!cardsEl) return;

  function pageUrl(p) { return "proyectos/" + p.id + ".html"; }

  function cover(p) {
    var link = el("a", { class: "card__image", href: pageUrl(p), "aria-label": "Ver proyecto " + p.title, tabindex: "-1" });
    if (p.cover) {
      link.appendChild(el("img", { src: asset(p.cover), alt: "", loading: "lazy" }));
    } else {
      link.classList.add("card__image--generated");
      link.appendChild(el("span", { text: p.generatedCover || p.title }));
    }
    return link;
  }

  projects.forEach(function (p) {
    var buttons = [el("a", { class: "btn", href: pageUrl(p), text: "Ver proyecto" })];
    if (p.pages) {
      buttons.push(el("a", { class: "btn btn--ghost", href: p.pages, target: "_blank", rel: "noopener", text: "Abrir experiencia ↗" }));
    }

    var eyebrow = labels[p.category] || "";
    if (/^DIS9087/.test(p.course || "")) eyebrow += " · Curso DIS9087";

    cardsEl.appendChild(el("article", { class: "card card--project", "data-category": p.category }, [
      cover(p),
      el("div", { class: "card__body" }, [
        el("div", { class: "card__text-wrap" }, [
          el("p", { class: "card__eyebrow", text: eyebrow }),
          el("h3", { class: "card__title" }, [el("a", { href: pageUrl(p), text: p.title })]),
          el("p", { class: "card__text", text: p.summary })
        ]),
        el("div", { class: "btn-group" }, buttons)
      ])
    ]));
  });

  /* Filtros */
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      var f = chip.getAttribute("data-filter");
      cardsEl.querySelectorAll(".card").forEach(function (card) {
        card.hidden = f !== "todos" && card.getAttribute("data-category") !== f;
      });
    });
  });
})();
