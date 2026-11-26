/*
 * Datos de los proyectos del portafolio.
 * Cada proyecto tiene su subpágina en proyectos/<id>.html, que se arma con estos datos.
 * Las rutas de imágenes son relativas a la raíz del sitio.
 */
(function () {
  // Genera rutas "assets/img/<slug>/01.jpg" ... para n imágenes
  function range(slug, n) {
    var list = [];
    for (var i = 1; i <= n; i++) {
      var id = (i < 10 ? "0" : "") + i;
      list.push({
        src: "assets/img/" + slug + "/" + id + ".jpg",
        thumb: "assets/img/" + slug + "/" + id + "-thumb.jpg"
      });
    }
    return list;
  }

  window.PROJECT_CATEGORIES = {
    moda: "Moda",
    industrial: "Diseño industrial",
    digital: "Interacción digital"
  };

  window.PROJECTS = [
    {
      id: "actos-del-habla",
      title: "Actos del habla",
      category: "digital",
      course: "DIS9087 · Tarea 03 · MediaPipe y OpenCV",
      meta: "Interacción digital · Visión por computador",
      summary: "Una cámara, dos sistemas: las señas de la mano se vuelven sonido y las palabras detrás del gesto se vuelven color.",
      description: [
        "Una misma cámara. Dos sistemas de interpretación distintos. Uno escucha el gesto y lo convierte en sonido; el otro lee la palabra detrás del gesto y la convierte en color.",
        "El Sistema A reconoce la forma de la mano con MediaPipe Hands y, cuando identifica una seña, emite un sonido. El Sistema B recibe la palabra asociada a ese gesto y la traduce en un color que tiñe la escena."
      ],
      tools: ["HTML", "CSS", "JavaScript", "MediaPipe Hands", "Web Audio"],
      generatedCover: "Actos del habla",
      repo: "https://github.com/josefa-kristina/Actos-del-habla",
      pages: "https://josefa-kristina.github.io/Actos-del-habla/",
      // TODO: pega aquí el enlace de YouTube del video de la experiencia funcionando
      youtube: "",
      videoTitle: "Video de la experiencia"
    },
    {
      id: "marea",
      title: "MAREA",
      category: "digital",
      course: "DIS9087 · Tarea 06 · Sonidos",
      meta: "Interacción digital · Instalación sonora",
      summary: "Instalación sonora interactiva que sonifica el movimiento del mar según la agitación del agua.",
      description: [
        "Instalación sonora interactiva: un video en bucle del mar y una mezcla dinámica de sonidos ambientales que cambia según la agitación del agua.",
        "La plataforma también puede usar la cámara en vivo o cualquier otro video como fuente, para escuchar el movimiento de otras superficies."
      ],
      tools: ["HTML", "CSS", "JavaScript", "Web Audio", "Análisis de video"],
      cover: "assets/img/marea/cover.jpg",
      repo: "https://github.com/josefa-kristina/MAREA",
      pages: "https://josefa-kristina.github.io/MAREA/",
      youtube: "https://youtu.be/KIzZGi0QOBw",
      videoPoster: "assets/img/marea/poster.jpg",
      videoTitle: "Demo"
    },
    {
      id: "lumbar3",
      title: "Lumbar.3",
      category: "industrial",
      course: "Taller de Investigación y Desarrollo Material",
      meta: "Diseño industrial · Acero inoxidable",
      summary: "Taburete modular inspirado en la morfología de la columna, construido con láminas de acero inoxidable plegadas.",
      description: [
        "Producto de diseño fabricado bajo el concepto de utilizar la morfología humana en la creación de módulos.",
        "El proyecto final utiliza láminas finas de acero inoxidable, las cuales son ensambladas a través de encajes y plegados para generar una estructura resistente."
      ],
      team: "Josefa Araya, Antonia Osswald y Débora Soto",
      tools: ["Corte láser", "Plegado", "Curvado", "Pulido"],
      cover: "assets/img/lumbar3/cover.jpg",
      galleryRatio: "2000 / 1414",
      gallery: range("lumbar3", 24)
    },
    {
      id: "abisal",
      title: "Abisal",
      category: "industrial",
      course: "Taller de Investigación y Desarrollo Material",
      meta: "Diseño industrial · Tejido de alambre de aluminio",
      summary: "Lámpara tejida en alambre de aluminio, trabajado como un textil de punto para lograr una forma orgánica.",
      description: [
        "Producto de diseño fabricado bajo el concepto de utilizar un material no convencional, para adaptarlo a características igualitarias a un textil.",
        "La propuesta del proyecto final utiliza el alambre de aluminio como un textil de punto, donde su fabricación fue realizada como un hilado flexible, logrando una apariencia orgánica en la estructura."
      ],
      team: "Josefa Araya, Antonia Osswald y Débora Soto",
      tools: ["Tejido de punto", "Alambre de aluminio", "Estructura y conexión eléctrica"],
      cover: "assets/img/abisal/cover.jpg",
      galleryRatio: "2000 / 1414",
      gallery: range("abisal", 22)
    },
    {
      id: "atrabilis",
      title: "Atrabilis",
      category: "moda",
      course: "Diseño · mención Sistema Moda",
      meta: "Moda · Colección · Fashion film",
      summary: "Colección de moda presentada en pasarela y en un fashion film, con fichas técnicas de cada prenda.",
      description: [
        "Colección de vestuario presentada en pasarela y registrada en un fashion film.",
        "El proyecto incluye el desarrollo técnico de las prendas, documentado en sus fichas técnicas."
      ],
      tools: ["Patronaje", "Confección", "Fichas técnicas"],
      cover: "assets/img/atrabilis/01-thumb.jpg",
      youtube: "https://youtu.be/SNjaretGZXA",
      videoPoster: "assets/img/atrabilis/poster.jpg",
      videoTitle: "Fashion film",
      links: [
        { label: "Fichas técnicas (PDF)", href: "assets/docs/atrabilis-fichas-tecnicas.pdf" }
      ],
      galleryRatio: "3 / 4",
      gallery: range("atrabilis", 3)
    },
    {
      id: "grapefruit",
      title: "I'm Greatful Grapefruit",
      category: "moda",
      course: "Diseño · mención Sistema Moda",
      meta: "Moda · Fanzine · Fotografía",
      summary: "Fanzine y producción fotográfica de moda: volumen, pliegues y una paleta tierra sobre fondo oscuro.",
      description: [
        "Proyecto editorial de moda desarrollado en formato fanzine, acompañado de una producción fotográfica propia.",
        "La prenda explora el volumen a través de mangas fruncidas, solapas sobredimensionadas y una paleta cálida en tonos tierra."
      ],
      tools: ["Patronaje", "Confección", "Fanzine"],
      cover: "assets/img/grapefruit/01-thumb.jpg",
      galleryRatio: "4 / 5",
      gallery: range("grapefruit", 3).concat([
        // Lámina del fanzine: ocupa todo el ancho de la galería
        { src: "assets/img/grapefruit/04.jpg", thumb: "assets/img/grapefruit/04-thumb.jpg", ratio: "1024 / 362", wide: true }
      ])
    }
  ];
})();
