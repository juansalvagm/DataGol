const Parser = require("rss-parser");

const parser = new Parser();

const feeds = [
  "https://www.marca.com/rss/futbol/primera-division.xml",
  "https://as.com/rss/futbol/primera.xml"
];

const obtenerNoticias = async () => {
  const noticias = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      feed.items.slice(0, 8).forEach((item) => {
        noticias.push({
          titulo: item.title,
          enlace: item.link,
          fecha: item.pubDate,
          fuente: feed.title,
          descripcion:
            item.contentSnippet ||
            item.content ||
            "Noticia de actualidad futbolística."
        });
      });
    } catch (error) {
      console.error("Error leyendo feed:", feedUrl, error.message);
    }
  }

  return noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
};

module.exports = { obtenerNoticias };