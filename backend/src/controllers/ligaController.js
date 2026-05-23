const footballService = require("../services/footballService");

const obtenerLigas = async (req, res) => {
  try {
    const data = await footballService.getLigas();
    res.json(data);
  } catch (error) {
    console.error(
      "Error al obtener ligas:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error al obtener ligas"
    });
  }
};

const obtenerEquipos = async (req, res) => {
  try {
    const codigoLiga = req.params.codigoLiga;

    const data = await footballService.getEquipos(codigoLiga);

    res.json(data);

  } catch (error) {
    console.error(
      "Error al obtener equipos:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error al obtener equipos"
    });
  }
};

const obtenerPartidos = async (req, res) => {
  try {
    const codigoLiga = req.params.codigoLiga;

    const data = await footballService.getPartidos(codigoLiga);

    const partidos = data.matches || [];

    res.json(partidos);

  } catch (error) {
    console.error(
      "Error al obtener partidos:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error al obtener partidos"
    });
  }
};

const obtenerClasificacion = async (req, res) => {
  try {
    const codigoLiga = req.params.codigoLiga;

    const data = await footballService.getClasificacion(codigoLiga);

    res.json(data);

  } catch (error) {
    console.error(
      "Error al obtener clasificación:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error al obtener clasificación"
    });
  }
};

module.exports = {
  obtenerLigas,
  obtenerEquipos,
  obtenerPartidos,
  obtenerClasificacion
};