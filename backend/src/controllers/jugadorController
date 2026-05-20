const footballService = require("../services/footballService");

const obtenerJugadores = async (req, res) => {
  try {
    const idEquipo = req.params.idEquipo;
    const data = await footballService.getJugadoresPorEquipo(idEquipo);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener jugadores:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
};

module.exports = { obtenerJugadores };