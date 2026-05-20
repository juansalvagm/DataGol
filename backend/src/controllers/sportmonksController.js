const sportmonksService = require("../services/sportmonksService");

const obtenerPartidosTemporada = async (req, res) => {
  try {
    const data = await sportmonksService.getFixturesTemporada();
    res.json(data);
  } catch (error) {
    console.error("Error Sportmonks fixtures:", error.response?.data || error.message);

    res.status(500).json({
      error: "Error al obtener partidos de Sportmonks",
      detalle: error.response?.data || error.message
    });
  }
};

const obtenerDetallePartido = async (req, res) => {
  try {
    const data = await sportmonksService.getFixtureDetalle(req.params.id);
    res.json(data);
  } catch (error) {
    console.error("Error Sportmonks fixture:", error.response?.data || error.message);

    res.status(500).json({
      error: "Error al obtener detalle del partido",
      detalle: error.response?.data || error.message
    });
  }
};

module.exports = {
  obtenerPartidosTemporada,
  obtenerDetallePartido
};