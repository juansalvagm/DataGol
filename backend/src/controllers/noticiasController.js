const noticiasService = require("../services/NoticiasService")

const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await noticiasService.obtenerNoticias();
    res.json(noticias);
  } catch (error) {
    console.error("Error noticias:", error.message);
    res.status(500).json({ error: "Error al obtener noticias" });
  }
};

module.exports = { obtenerNoticias };