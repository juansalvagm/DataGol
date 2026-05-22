const Parser = require("rss-parser");

const parser = new Parser();

const feeds = [
  "https://www.marca.com/rss/futbol/primera-division.xml",
  "https://as.com/rss/futbol/primera.xml"
];

const obtenerNoticias = async () => {
  try {
    const noticias = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);

        feed.items.slice(0, 8).forEach((item) => {
          noticias.push({
            titulo: item.title || "Sin título",
            enlace: item.link || "#",
            fecha: item.pubDate || new Date(),
            fuente: feed.title || "Fuente desconocida",
            descripcion:
              item.contentSnippet ||
              item.content ||
              "Noticia de actualidad futbolística."
          });
        });
      } catch (error) {
        console.error(`Error leyendo feed ${feedUrl}:`, error.message);
      }
    }

    return noticias.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

  } catch (error) {
    console.error("Error obteniendo noticias:", error.message);
    return [];
  }
};

module.exports = {
  obtenerNoticias
};